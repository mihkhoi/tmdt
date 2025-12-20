package com.quanao.shop.shop_backend.pay.vietqr;

import com.quanao.shop.shop_backend.config.AppProperties;
import com.quanao.shop.shop_backend.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class VietQrService {
    private final AppProperties appProperties;

    public String buildImageUrl(Order order) {
        var cfg = appProperties.getPay().getVietqr();
        if (cfg == null || !cfg.isEnabled()) return null;

        String bankId = cfg.getBankId();
        String accNo = cfg.getAccountNo();
        String template = cfg.getTemplate() == null ? "compact2" : cfg.getTemplate();

        // VietQR amount: số dương, nên đưa về số nguyên VND
        BigDecimal total = order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount();
        long amount = total.longValue(); // nếu bạn có lẻ thì cân nhắc .setScale(0, RoundingMode.HALF_UP)

        // addInfo tối đa 50 ký tự, tránh ký tự đặc biệt => dùng mã đơn
        String addInfoRaw = "ORDER" + order.getId();
        String addInfo = URLEncoder.encode(addInfoRaw, StandardCharsets.UTF_8);

        String accountName = cfg.getAccountName() == null ? "" : cfg.getAccountName();
        String accountNameEnc = URLEncoder.encode(accountName, StandardCharsets.UTF_8);

        return String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s",
                bankId, accNo, template, amount, addInfo, accountNameEnc
        );
    }
}
