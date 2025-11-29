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
}
