package com.quanao.shop.shop_backend.util;

import jakarta.servlet.http.HttpServletRequest;

public class VNPayUtil {
    public static String hmacSHA512(final String key, final String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec sk = new javax.crypto.spec.SecretKeySpec(key.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(sk);
            byte[] h = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(h.length * 2);
            for (byte b : h) sb.append(String.format("%02X", b));
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-FORWARDED-FOR");
        if (ip == null || ip.isBlank()) ip = request.getRemoteAddr();
        if (ip == null || ip.isBlank()) return "127.0.0.1";
        String t = ip.trim();
        int idx = t.indexOf(',');
        if (idx > 0) t = t.substring(0, idx).trim();
        if ("0:0:0:0:0:0:0:1".equals(t) || "::1".equals(t)) return "127.0.0.1";
        if (t.contains(":")) return "127.0.0.1";
        return t;
    }

<<<<<<< HEAD
    /**
     * Tạo query string hoặc hash data cho VNPay
     * @param params Map chứa các tham số
     * @param encodeKey true để tạo query string (URL encode), false để tạo hash data (không encode)
     * @return Query string hoặc hash data
     */
    public static String getPaymentURL(java.util.Map<String, String> params, boolean encodeKey) {
        java.util.List<java.util.Map.Entry<String, String>> list = new java.util.ArrayList<>(params.entrySet());
        // Loại bỏ các field có giá trị null hoặc rỗng
        list.removeIf(e -> e.getValue() == null || e.getValue().isBlank());
        // Sắp xếp theo thứ tự alphabet (theo đặc tả VNPay)
        list.sort(java.util.Map.Entry.comparingByKey());
        
=======
    public static String getPaymentURL(java.util.Map<String, String> params, boolean encodeKey) {
        java.util.List<java.util.Map.Entry<String, String>> list = new java.util.ArrayList<>(params.entrySet());
        list.removeIf(e -> e.getValue() == null || e.getValue().isBlank());
        list.sort(java.util.Map.Entry.comparingByKey());
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (var e : list) {
            if (!first) sb.append('&');
<<<<<<< HEAD
            
            if (encodeKey) {
                // Tạo query string với URL encoding (cho URL)
                String k = java.net.URLEncoder.encode(e.getKey(), java.nio.charset.StandardCharsets.US_ASCII);
                String v = java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.US_ASCII);
                sb.append(k).append('=').append(v);
            } else {
                // Tạo hash data KHÔNG encode (theo đặc tả VNPay)
                // Hash data format: fieldName=fieldValue&fieldName2=fieldValue2
                sb.append(e.getKey()).append('=').append(e.getValue());
            }
=======
            String k = encodeKey ? java.net.URLEncoder.encode(e.getKey(), java.nio.charset.StandardCharsets.US_ASCII) : e.getKey();
            String v = java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.US_ASCII);
            sb.append(k).append('=').append(v);
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
            first = false;
        }
        return sb.toString();
    }
}
