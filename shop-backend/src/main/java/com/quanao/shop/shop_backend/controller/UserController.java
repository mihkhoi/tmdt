package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final com.quanao.shop.shop_backend.service.NotificationService notificationService;
    private final org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    private final java.util.concurrent.ConcurrentHashMap<String, OtpInfo> otpStore = new java.util.concurrent.ConcurrentHashMap<>();

    @GetMapping("/me")
    public ResponseEntity<User> me(HttpServletRequest request) {
        String username = extractUsername(request);
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> update(@RequestBody User body, HttpServletRequest request) {
        String username = extractUsername(request);
        User cur = userRepository.findByUsername(username).orElseThrow();

        if (body == null) {
            return ResponseEntity.badRequest().build();
        }

        String email = body.getEmail();
        if (email != null && !email.isBlank()) {
            var existing = userRepository.findByEmail(email);
            if (existing.isPresent() && !existing.get().getId().equals(cur.getId())) {
                throw new DataIntegrityViolationException("Email already exists");
            }
            cur.setEmail(email);
        }

        String phone = body.getPhone();
        if (phone != null) cur.setPhone(phone);

        String fullName = body.getFullName();
        if (fullName != null) cur.setFullName(fullName);

        String gender = body.getGender();
        if (gender != null) cur.setGender(gender);

        java.time.LocalDate birthDate = body.getBirthDate();
        if (birthDate != null) cur.setBirthDate(birthDate);

        String avatarUrl = body.getAvatarUrl();
        if (avatarUrl != null) cur.setAvatarUrl(avatarUrl);

        return ResponseEntity.ok(java.util.Objects.requireNonNull(userRepository.save(cur)));
    }

    @PostMapping("/me/password/change-old")
    public ResponseEntity<Void> changePasswordWithOld(@RequestBody java.util.Map<String, String> body, HttpServletRequest request) {
        String username = extractUsername(request);
        User cur = userRepository.findByUsername(username).orElseThrow();
        String oldPw = body.get("oldPassword");
        String newPw = body.get("newPassword");
        if (oldPw == null || oldPw.isBlank() || newPw == null || newPw.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (!passwordEncoder.matches(oldPw, cur.getPassword())) {
            return ResponseEntity.status(403).build();
        }
        cur.setPassword(passwordEncoder.encode(newPw));
        userRepository.save(cur);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/me/password/request-otp")
    public ResponseEntity<Void> requestOtp(@RequestBody java.util.Map<String, String> body, HttpServletRequest request) {
        String username = extractUsername(request);
        User cur = userRepository.findByUsername(username).orElseThrow();
        String channelRaw = body.get("channel");
        if (channelRaw == null) return ResponseEntity.badRequest().build();
        String channel = channelRaw.trim().toUpperCase();
        if (!"PHONE".equals(channel) && !"EMAIL".equals(channel)) return ResponseEntity.badRequest().build();
        if ("PHONE".equals(channel) && (cur.getPhone() == null || cur.getPhone().isBlank())) return ResponseEntity.status(400).build();
        if ("EMAIL".equals(channel) && (cur.getEmail() == null || cur.getEmail().isBlank())) return ResponseEntity.status(400).build();

        String code = String.format("%06d", new java.util.Random().nextInt(1_000_000));
        long expireAt = System.currentTimeMillis() + 5 * 60 * 1000; // 5 phút
        boolean delivered = "EMAIL".equals(channel)
                ? notificationService.sendOtpEmail(cur.getEmail(), code)
                : notificationService.sendOtpSms(cur.getPhone(), code);
        if (!delivered) {
            return ResponseEntity.status(502).build();
        }
        otpStore.put(username + ":" + channel, new OtpInfo(code, expireAt));
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/me/password/verify-otp")
    public ResponseEntity<Void> verifyOtp(@RequestBody java.util.Map<String, String> body, HttpServletRequest request) {
        String username = extractUsername(request);
        String channelRaw = body.get("channel");
        if (channelRaw == null) return ResponseEntity.badRequest().build();
        String channel = channelRaw.trim().toUpperCase();
        if (!"PHONE".equals(channel) && !"EMAIL".equals(channel)) return ResponseEntity.badRequest().build();
        String code = body.get("code");
        String newPw = body.get("newPassword");
        if (code == null || code.isBlank() || newPw == null || newPw.isBlank()) return ResponseEntity.badRequest().build();
        OtpInfo info = otpStore.get(username + ":" + channel);
        if (info == null || System.currentTimeMillis() > info.expireAt || !info.code.equals(code)) {
            return ResponseEntity.status(403).build();
        }
        User cur = userRepository.findByUsername(username).orElseThrow();
        cur.setPassword(passwordEncoder.encode(newPw));
        userRepository.save(cur);
        otpStore.remove(username + ":" + channel);
        return ResponseEntity.noContent().build();
    }

    private String extractUsername(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = header.substring(7);
        return jwtUtil.extractUsername(token);
    }

    private record OtpInfo(String code, long expireAt) {}
}
