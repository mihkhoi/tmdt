package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.dto.AuthRequest;
import com.quanao.shop.shop_backend.dto.AuthResponse;
import com.quanao.shop.shop_backend.service.AuthService;
import com.quanao.shop.shop_backend.service.NotificationService;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.config.AppProperties;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final AppProperties appProperties;
    private final org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    private final java.util.concurrent.ConcurrentHashMap<String, OtpInfo> otpStore = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot/request-otp")
    public ResponseEntity<Void> forgotRequestOtp(@RequestBody java.util.Map<String, String> body) {
        String identifier = body.get("identifier");
        if (identifier == null || identifier.isBlank()) return ResponseEntity.badRequest().build();
        String id = identifier.trim();
        boolean isEmail = id.contains("@");
        var opt = isEmail ? userRepository.findByEmail(id) : userRepository.findByPhone(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));
        long expireAt = System.currentTimeMillis() + 5 * 60 * 1000;
        boolean delivered = isEmail ? notificationService.sendOtpEmail(id, code) : notificationService.sendOtpSms(id, code);
        if (!delivered) return ResponseEntity.status(502).build();
        otpStore.put(id, new OtpInfo(code, expireAt));
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/forgot/verify-otp")
    public ResponseEntity<Void> forgotVerifyOtp(@RequestBody java.util.Map<String, String> body) {
        String identifier = body.get("identifier");
        String code = body.get("code");
        String newPw = body.get("newPassword");
        if (identifier == null || identifier.isBlank() || code == null || code.isBlank() || newPw == null || newPw.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String id = identifier.trim();
        OtpInfo info = otpStore.get(id);
        if (info == null || System.currentTimeMillis() > info.expireAt || !info.code.equals(code)) {
            return ResponseEntity.status(403).build();
        }
        boolean isEmail = id.contains("@");
        var opt = isEmail ? userRepository.findByEmail(id) : userRepository.findByPhone(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).build();
        com.quanao.shop.shop_backend.entity.User user = opt.get();
        user.setPassword(passwordEncoder.encode(newPw));
        userRepository.save(user);
        otpStore.remove(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/oauth/{provider}")
    public void oauthStart(
            @PathVariable String provider,
            @RequestParam(required = false) String redirect,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws java.io.IOException {
        String p = provider == null ? "" : provider.trim().toLowerCase();
        if (!"google".equals(p)) {
            response.setStatus(404);
            return;
        }
        String origins = appProperties.getCors().getAllowedOrigins();
        String first = origins == null ? null : origins.split(",")[0];
        String def = (first == null || first.isBlank()) ? ("http://localhost:3000") : first.trim();
        String ru = (redirect == null || redirect.isBlank()) ? (def + "/login") : redirect;
        request.getSession().setAttribute("OAUTH2_REDIRECT", ru);
        response.sendRedirect("/oauth2/authorization/" + p);
    }

    private record OtpInfo(String code, long expireAt) {}
}
