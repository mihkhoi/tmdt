package com.quanao.shop.shop_backend.pay.vnpay;

import com.quanao.shop.shop_backend.config.AppProperties;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VNPayService {
    private final AppProperties appProperties;

    public String createPaymentUrl(Order order, HttpServletRequest request, String returnUrl, String bankCode) {
        var cfg = appProperties.getPay().getVnpay();
<<<<<<< HEAD
        
        // Validate configuration
        if (cfg.getTmnCode() == null || cfg.getTmnCode().toString().trim().isEmpty()) {
            throw new IllegalStateException("VNPay TMN Code is not configured");
        }
        if (cfg.getSecretKey() == null || cfg.getSecretKey().trim().isEmpty()) {
            throw new IllegalStateException("VNPay Secret Key is not configured");
        }
        
        java.util.Map<String, String> params = new java.util.TreeMap<>();
        params.put("vnp_Version", cfg.getVersion());
        params.put("vnp_Command", cfg.getCommand());
        String tmnCode = String.valueOf(cfg.getTmnCode()).trim();
        params.put("vnp_TmnCode", tmnCode);
=======
        java.util.Map<String, String> params = new java.util.TreeMap<>();
        params.put("vnp_Version", cfg.getVersion());
        params.put("vnp_Command", cfg.getCommand());
        params.put("vnp_TmnCode", String.valueOf(cfg.getTmnCode()).trim());
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
        java.math.BigDecimal amount = order.getTotalAmount() == null ? java.math.BigDecimal.ZERO : order.getTotalAmount();
        String amountStr = amount.multiply(java.math.BigDecimal.valueOf(100)).setScale(0, java.math.RoundingMode.DOWN).toPlainString();
        params.put("vnp_Amount", amountStr);
        params.put("vnp_CurrCode", cfg.getCurrCode());
        params.put("vnp_TxnRef", String.valueOf(order.getId()));
        params.put("vnp_OrderInfo", "Pay order " + order.getId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", cfg.getLocale());
<<<<<<< HEAD
        
        // Build backend return URL for VNPay callback
        // VNPay requires a backend URL that it can call, not a frontend URL
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        
        // Build proper backend URL
        StringBuilder backendUrlBuilder = new StringBuilder();
        backendUrlBuilder.append(scheme).append("://").append(serverName);
        if ((scheme.equals("http") && serverPort != 80) || (scheme.equals("https") && serverPort != 443)) {
            backendUrlBuilder.append(":").append(serverPort);
        }
        backendUrlBuilder.append("/api/orders/").append(order.getId()).append("/pay/vnpay/return");
        String backendReturnUrl = backendUrlBuilder.toString();
        
        // Use backend returnUrl (VNPay will callback to this, then we redirect to frontend)
        params.put("vnp_ReturnUrl", backendReturnUrl);
=======
        String cfgReturn = cfg.getReturnUrl();
        String ru = (cfgReturn != null && !cfgReturn.isBlank()) ? cfgReturn : returnUrl;
        if (ru != null && ru.contains("{id}")) ru = ru.replace("{id}", String.valueOf(order.getId()));
        params.put("vnp_ReturnUrl", ru);
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
        String ip = VNPayUtil.getIpAddress(request);
        params.put("vnp_IpAddr", ip);
        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String createDate = java.time.LocalDateTime.now().format(fmt);
        params.put("vnp_CreateDate", createDate);
        String expireDate = java.time.LocalDateTime.now().plusMinutes(15).format(fmt);
        params.put("vnp_ExpireDate", expireDate);
        if (bankCode != null && !bankCode.isBlank()) params.put("vnp_BankCode", bankCode);

        String queryUrl = com.quanao.shop.shop_backend.util.VNPayUtil.getPaymentURL(params, true);
        String hashData = com.quanao.shop.shop_backend.util.VNPayUtil.getPaymentURL(params, false);
        String vnpSecureHash = com.quanao.shop.shop_backend.util.VNPayUtil.hmacSHA512(String.valueOf(cfg.getSecretKey()).trim(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
<<<<<<< HEAD
        String finalUrl = cfg.getPayUrl() + "?" + queryUrl;
        
        // Log for debugging (remove in production)
        System.out.println("=== VNPay Payment URL Creation ===");
        System.out.println("  Order ID: " + order.getId());
        System.out.println("  Amount: " + amountStr);
        System.out.println("  ReturnUrl: " + backendReturnUrl);
        System.out.println("  TMN Code: " + cfg.getTmnCode());
        System.out.println("  Secret Key (first 10 chars): " + (cfg.getSecretKey() != null ? cfg.getSecretKey().substring(0, Math.min(10, cfg.getSecretKey().length())) : "NULL"));
        System.out.println("  Pay URL: " + cfg.getPayUrl());
        System.out.println("  Hash Data: " + hashData);
        System.out.println("  Secure Hash: " + vnpSecureHash);
        System.out.println("  Final URL length: " + finalUrl.length());
        System.out.println("===================================");
        
        return finalUrl;
=======
        return cfg.getPayUrl() + "?" + queryUrl;
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
    }
}
