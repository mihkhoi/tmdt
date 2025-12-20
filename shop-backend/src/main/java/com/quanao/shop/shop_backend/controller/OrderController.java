package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.dto.CreateOrderRequest;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.security.JwtUtil;
import com.quanao.shop.shop_backend.entity.OrderStatusHistory;
import com.quanao.shop.shop_backend.repository.OrderStatusHistoryRepository;
import com.quanao.shop.shop_backend.repository.OrderRepository;
import com.quanao.shop.shop_backend.service.OrderService;
import com.quanao.shop.shop_backend.pay.vnpay.VNPayService;
import com.quanao.shop.shop_backend.util.VNPayUtil;
import com.quanao.shop.shop_backend.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final VNPayService vnPayService;
    private final AppProperties appProperties;
    private final OrderRepository orderRepository;
    private final com.quanao.shop.shop_backend.pay.vietqr.VietQrService vietQrService;


    // Tạo đơn hàng mới: user phải gửi token
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest
    ) {
        String username = extractUsernameFromRequest(httpRequest);
        Order order = orderService.createOrder(username, request);
        return ResponseEntity.ok(order);
    }

    // Lấy danh sách đơn của user hiện tại
    @GetMapping("/my")
    public ResponseEntity<Page<Order>> myOrders(
            HttpServletRequest httpRequest,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String username = extractUsernameFromRequest(httpRequest);
        java.time.LocalDateTime start = null;
        java.time.LocalDateTime end = null;
        if (dateFrom != null && !dateFrom.isBlank()) {
            start = java.time.LocalDateTime.parse(dateFrom);
        }
        if (dateTo != null && !dateTo.isBlank()) {
            end = java.time.LocalDateTime.parse(dateTo);
        }
        Page<Order> orders = orderService.getMyOrdersPaged(username, status, keyword, start, end, page, size);
        return ResponseEntity.ok(orders);
    }

    // (tạm) Admin xem tất cả đơn
    @GetMapping
    public List<Order> all() {
        return orderService.getAllOrders();
    }

    // (tạm) Admin đổi trạng thái đơn
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable @NonNull Long id, @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }

    // ====== HÀM PHỤ LẤY USERNAME TỪ TOKEN ======
    private String extractUsernameFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = header.substring(7);
        return jwtUtil.extractUsername(token);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancel(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
        String username = extractUsernameFromRequest(httpRequest);
        return ResponseEntity.ok(orderService.cancelOrder(username, id));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<java.util.List<OrderStatusHistory>> timeline(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
        // Optional: check ownership/admin; simplified for demo
        return ResponseEntity.ok(statusHistoryRepository.findByOrder_IdOrderByCreatedAtAsc(id));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
        String username = extractUsernameFromRequest(httpRequest);
        var opt = orderService.getMyOrders(username).stream().filter(o -> o.getId().equals(id)).findFirst();
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.status(403).build());
    }

    // ====== VNPAY PAYMENT ENDPOINTS ======

    /**
     * Tạo payment URL cho VNPay
     * POST /api/orders/{id}/pay/vnpay/create
     */
    @PostMapping("/{id}/pay/vnpay/create")
    public ResponseEntity<Map<String, Object>> createVNPayPayment(
            @PathVariable @NonNull Long id,
            @RequestParam(required = false) String bankCode,
            @RequestParam(required = false) String returnUrl,
            HttpServletRequest httpRequest
    ) {
        try {
            String username = extractUsernameFromRequest(httpRequest);
            Order order = orderService.getMyOrders(username).stream()
                    .filter(o -> o.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Order not found or access denied"));

            if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Only PENDING orders can be paid"
                ));
            }

            String payUrl = vnPayService.createPaymentUrl(order, httpRequest, returnUrl, bankCode);
            return ResponseEntity.ok(Map.of("payUrl", payUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage() != null ? e.getMessage() : "Failed to create payment URL"
            ));
        }
    }

    @PostMapping("/{id}/pay/vnpay/confirm")
    public ResponseEntity<Map<String, Object>> confirmVNPayPayment(
            @PathVariable @NonNull Long id,
            HttpServletRequest request
    ) {
        try {
            java.util.Map<String, String> fields = new java.util.HashMap<>();
            java.util.Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    fields.put(fieldName, fieldValue);
                }
            }

            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing checksum"));
            }

            fields.remove("vnp_SecureHashType");
            fields.remove("vnp_SecureHash");

            java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
            java.util.Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            java.util.Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }

            String secretKey = appProperties.getPay().getVnpay().getSecretKey();
            if (secretKey == null || secretKey.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "VNPay not configured"));
            }

            String signValue = VNPayUtil.hmacSHA512(secretKey, hashData.toString());
            if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid checksum"));
            }

            String vnp_TxnRef = request.getParameter("vnp_TxnRef");
            if (vnp_TxnRef == null || !vnp_TxnRef.equals(String.valueOf(id))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order ID mismatch"));
            }

            String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");

            if ("00".equals(vnp_TransactionStatus) || "00".equals(vnp_ResponseCode)) {
                orderService.payIpn(id, "VNPay", vnp_TransactionNo);
                return ResponseEntity.ok(Map.of("success", true));
            }

            return ResponseEntity.badRequest().body(Map.of(
                    "error", getVNPayErrorMessage(vnp_ResponseCode)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage() != null ? e.getMessage() : "Payment confirmation error"
            ));
        }
    }

    /**
     * Xử lý callback từ VNPay sau khi thanh toán
     * GET /api/orders/{id}/pay/vnpay/return
     */
    @GetMapping("/{id}/pay/vnpay/return")
    public org.springframework.web.servlet.ModelAndView handleVNPayReturn(
            @PathVariable @NonNull Long id,
            HttpServletRequest request
    ) {
        try {
            // Lấy tất cả parameters từ VNPay - KHÔNG encode khi verify checksum
            java.util.Map<String, String> fields = new java.util.HashMap<>();
            java.util.Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    fields.put(fieldName, fieldValue);
                }
            }

            // Verify checksum - theo tài liệu VNPay
            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isBlank()) {
                return redirectToFrontend(id, "error", "Missing checksum");
            }

            // Remove secure hash fields
            if (fields.containsKey("vnp_SecureHashType")) {
                fields.remove("vnp_SecureHashType");
            }
            if (fields.containsKey("vnp_SecureHash")) {
                fields.remove("vnp_SecureHash");
            }

            java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
            java.util.Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            java.util.Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }
            
            // Get secret key from config
            String secretKey = appProperties.getPay().getVnpay().getSecretKey();
            if (secretKey == null || secretKey.isBlank()) {
                return redirectToFrontend(id, "error", "VNPay not configured");
            }

            String signValue = VNPayUtil.hmacSHA512(secretKey, hashData.toString());
            if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
                return redirectToFrontend(id, "error", "Invalid checksum");
            }

            // Lấy thông tin từ VNPay - theo demo sử dụng vnp_TransactionStatus
            String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String vnp_TxnRef = request.getParameter("vnp_TxnRef");
            String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");

            // Verify order ID
            if (vnp_TxnRef == null || !vnp_TxnRef.equals(String.valueOf(id))) {
                return redirectToFrontend(id, "error", "Order ID mismatch");
            }

            // Xử lý kết quả thanh toán - theo demo kiểm tra vnp_TransactionStatus
            if ("00".equals(vnp_TransactionStatus) || "00".equals(vnp_ResponseCode)) {
                // Thanh toán thành công
                try {
                    // Dùng payIpn vì đây là callback từ payment gateway, không cần username check
                    orderService.payIpn(id, "VNPay", vnp_TransactionNo);
                    return redirectToFrontend(id, "success", "Payment successful");
                } catch (Exception e) {
                    return redirectToFrontend(id, "error", "Failed to update order: " + e.getMessage());
                }
            } else {
                // Thanh toán thất bại
                String errorMsg = getVNPayErrorMessage(vnp_ResponseCode);
                return redirectToFrontend(id, "error", errorMsg);
            }
        } catch (Exception e) {
            return redirectToFrontend(id, "error", "Payment processing error: " + e.getMessage());
        }
    }

    /**
     * Xử lý IPN callback từ VNPay (server-to-server)
     * POST /api/orders/pay/vnpay/ipn
     */
    @PostMapping("/pay/vnpay/ipn")
    public ResponseEntity<Map<String, Object>> handleVNPayIPN(HttpServletRequest request) {
        try {
            // Lấy tất cả parameters từ VNPay - KHÔNG encode khi verify checksum
            java.util.Map<String, String> fields = new java.util.HashMap<>();
            java.util.Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    fields.put(fieldName, fieldValue);
                }
            }

            // Verify checksum - theo tài liệu VNPay
            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "97",
                    "Message", "Missing checksum"
                ));
            }

            // Remove secure hash fields
            if (fields.containsKey("vnp_SecureHashType")) {
                fields.remove("vnp_SecureHashType");
            }
            if (fields.containsKey("vnp_SecureHash")) {
                fields.remove("vnp_SecureHash");
            }

            java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
            java.util.Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            java.util.Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }
            
            // Get secret key from config
            String secretKey = appProperties.getPay().getVnpay().getSecretKey();
            if (secretKey == null || secretKey.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "99",
                    "Message", "VNPay not configured"
                ));
            }

            String signValue = VNPayUtil.hmacSHA512(secretKey, hashData.toString());
            if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "97",
                    "Message", "Invalid checksum"
                ));
            }

            // Lấy thông tin từ VNPay - theo demo sử dụng vnp_TransactionStatus
            String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String vnp_TxnRef = request.getParameter("vnp_TxnRef");
            String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");

            if (vnp_TxnRef == null || vnp_TxnRef.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "01",
                    "Message", "Missing order ID"
                ));
            }

            Long orderId;
            try {
                orderId = Long.parseLong(vnp_TxnRef);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "01",
                    "Message", "Invalid order ID"
                ));
            }

            // Kiểm tra đơn hàng có tồn tại không
            java.util.Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "01",
                    "Message", "Order not Found"
                ));
            }
            Order order = orderOpt.get();

            // Kiểm tra số tiền
            String vnp_Amount = request.getParameter("vnp_Amount");
            if (order != null && vnp_Amount != null) {
                long vnpayAmount = Long.parseLong(vnp_Amount);
                long orderAmount = order.getTotalAmount().multiply(java.math.BigDecimal.valueOf(100)).longValue();
                if (vnpayAmount != orderAmount) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "RspCode", "04",
                        "Message", "Invalid Amount"
                    ));
                }
            }

            // Kiểm tra trạng thái đơn hàng (chỉ cập nhật nếu đang PENDING)
            boolean checkOrderStatus = order != null && "PENDING".equalsIgnoreCase(order.getStatus());
            if (!checkOrderStatus && order != null && "PAID".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.ok(Map.of(
                    "RspCode", "02",
                    "Message", "Order already confirmed"
                ));
            }

            // Xử lý kết quả thanh toán - theo tài liệu VNPay
            if ("00".equals(vnp_TransactionStatus) && "00".equals(vnp_ResponseCode)) {
                // Thanh toán thành công
                try {
                    if (checkOrderStatus) {
                        orderService.payIpn(orderId, "VNPay", vnp_TransactionNo);
                        return ResponseEntity.ok(Map.of(
                            "RspCode", "00",
                            "Message", "Confirm Success"
                        ));
                    } else {
                        return ResponseEntity.ok(Map.of(
                            "RspCode", "02",
                            "Message", "Order already confirmed"
                        ));
                    }
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "RspCode", "99",
                        "Message", "Failed to update order: " + e.getMessage()
                    ));
                }
            } else {
                // Thanh toán thất bại - không cần update order
                return ResponseEntity.ok(Map.of(
                    "RspCode", "00",
                    "Message", "Payment failed but acknowledged"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "RspCode", "99",
                "Message", "Processing error: " + e.getMessage()
            ));
        }
    }

    // Helper method để redirect về frontend
    private org.springframework.web.servlet.ModelAndView redirectToFrontend(Long orderId, String status, String message) {
        // Frontend URL - lấy từ CORS config, mặc định là localhost:3000
        String frontendUrl = "http://localhost:3000";
        try {
            String allowedOrigins = appProperties.getCors().getAllowedOrigins();
            if (allowedOrigins != null && !allowedOrigins.isBlank()) {
                // Lấy origin đầu tiên từ danh sách
                String firstOrigin = allowedOrigins.split(",")[0].trim();
                if (!firstOrigin.isBlank()) {
                    frontendUrl = firstOrigin;
                }
            }
        } catch (Exception e) {
            // Nếu có lỗi, dùng default
        }
        
        String redirectUrl = frontendUrl + "/order-success?id=" + orderId;
        if (status != null) {
            redirectUrl += "&status=" + status;
        }
        if (message != null) {
            try {
                redirectUrl += "&message=" + java.net.URLEncoder.encode(message, java.nio.charset.StandardCharsets.UTF_8);
            } catch (Exception e) {
                // Ignore encoding error
            }
        }
        return new org.springframework.web.servlet.ModelAndView("redirect:" + redirectUrl);
    }

    // Helper method để lấy error message từ VNPay response code
    private String getVNPayErrorMessage(String responseCode) {
        if (responseCode == null) return "Unknown error";
        return switch (responseCode) {
            case "07" -> "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).";
            case "09" -> "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking";
            case "10" -> "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11" -> "Đã hết hạn chờ thanh toán. Xin vui lòng thực hiện lại giao dịch.";
            case "12" -> "Thẻ/Tài khoản bị khóa.";
            case "13" -> "Nhập sai mật khẩu xác thực giao dịch (OTP).";
            case "51" -> "Tài khoản không đủ số dư để thực hiện giao dịch.";
            case "65" -> "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.";
            case "75" -> "Ngân hàng thanh toán đang bảo trì.";
            case "79" -> "Nhập sai mật khẩu thanh toán quá số lần quy định.";
            default -> "Thanh toán thất bại. Mã lỗi: " + responseCode;
        };
    }

    /**
     * Tạo payment URL test VNPay (không cần order thật)
     * GET /api/orders/payment/vnpay/test?amount=100000&returnUrl=...&bankCode=...&txnRef=...
     */
    @GetMapping("/payment/vnpay/test")
    public ResponseEntity<Map<String, Object>> testVNPayPayment(
            @RequestParam(required = false, defaultValue = "100000") Long amount,
            @RequestParam(required = false) String returnUrl,
            @RequestParam(required = false) String bankCode,
            @RequestParam(required = false) String txnRef,
            HttpServletRequest request
    ) {
        try {
            var cfg = appProperties.getPay().getVnpay();
            
            if (cfg.getTmnCode() == null || cfg.getTmnCode().toString().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "VNPay TMN Code is not configured"));
            }
            if (cfg.getSecretKey() == null || cfg.getSecretKey().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "VNPay Secret Key is not configured"));
            }
            
            // Build return URL
            String backendReturnUrl = returnUrl;
            if (backendReturnUrl == null || backendReturnUrl.isBlank()) {
                String scheme = request.getScheme();
                String serverName = request.getServerName();
                int serverPort = request.getServerPort();
                StringBuilder urlBuilder = new StringBuilder();
                urlBuilder.append(scheme).append("://").append(serverName);
                if ((scheme.equals("http") && serverPort != 80) || (scheme.equals("https") && serverPort != 443)) {
                    urlBuilder.append(":").append(serverPort);
                }
                urlBuilder.append("/api/orders/payment/vnpay/test/callback");
                backendReturnUrl = urlBuilder.toString();
            }
            
            // Build VNPay params
            Map<String, String> vnpParamsMap = new HashMap<>();
            vnpParamsMap.put("vnp_Version", cfg.getVersion());
            vnpParamsMap.put("vnp_Command", cfg.getCommand());
            vnpParamsMap.put("vnp_TmnCode", String.valueOf(cfg.getTmnCode()).trim());
            vnpParamsMap.put("vnp_Amount", String.valueOf(amount * 100)); // Convert to VND cents
            vnpParamsMap.put("vnp_CurrCode", cfg.getCurrCode());
            vnpParamsMap.put("vnp_TxnRef", txnRef != null && !txnRef.isBlank() ? txnRef : com.quanao.shop.shop_backend.util.VNPayUtil.getRandomNumber(8));
            vnpParamsMap.put("vnp_OrderInfo", "Test payment " + (txnRef != null ? txnRef : ""));
            vnpParamsMap.put("vnp_OrderType", "other");
            vnpParamsMap.put("vnp_Locale", cfg.getLocale());
            vnpParamsMap.put("vnp_ReturnUrl", backendReturnUrl);
            vnpParamsMap.put("vnp_IpAddr", com.quanao.shop.shop_backend.util.VNPayUtil.getIpAddress(request));
            
            // Create date and expire date - Theo tài liệu VNPay: Time zone GMT+7
            java.util.Calendar cld = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone("Etc/GMT+7"));
            java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
            String vnpCreateDate = formatter.format(cld.getTime());
            vnpParamsMap.put("vnp_CreateDate", vnpCreateDate);
            cld.add(java.util.Calendar.MINUTE, 15);
            String vnpExpireDate = formatter.format(cld.getTime());
            vnpParamsMap.put("vnp_ExpireDate", vnpExpireDate);
            
            if (bankCode != null && !bankCode.isBlank()) {
                vnpParamsMap.put("vnp_BankCode", bankCode);
            }
            
            // Build query URL and hash data
            String queryUrl = com.quanao.shop.shop_backend.util.VNPayUtil.getPaymentURL(vnpParamsMap, true);
            String hashData = com.quanao.shop.shop_backend.util.VNPayUtil.getPaymentURL(vnpParamsMap, false);
            String vnpSecureHash = com.quanao.shop.shop_backend.util.VNPayUtil.hmacSHA512(cfg.getSecretKey().trim(), hashData);
            queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
            String paymentUrl = cfg.getPayUrl() + "?" + queryUrl;
            
            // Build response theo format giống vnpay-integration
            Map<String, Object> data = new HashMap<>();
            data.put("code", "ok");
            data.put("message", "success");
            data.put("paymentUrl", paymentUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "Success");
            response.put("data", data);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 400);
            errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "Failed to create test payment URL");
            errorResponse.put("data", null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Callback handler cho test payment
     * GET /api/payment/vnpay/test/callback
     */
    @GetMapping("/payment/vnpay/test/callback")
    public org.springframework.web.servlet.ModelAndView testVNPayCallback(HttpServletRequest request) {
        try {
            // Lấy tất cả parameters từ VNPay
            java.util.Map<String, String> fields = new java.util.HashMap<>();
            java.util.Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && !fieldValue.isBlank()) {
                    fields.put(fieldName, fieldValue);
                }
            }

            // Verify checksum
            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            if (vnp_SecureHash != null && !vnp_SecureHash.isBlank()) {
                // Remove secure hash fields
                if (fields.containsKey("vnp_SecureHashType")) {
                    fields.remove("vnp_SecureHashType");
                }
                if (fields.containsKey("vnp_SecureHash")) {
                    fields.remove("vnp_SecureHash");
                }

                // Build hash data để verify - Theo tài liệu VNPay: encode fieldValue
                java.util.List<String> fieldNames = new java.util.ArrayList<>(fields.keySet());
                java.util.Collections.sort(fieldNames);
                StringBuilder hashData = new StringBuilder();
                java.util.Iterator<String> itr = fieldNames.iterator();
                while (itr.hasNext()) {
                    String fieldName = itr.next();
                    String fieldValue = fields.get(fieldName);
                    if (fieldValue != null && !fieldValue.isBlank()) {
                        hashData.append(fieldName);
                        hashData.append("=");
                        // Encode fieldValue như khi tạo payment URL
                        hashData.append(java.net.URLEncoder.encode(fieldValue, java.nio.charset.StandardCharsets.US_ASCII));
                        if (itr.hasNext()) {
                            hashData.append("&");
                        }
                    }
                }
                
                String secretKey = appProperties.getPay().getVnpay().getSecretKey();
                if (secretKey != null && !secretKey.isBlank()) {
                    String signValue = com.quanao.shop.shop_backend.util.VNPayUtil.hmacSHA512(secretKey, hashData.toString());
                    if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
                        // Checksum không đúng, nhưng vẫn redirect để hiển thị lỗi
                    }
                }
            }

            String status = request.getParameter("vnp_ResponseCode");
            String message = "00".equals(status) ? "Thanh toán thành công!" : "Thanh toán thất bại!";
            
            // Get frontend URL from config
            String frontendUrl = "http://localhost:3000";
            try {
                String allowedOrigins = appProperties.getCors().getAllowedOrigins();
                if (allowedOrigins != null && !allowedOrigins.isBlank()) {
                    String firstOrigin = allowedOrigins.split(",")[0].trim();
                    if (!firstOrigin.isBlank()) {
                        frontendUrl = firstOrigin;
                    }
                }
            } catch (Exception e) {
                // Use default
            }
            
            // Build redirect URL với tất cả parameters
            StringBuilder redirectUrl = new StringBuilder(frontendUrl + "/payment/vnpay/test/result?");
            redirectUrl.append("status=").append(status != null ? status : "");
            redirectUrl.append("&message=").append(java.net.URLEncoder.encode(message, java.nio.charset.StandardCharsets.UTF_8));
            
            // Thêm tất cả parameters khác
            fields.forEach((key, value) -> {
                if (!key.equals("vnp_SecureHash") && !key.equals("vnp_SecureHashType")) {
                    try {
                        redirectUrl.append("&").append(key).append("=")
                            .append(java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8));
                    } catch (Exception e) {
                        // Ignore
                    }
                }
            });
            
            return new org.springframework.web.servlet.ModelAndView("redirect:" + redirectUrl.toString());
        } catch (Exception e) {
            String frontendUrl = "http://localhost:3000";
            try {
                String allowedOrigins = appProperties.getCors().getAllowedOrigins();
                if (allowedOrigins != null && !allowedOrigins.isBlank()) {
                    String firstOrigin = allowedOrigins.split(",")[0].trim();
                    if (!firstOrigin.isBlank()) {
                        frontendUrl = firstOrigin;
                    }
                }
            } catch (Exception ex) {
                // Use default
            }
            return new org.springframework.web.servlet.ModelAndView("redirect:" + frontendUrl + "/payment/vnpay/test/result?status=99&message=" + 
                java.net.URLEncoder.encode("Lỗi xử lý callback: " + e.getMessage(), java.nio.charset.StandardCharsets.UTF_8));
        }
    }

    /**
     * Giả lập thanh toán (cho testing/demo)
     * POST /api/orders/{id}/pay/simulate?method=VNPAY|MOMO
     */
    @PostMapping("/{id}/pay/simulate")
    public ResponseEntity<Map<String, Object>> simulatePayment(
            @PathVariable @NonNull Long id,
            @RequestParam(required = false, defaultValue = "VNPAY") String method,
            HttpServletRequest httpRequest
    ) {
        try {
            String username = extractUsernameFromRequest(httpRequest);
            Order order = orderService.getMyOrders(username).stream()
                    .filter(o -> o.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Order not found or access denied"));

            if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Only PENDING orders can be paid"
                ));
            }

            String methodUpper = method != null ? method.toUpperCase() : "VNPAY";
            String txnId = "SIM-" + System.currentTimeMillis();
            orderService.payIpn(id, methodUpper, txnId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment simulated successfully",
                "orderId", id,
                "method", methodUpper,
                "transactionId", txnId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage() != null ? e.getMessage() : "Failed to simulate payment"
            ));
        }
    }

    @GetMapping("/{id}/pay/vietqr")
    public ResponseEntity<Map<String, Object>> getVietQr(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        String username = extractUsernameFromRequest(httpRequest);

        // đảm bảo user chỉ lấy QR của đơn của mình
        var opt = orderService.getMyOrders(username).stream()
                .filter(o -> o.getId().equals(id))
                .findFirst();

        if (opt.isEmpty()) return ResponseEntity.status(403).build();

        Order order = opt.get();
        String url = vietQrService.buildImageUrl(order);

        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "VietQR is disabled or not configured"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "amount", order.getTotalAmount(),
                "imageUrl", url
        ));
    }

}
