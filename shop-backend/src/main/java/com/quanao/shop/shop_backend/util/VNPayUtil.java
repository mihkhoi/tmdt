package com.quanao.shop.shop_backend.util;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

public class VNPayUtil {
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final javax.crypto.Mac hmac512 = javax.crypto.Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress != null && ipAdress.contains(",")) {
                ipAdress = ipAdress.split(",")[0].trim();
            }
            if (ipAdress == null || ipAdress.isBlank()) {
                ipAdress = request.getRemoteAddr();
            }
            if ("::1".equals(ipAdress) || "0:0:0:0:0:0:0:1".equals(ipAdress)) {
                ipAdress = "127.0.0.1";
            }
            if (ipAdress != null && ipAdress.contains(":")) {
                ipAdress = "127.0.0.1";
            }
        } catch (Exception e) {
            ipAdress = "127.0.0.1";
        }
        return ipAdress;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * Build payment URL query string or hash data theo đúng tài liệu VNPay
     * @param paramsMap Map chứa các tham số VNPay
     * @param encodeKey true = encode cả key và value (dùng cho query string), false = chỉ encode value (dùng cho hash data)
     * @return Query string hoặc hash data string
     */
    public static String getPaymentURL(Map<String, String> paramsMap, boolean encodeKey) {
        // Sắp xếp theo alphabet như tài liệu VNPay yêu cầu
        List<Map.Entry<String, String>> sortedEntries = paramsMap.entrySet().stream()
                .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toList());
        
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < sortedEntries.size(); i++) {
            Map.Entry<String, String> entry = sortedEntries.get(i);
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();
            
            if (encodeKey) {
                // Query string: encode cả fieldName và fieldValue
                result.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                result.append('=');
                result.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            } else {
                // Hash data: chỉ encode fieldValue, fieldName không encode
                result.append(fieldName);
                result.append('=');
                result.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
            
            if (i < sortedEntries.size() - 1) {
                result.append('&');
            }
        }
        
        return result.toString();
    }
}
