package com.quanao.shop.shop_backend.service;

import com.quanao.shop.shop_backend.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final AppProperties props;
    private final ObjectProvider<JavaMailSender> mailProvider;

    public boolean sendOtpEmail(String to, String code) {
        try {
            JavaMailSender sender = mailProvider.getIfAvailable();
            boolean enabled = props.getMail() != null && props.getMail().isEnabled();
            if (enabled && sender != null) {
                SimpleMailMessage msg = new SimpleMailMessage();
                String from = props.getMail().getFrom();
                if (from != null && !from.isBlank()) {
                    msg.setFrom(from);
                }
                msg.setTo(to);
                String subject = props.getMail().getSubject() != null ? props.getMail().getSubject() : "OTP";
                msg.setSubject(subject);
                msg.setText("Mã OTP của bạn là: " + code + " (hiệu lực 5 phút)");
                sender.send(msg);
                return true;
            } else {
                System.out.println("EMAIL OTP -> " + to + " : " + code);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendOtpSms(String phone, String code) {
        try {
            boolean enabled = props.getSms() != null && props.getSms().isEnabled();
            String provider = props.getSms() != null ? props.getSms().getProvider() : "log";
            if (enabled && "twilio".equalsIgnoreCase(provider)) {
                var cfg = props.getSms().getTwilio();
                if (cfg == null || cfg.getAccountSid() == null || cfg.getAuthToken() == null || cfg.getFrom() == null) {
                    return false;
                }
                Twilio.init(cfg.getAccountSid(), cfg.getAuthToken());
                Message.creator(new PhoneNumber(phone), new PhoneNumber(cfg.getFrom()), "Ma OTP cua ban: " + code + " (hieu luc 5 phut)").create();
                return true;
            } else {
                System.out.println("SMS OTP -> " + phone + " : " + code);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
