package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.dto.CreateOrderRequest;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.security.JwtUtil;
import com.quanao.shop.shop_backend.entity.OrderStatusHistory;
import com.quanao.shop.shop_backend.repository.OrderStatusHistoryRepository;
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
            // Lấy tất cả parameters từ VNPay
            java.util.Map<String, String> vnpParams = new java.util.HashMap<>();
            java.util.Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String key = params.nextElement();
                String value = request.getParameter(key);
                if (value != null && !value.isBlank()) {
                    vnpParams.put(key, value);
                }
            }

            // Verify checksum
            String vnp_SecureHash = vnpParams.remove("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isBlank()) {
                return redirectToFrontend(id, "error", "Missing checksum");
            }

            // Build hash data để verify
            java.util.Map<String, String> hashParams = new java.util.TreeMap<>(vnpParams);
            String hashData = VNPayUtil.getPaymentURL(hashParams, false);
            
            // Get secret key from config
            String secretKey = appProperties.getPay().getVnpay().getSecretKey();
            if (secretKey == null || secretKey.isBlank()) {
                return redirectToFrontend(id, "error", "VNPay not configured");
            }

            String calculatedHash = VNPayUtil.hmacSHA512(secretKey, hashData);
            if (!calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
                return redirectToFrontend(id, "error", "Invalid checksum");
            }

            // Lấy response code
            String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
            String vnp_TxnRef = vnpParams.get("vnp_TxnRef");
            String vnp_TransactionNo = vnpParams.get("vnp_TransactionNo");

            // Verify order ID
            if (vnp_TxnRef == null || !vnp_TxnRef.equals(String.valueOf(id))) {
                return redirectToFrontend(id, "error", "Order ID mismatch");
            }

            // Xử lý kết quả thanh toán
            if ("00".equals(vnp_ResponseCode)) {
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
            // Lấy tất cả parameters từ VNPay
            java.util.Map<String, String> vnpParams = new java.util.HashMap<>();
            java.util.Enumeration<String> params = request.getParameterNames();
            while (params.hasMoreElements()) {
                String key = params.nextElement();
                String value = request.getParameter(key);
                if (value != null && !value.isBlank()) {
                    vnpParams.put(key, value);
                }
            }

            // Verify checksum
            String vnp_SecureHash = vnpParams.remove("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "97",
                    "Message", "Missing checksum"
                ));
            }

            // Build hash data để verify
            java.util.Map<String, String> hashParams = new java.util.TreeMap<>(vnpParams);
            String hashData = VNPayUtil.getPaymentURL(hashParams, false);
            
            // Get secret key from config
            String secretKey = appProperties.getPay().getVnpay().getSecretKey();
            if (secretKey == null || secretKey.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "99",
                    "Message", "VNPay not configured"
                ));
            }

            String calculatedHash = VNPayUtil.hmacSHA512(secretKey, hashData);
            if (!calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "RspCode", "97",
                    "Message", "Invalid checksum"
                ));
            }

            // Lấy thông tin từ VNPay
            String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
            String vnp_TxnRef = vnpParams.get("vnp_TxnRef");
            String vnp_TransactionNo = vnpParams.get("vnp_TransactionNo");

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

            // Xử lý kết quả thanh toán
            if ("00".equals(vnp_ResponseCode)) {
                // Thanh toán thành công
                try {
                    orderService.payIpn(orderId, "VNPay", vnp_TransactionNo);
                    return ResponseEntity.ok(Map.of(
                        "RspCode", "00",
                        "Message", "Success"
                    ));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "RspCode", "99",
                        "Message", "Failed to update order: " + e.getMessage()
                    ));
                }
            } else {
                // Thanh toán thất bại - không cần update order, chỉ log
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
}
