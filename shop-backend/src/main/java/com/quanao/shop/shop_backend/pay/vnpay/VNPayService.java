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
        java.util.Map<String, String> params = new java.util.TreeMap<>();
        params.put("vnp_Version", cfg.getVersion());
        params.put("vnp_Command", cfg.getCommand());
        params.put("vnp_TmnCode", String.valueOf(cfg.getTmnCode()).trim());
        java.math.BigDecimal amount = order.getTotalAmount() == null ? java.math.BigDecimal.ZERO : order.getTotalAmount();
        String amountStr = amount.multiply(java.math.BigDecimal.valueOf(100)).setScale(0, java.math.RoundingMode.DOWN).toPlainString();
        params.put("vnp_Amount", amountStr);
        params.put("vnp_CurrCode", cfg.getCurrCode());
        params.put("vnp_TxnRef", String.valueOf(order.getId()));
        params.put("vnp_OrderInfo", "Pay order " + order.getId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", cfg.getLocale());
        String cfgReturn = cfg.getReturnUrl();
        String ru = (cfgReturn != null && !cfgReturn.isBlank()) ? cfgReturn : returnUrl;
        if (ru != null && ru.contains("{id}")) ru = ru.replace("{id}", String.valueOf(order.getId()));
        params.put("vnp_ReturnUrl", ru);
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
        return cfg.getPayUrl() + "?" + queryUrl;
    }
}
