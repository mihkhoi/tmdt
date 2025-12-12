package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.dto.CreateOrderRequest;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.security.JwtUtil;
import com.quanao.shop.shop_backend.entity.OrderStatusHistory;
import com.quanao.shop.shop_backend.repository.OrderStatusHistoryRepository;
import com.quanao.shop.shop_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final com.quanao.shop.shop_backend.config.AppProperties appProperties;
    private final com.quanao.shop.shop_backend.pay.vnpay.VNPayService vnPayService;

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

    @PostMapping("/{id}/pay/simulate")
    public ResponseEntity<Order> paySimulate(@PathVariable @NonNull Long id, @RequestParam String method, HttpServletRequest httpRequest) {
        String username = extractUsernameFromRequest(httpRequest);
        return ResponseEntity.ok(orderService.paySimulate(username, id, method));
    }

    @PostMapping("/{id}/pay/link")
    public ResponseEntity<java.util.Map<String, String>> createPayLink(
            @PathVariable @NonNull Long id,
            @RequestParam String provider,
            @RequestParam String returnUrl,
            HttpServletRequest httpRequest
    ) {
        String username = extractUsernameFromRequest(httpRequest);
        var opt = orderService.getMyOrders(username).stream().filter(o -> o.getId().equals(id)).findFirst();
        if (opt.isEmpty()) return ResponseEntity.status(403).build();
        String url = returnUrl + "?id=" + id + "&provider=" + provider + "&paid=true";
        java.util.Map<String, String> resp = new java.util.HashMap<>();
        resp.put("payUrl", url);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{id}/pay/vnpay/create")
    public ResponseEntity<java.util.Map<String, String>> vnpayCreate(
            @PathVariable @NonNull Long id,
            @RequestParam String returnUrl,
            @RequestParam(required = false) String bankCode,
            HttpServletRequest request
    ) {
        var cfg = appProperties.getPay().getVnpay();
        if (!cfg.isEnabled() || cfg.getTmnCode() == null || cfg.getSecretKey() == null) {
            return ResponseEntity.status(503).build();
        }
        String username = extractUsernameFromRequest(request);
        var opt = orderService.getMyOrders(username).stream().filter(o -> o.getId().equals(id)).findFirst();
        if (opt.isEmpty()) return ResponseEntity.status(403).build();
        Order order = opt.get();
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) return ResponseEntity.status(409).build();
        String url = vnPayService.createPaymentUrl(order, request, returnUrl, bankCode);
        java.util.Map<String, String> resp = new java.util.HashMap<>();
        resp.put("payUrl", url);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{id}/pay/vnpay/confirm")
    public ResponseEntity<Order> vnpayConfirm(
            @PathVariable @NonNull Long id,
            HttpServletRequest request
    ) {
        var cfg = appProperties.getPay().getVnpay();
        if (!cfg.isEnabled() || cfg.getSecretKey() == null) {
            return ResponseEntity.status(503).build();
        }
        String username = extractUsernameFromRequest(request);
        java.util.Map<String, String[]> raw = request.getParameterMap();
        java.util.Map<String, String> params = new java.util.TreeMap<>();
        for (var e : raw.entrySet()) {
            if (e.getValue() != null && e.getValue().length > 0) params.put(e.getKey(), e.getValue()[0]);
        }
        String secure = params.remove("vnp_SecureHash");
        String data = com.quanao.shop.shop_backend.util.VNPayUtil.getPaymentURL(params, false);
        String calc = hmacSHA512(String.valueOf(cfg.getSecretKey()).trim(), data);
        String respCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        if (secure != null && secure.equalsIgnoreCase(calc) && "00".equals(respCode) && String.valueOf(id).equals(txnRef)) {
            Order o = orderService.payOnline(username, id, "VNPAY", params.get("vnp_TransactionNo"));
            return ResponseEntity.ok(o);
        }
        return ResponseEntity.status(400).build();
    }

    @GetMapping("/{id}/pay/vnpay/return")
    public void vnpayReturn(
            @PathVariable @NonNull Long id,
            HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response
    ) throws java.io.IOException {
        var cfg = appProperties.getPay().getVnpay();
        if (!cfg.isEnabled() || cfg.getSecretKey() == null) {
            response.sendError(503);
            return;
        }
        java.util.Map<String, String[]> raw = request.getParameterMap();
        java.util.Map<String, String> params = new java.util.TreeMap<>();
        for (var e : raw.entrySet()) {
            if (e.getValue() != null && e.getValue().length > 0) params.put(e.getKey(), e.getValue()[0]);
        }
        String secure = params.remove("vnp_SecureHash");
        String data = com.quanao.shop.shop_backend.util.VNPayUtil.getPaymentURL(params, false);
        String calc = hmacSHA512(String.valueOf(cfg.getSecretKey()).trim(), data);
        String respCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        if (secure != null && secure.equalsIgnoreCase(calc) && "00".equals(respCode) && String.valueOf(id).equals(txnRef)) {
            orderService.payIpn(id, "VNPAY", params.get("vnp_TransactionNo"));
        }
        String allowed = appProperties.getCors().getAllowedOrigins();
        String origin = (allowed != null && !allowed.isBlank()) ? allowed.split(",")[0].trim() : (request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort());
        String redirectUrl = origin + "/order-success?id=" + id;
        response.sendRedirect(redirectUrl);
    }

    @PostMapping("/{id}/pay/momo/create")
    public ResponseEntity<java.util.Map<String, String>> momoCreate(
            @PathVariable @NonNull Long id,
            @RequestParam String returnUrl,
            HttpServletRequest request
    ) {
        var cfg = appProperties.getPay().getMomo();
        if (!cfg.isEnabled() || cfg.getPartnerCode() == null || cfg.getAccessKey() == null || cfg.getSecretKey() == null) {
            return ResponseEntity.status(503).build();
        }
        String username = extractUsernameFromRequest(request);
        var opt = orderService.getMyOrders(username).stream().filter(o -> o.getId().equals(id)).findFirst();
        if (opt.isEmpty()) return ResponseEntity.status(403).build();
        Order order = opt.get();
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) return ResponseEntity.status(409).build();

        java.math.BigDecimal amount = order.getTotalAmount() == null ? java.math.BigDecimal.ZERO : order.getTotalAmount();
        String amt = amount.setScale(0, java.math.RoundingMode.DOWN).toPlainString();
        String base = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String ipnUrl = base + "/api/pay/momo/callback";
        String orderId = String.valueOf(order.getId());
        String requestId = orderId + "_" + System.currentTimeMillis();
        String raw = "accessKey=" + cfg.getAccessKey()
                + "&amount=" + amt
                + "&extraData="
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + ("Pay order " + orderId)
                + "&partnerCode=" + cfg.getPartnerCode()
                + "&redirectUrl=" + returnUrl
                + "&requestId=" + requestId
                + "&requestType=" + cfg.getRequestType();
        String sig = hmacSHA256(cfg.getSecretKey(), raw);
        java.util.Map<String, Object> body = new java.util.HashMap<>();
        body.put("partnerCode", cfg.getPartnerCode());
        body.put("partnerName", cfg.getPartnerName());
        body.put("storeId", cfg.getStoreId());
        body.put("accessKey", cfg.getAccessKey());
        body.put("requestId", requestId);
        body.put("amount", amt);
        body.put("orderId", orderId);
        body.put("orderInfo", "Pay order " + orderId);
        body.put("redirectUrl", returnUrl);
        body.put("ipnUrl", ipnUrl);
        body.put("lang", cfg.getLang());
        body.put("requestType", cfg.getRequestType());
        body.put("autoCapture", cfg.isAutoCapture());
        body.put("extraData", "");
        if (cfg.getOrderGroupId() != null && !cfg.getOrderGroupId().isBlank()) {
            body.put("orderGroupId", cfg.getOrderGroupId());
        }
        body.put("signature", sig);

        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Content-Type", "application/json");
        org.springframework.http.HttpEntity<java.util.Map<String, Object>> req = new org.springframework.http.HttpEntity<>(body, headers);
        org.springframework.http.ResponseEntity<java.util.Map<String, Object>> r = rt.exchange(
                cfg.getEndpoint(),
                org.springframework.http.HttpMethod.POST,
                req,
                new org.springframework.core.ParameterizedTypeReference<java.util.Map<String, Object>>() {}
        );
        java.util.Map<String, Object> rb = r.getBody();
        if (rb == null || rb.get("payUrl") == null) return ResponseEntity.status(502).build();
        java.util.Map<String, String> resp = new java.util.HashMap<>();
        resp.put("payUrl", String.valueOf(rb.get("payUrl")));
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/pay/momo/callback")
    public ResponseEntity<Void> momoCallback(@RequestBody java.util.Map<String, Object> payload) {
        var cfg = appProperties.getPay().getMomo();
        if (!cfg.isEnabled() || cfg.getSecretKey() == null || cfg.getAccessKey() == null) {
            return ResponseEntity.status(503).build();
        }
        String accessKey = cfg.getAccessKey();
        String amount = String.valueOf(payload.getOrDefault("amount", "0"));
        String extraData = String.valueOf(payload.getOrDefault("extraData", ""));
        String message = String.valueOf(payload.getOrDefault("message", ""));
        String orderId = String.valueOf(payload.getOrDefault("orderId", ""));
        String orderInfo = String.valueOf(payload.getOrDefault("orderInfo", ""));
        String orderType = String.valueOf(payload.getOrDefault("orderType", ""));
        String partnerCode = String.valueOf(payload.getOrDefault("partnerCode", ""));
        String payType = String.valueOf(payload.getOrDefault("payType", ""));
        String requestId = String.valueOf(payload.getOrDefault("requestId", ""));
        String responseTime = String.valueOf(payload.getOrDefault("responseTime", ""));
        String resultCode = String.valueOf(payload.getOrDefault("resultCode", ""));
        String transId = String.valueOf(payload.getOrDefault("transId", ""));
        String signature = String.valueOf(payload.getOrDefault("signature", ""));
        String raw = "accessKey=" + accessKey
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&message=" + message
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&orderType=" + orderType
                + "&partnerCode=" + partnerCode
                + "&payType=" + payType
                + "&requestId=" + requestId
                + "&responseTime=" + responseTime
                + "&resultCode=" + resultCode
                + "&transId=" + transId;
        String calc = hmacSHA256(cfg.getSecretKey(), raw);
        if (signature != null && signature.equalsIgnoreCase(calc) && "0".equals(resultCode)) {
            String idStr = orderId.replaceAll("[^0-9]", "");
            if (!idStr.isEmpty()) {
                Long id = Long.valueOf(idStr);
                orderService.payIpn(java.util.Objects.requireNonNull(id), "MOMO", transId);
            }
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(400).build();
    }

    @PostMapping("/{id}/pay/momo/confirm")
    public ResponseEntity<Order> momoConfirm(
            @PathVariable @NonNull Long id,
            HttpServletRequest request
    ) {
        var cfg = appProperties.getPay().getMomo();
        if (!cfg.isEnabled() || cfg.getSecretKey() == null || cfg.getAccessKey() == null) {
            return ResponseEntity.status(503).build();
        }
        String username = extractUsernameFromRequest(request);
        java.util.Map<String, String[]> raw = request.getParameterMap();
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        for (var e : raw.entrySet()) {
            payload.put(e.getKey(), e.getValue() != null && e.getValue().length > 0 ? e.getValue()[0] : null);
        }
        String accessKey = cfg.getAccessKey();
        String amount = String.valueOf(payload.getOrDefault("amount", "0"));
        String extraData = String.valueOf(payload.getOrDefault("extraData", ""));
        String message = String.valueOf(payload.getOrDefault("message", ""));
        String orderId = String.valueOf(payload.getOrDefault("orderId", ""));
        String orderInfo = String.valueOf(payload.getOrDefault("orderInfo", ""));
        String orderType = String.valueOf(payload.getOrDefault("orderType", ""));
        String partnerCode = String.valueOf(payload.getOrDefault("partnerCode", ""));
        String payType = String.valueOf(payload.getOrDefault("payType", ""));
        String requestId = String.valueOf(payload.getOrDefault("requestId", ""));
        String responseTime = String.valueOf(payload.getOrDefault("responseTime", ""));
        String resultCode = String.valueOf(payload.getOrDefault("resultCode", ""));
        String transId = String.valueOf(payload.getOrDefault("transId", ""));
        String signature = String.valueOf(payload.getOrDefault("signature", ""));
        String rawSig = "accessKey=" + accessKey
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&message=" + message
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&orderType=" + orderType
                + "&partnerCode=" + partnerCode
                + "&payType=" + payType
                + "&requestId=" + requestId
                + "&responseTime=" + responseTime
                + "&resultCode=" + resultCode
                + "&transId=" + transId;
        String calc = hmacSHA256(cfg.getSecretKey(), rawSig);
        if (signature != null && signature.equalsIgnoreCase(calc) && "0".equals(resultCode) && String.valueOf(id).equals(orderId.replaceAll("[^0-9]", ""))) {
            Order o = orderService.payOnline(username, id, "MOMO", transId);
            return ResponseEntity.ok(o);
        }
        return ResponseEntity.status(400).build();
    }

    private String buildData(java.util.Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (java.util.Map.Entry<String, String> e : params.entrySet()) {
            if (e.getValue() == null || e.getValue().isBlank()) continue;
            if (!first) sb.append('&');
            String k = java.net.URLEncoder.encode(e.getKey(), java.nio.charset.StandardCharsets.US_ASCII);
            String v = java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.US_ASCII);
            sb.append(k).append('=').append(v);
            first = false;
        }
        return sb.toString();
    }

    private String buildQuery(java.util.Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (java.util.Map.Entry<String, String> e : params.entrySet()) {
            if (e.getValue() == null || e.getValue().isBlank()) continue;
            if (!first) sb.append('&');
            String k = java.net.URLEncoder.encode(e.getKey(), java.nio.charset.StandardCharsets.US_ASCII);
            String v = java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.US_ASCII);
            sb.append(k).append('=');
            sb.append(v);
            first = false;
        }
        return sb.toString();
    }

    private String clientIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank()) {
            int idx = ip.indexOf(',');
            if (idx > 0) ip = ip.substring(0, idx).trim();
            return normalizeIp(ip);
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null && !ip.isBlank()) return normalizeIp(ip);
        return normalizeIp(request.getRemoteAddr());
    }

    private String normalizeIp(String ip) {
        if (ip == null || ip.isBlank()) return "127.0.0.1";
        String t = ip.trim();
        if ("0:0:0:0:0:0:0:1".equals(t) || "::1".equals(t)) return "127.0.0.1";
        if (t.contains(":")) return "127.0.0.1";
        return t;
    }

    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec sk = new javax.crypto.spec.SecretKeySpec(key.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(sk);
            byte[] h = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(h.length * 2);
            for (byte b : h) sb.append(String.format("%02X", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String hmacSHA256(String key, String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec sk = new javax.crypto.spec.SecretKeySpec(key.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(sk);
            byte[] h = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(h.length * 2);
            for (byte b : h) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
