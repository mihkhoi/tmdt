package com.quanao.shop.shop_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private Cors cors = new Cors();
    private Jwt jwt = new Jwt();
    private String uploadDir = "uploads";
    private Mail mail = new Mail();
    private Sms sms = new Sms();
    private Pay pay = new Pay();

    @Getter
    @Setter
    public static class Cors {
        private String allowedOrigins = "*";
    }

    @Getter
    @Setter
    public static class Jwt {
        private String secret = "12345678901234567890123456789012";
        private long expirationMs = 86400000L;
    }

    @Getter
    @Setter
    public static class Mail {
        private boolean enabled = false;
        private String from;
        private String subject = "Mã OTP xác thực";
    }

    @Getter
    @Setter
    public static class Sms {
        private boolean enabled = false;
        private String provider = "log";
        private Twilio twilio = new Twilio();
        @Getter
        @Setter
        public static class Twilio {
            private String accountSid;
            private String authToken;
            private String from;
        }
    }

    @Getter
    @Setter
    public static class Pay {
        private Vnpay vnpay = new Vnpay();
        private Momo momo = new Momo();
        private Vietqr vietqr = new Vietqr();

        @Getter
        @Setter
        public static class Vnpay {
            private boolean enabled = false;
            private String payUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            private String tmnCode;
            private String secretKey;
            private String version = "2.1.0";
            private String command = "pay";
            private String locale = "vn";
            private String currCode = "VND";
            private String returnUrl;
        }

        @Getter
        @Setter
        public static class Momo {
            private boolean enabled = false;
            private String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
            private String partnerCode;
            private String accessKey;
            private String secretKey;
            private String requestType = "payWithMethod";
            private String partnerName = "Test";
            private String storeId = "MomoTestStore";
            private String lang = "vi";
            private boolean autoCapture = true;
            private String orderGroupId;
        }
        

        @Getter @Setter
            public static class Vietqr {
            private boolean enabled = true;
            private String bankId;       // vd: vietinbank hoặc 970415 hoặc ICB
            private String accountNo;    // số tk
            private String accountName;  // tên thụ hưởng (hiển thị)
            private String template = "compact2"; // compact2/compact/qr_only/print
        }
    }
}
