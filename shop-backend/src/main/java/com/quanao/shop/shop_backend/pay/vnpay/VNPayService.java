package com.quanao.shop.shop_backend.pay.vnpay;

import com.quanao.shop.shop_backend.config.AppProperties;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {
    private final AppProperties appProperties;

    public String createPaymentUrl(Order order, HttpServletRequest request, String returnUrl, String bankCode) {
        var cfg = appProperties.getPay().getVnpay();
        
        // Validate configuration
        if (cfg.getTmnCode() == null || cfg.getTmnCode().toString().trim().isEmpty()) {
            throw new IllegalStateException("VNPay TMN Code is not configured");
        }
        if (cfg.getSecretKey() == null || cfg.getSecretKey().trim().isEmpty()) {
            throw new IllegalStateException("VNPay Secret Key is not configured");
        }
        
        // Build amount in VND (multiply by 100)
        java.math.BigDecimal amount = order.getTotalAmount() == null ? java.math.BigDecimal.ZERO : order.getTotalAmount();
        long amountLong = amount.multiply(java.math.BigDecimal.valueOf(100)).longValue();
        
        // Build backend return URL for VNPay callback
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        StringBuilder backendUrlBuilder = new StringBuilder();
        backendUrlBuilder.append(scheme).append("://").append(serverName);
        if ((scheme.equals("http") && serverPort != 80) || (scheme.equals("https") && serverPort != 443)) {
            backendUrlBuilder.append(":").append(serverPort);
        }
        backendUrlBuilder.append("/api/orders/").append(order.getId()).append("/pay/vnpay/return");
        String backendReturnUrl = backendUrlBuilder.toString();

        String effectiveReturnUrl = returnUrl;
        if (effectiveReturnUrl == null || effectiveReturnUrl.isBlank()) {
            effectiveReturnUrl = cfg.getReturnUrl();
        }
        if (effectiveReturnUrl != null && !effectiveReturnUrl.isBlank()) {
            effectiveReturnUrl = effectiveReturnUrl.replace("{id}", String.valueOf(order.getId()));
        } else {
            effectiveReturnUrl = backendReturnUrl;
        }
        
        // Build VNPay params map
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", cfg.getVersion());
        vnpParamsMap.put("vnp_Command", cfg.getCommand());
        vnpParamsMap.put("vnp_TmnCode", String.valueOf(cfg.getTmnCode()).trim());
        vnpParamsMap.put("vnp_Amount", String.valueOf(amountLong));
        vnpParamsMap.put("vnp_CurrCode", cfg.getCurrCode());
        vnpParamsMap.put("vnp_TxnRef", String.valueOf(order.getId()));
        vnpParamsMap.put("vnp_OrderInfo", "Pay order " + order.getId());
        vnpParamsMap.put("vnp_OrderType", "other");
        vnpParamsMap.put("vnp_Locale", cfg.getLocale());
        vnpParamsMap.put("vnp_ReturnUrl", effectiveReturnUrl);
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        
        // Create date and expire date - Theo tài liệu VNPay: Time zone GMT+7
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParamsMap.put("vnp_CreateDate", vnpCreateDate);
        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParamsMap.put("vnp_ExpireDate", vnpExpireDate);
        
        // Add bank code if provided
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        
        // Build query URL and hash data
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(cfg.getSecretKey().trim(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = cfg.getPayUrl() + "?" + queryUrl;

        return paymentUrl;
    }
}
