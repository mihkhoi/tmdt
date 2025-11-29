package com.quanao.shop.shop_backend.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.quanao.shop.shop_backend.repository.UserRepository;

@Aspect
@Component
@RequiredArgsConstructor
public class AdminOnlyAspect {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Before("@annotation(com.quanao.shop.shop_backend.security.AdminOnly)")
    public void checkAdmin() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            throw new RuntimeException("No request context");
        }
        HttpServletRequest request = attrs.getRequest();
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = header.substring(7);
        String username = jwtUtil.extractUsername(token);
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Forbidden: ADMIN only");
        }
    }
}