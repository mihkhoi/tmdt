package com.quanao.shop.shop_backend.service;

import com.quanao.shop.shop_backend.dto.AuthRequest;
import com.quanao.shop.shop_backend.dto.AuthResponse;
import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(AuthRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        // Generate email verification code
        String verificationCode = String.format("%06d", new java.util.Random().nextInt(1_000_000));
        
        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .role("USER")
                .phone(req.getPhone())
                .email(req.getEmail())
                .emailVerified(false)
                .emailVerificationCode(verificationCode)
                .build();

        userRepository.save(java.util.Objects.requireNonNull(user));
        
        // Send verification email (if email service is enabled)
        // In production, this would send a real email with verification link
        // For now, we'll just log it for testing
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            System.out.println("=== Email Verification Code ===");
            System.out.println("Email: " + req.getEmail());
            System.out.println("Verification Code: " + verificationCode);
            System.out.println("Verification URL: http://localhost:3000/verify-email?code=" + verificationCode);
            System.out.println("================================");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token);
    }
}
