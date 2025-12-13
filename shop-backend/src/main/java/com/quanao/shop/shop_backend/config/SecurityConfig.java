package com.quanao.shop.shop_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final com.quanao.shop.shop_backend.repository.UserRepository userRepository;
    private final com.quanao.shop.shop_backend.security.JwtUtil jwtUtil;
    private final AppProperties appProperties;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // tắt CSRF cho API
            .csrf(csrf -> csrf.disable())

            // BẬT CORS, dùng cấu hình trong CorsConfig
            .cors(cors -> {})

            // Phân quyền
            .authorizeHttpRequests(auth -> auth
                // auth API cho phép public (login/register)
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
<<<<<<< HEAD
                
                // Payment callbacks (IPN) - must be public for payment gateways to call
                .requestMatchers("/api/orders/*/pay/*/return").permitAll()
                .requestMatchers("/api/orders/pay/*/ipn").permitAll()
                .requestMatchers("/api/pay/*/callback").permitAll()
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

                // tạm thời mở hết các API khác cho dễ dev
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth -> oauth
                .successHandler((request, response, authentication) -> {
                    Authentication a = authentication;
                    Object p = a.getPrincipal();
                    OAuth2User ou = (OAuth2User) p;
                    String email = null;
                    if (ou.getAttributes() != null) {
                        Object e = ou.getAttributes().get("email");
                        if (e instanceof String s && !s.isBlank()) email = s.trim();
                    }
                    String name = null;
                    if (ou.getAttributes() != null) {
                        Object n = ou.getAttributes().get("name");
                        if (n instanceof String s && !s.isBlank()) name = s.trim();
                    }
                    String picture = null;
                    if (ou.getAttributes() != null) {
                        Object pic = ou.getAttributes().get("picture");
                        if (pic instanceof String s && !s.isBlank()) picture = s.trim();
                    }
                    if (picture == null && ou.getAttributes() != null) {
                        Object pObj = ou.getAttributes().get("picture.data.url");
                        if (pObj instanceof String s && !s.isBlank()) picture = s.trim();
                    }
                    com.quanao.shop.shop_backend.entity.User u;
                    if (email != null && !email.isBlank()) {
                        java.util.Optional<com.quanao.shop.shop_backend.entity.User> opt = userRepository.findByEmail(email);
                        if (opt.isPresent()) {
                            u = opt.get();
                            if (name != null && !name.equals(u.getFullName())) u.setFullName(name);
                            if (picture != null && !picture.equals(u.getAvatarUrl())) u.setAvatarUrl(picture);
                        } else {
                            String base = email.split("@")[0];
                            String uname = base;
                            int i = 1;
                            while (userRepository.findByUsername(uname).isPresent()) {
                                uname = base + "_" + (++i);
                            }
                            String pw = new BCryptPasswordEncoder().encode(java.util.UUID.randomUUID().toString());
                            u = com.quanao.shop.shop_backend.entity.User.builder()
                                    .username(uname)
                                    .password(pw)
                                    .role("USER")
                                    .email(email)
                                    .fullName(name)
                                    .avatarUrl(picture)
                                    .build();
                        }
                    } else {
                        String id = null;
                        Object idObj = ou.getAttributes() == null ? null : ou.getAttributes().get("id");
                        if (idObj instanceof String s && !s.isBlank()) id = s.trim();
                        String base = (name != null && !name.isBlank()) ? name.replaceAll("\\s+", "_") : "user";
                        if (id != null) base = base + "_" + id;
                        String uname = base.toLowerCase();
                        int i = 1;
                        while (userRepository.findByUsername(uname).isPresent()) {
                            uname = base.toLowerCase() + "_" + (++i);
                        }
                        String pw = new BCryptPasswordEncoder().encode(java.util.UUID.randomUUID().toString());
                        u = com.quanao.shop.shop_backend.entity.User.builder()
                                .username(uname)
                                .password(pw)
                                .role("USER")
                                .fullName(name)
                                .avatarUrl(picture)
                                .build();
                    }
<<<<<<< HEAD
                    com.quanao.shop.shop_backend.entity.User savedUser = java.util.Objects.requireNonNull(u, "User must not be null");
                    userRepository.save(savedUser);
                    String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRole());
=======
                    userRepository.save(u);
                    String token = jwtUtil.generateToken(u.getUsername(), u.getRole());
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
                    String origins = appProperties.getCors().getAllowedOrigins();
                    String first = origins == null ? null : origins.split(",")[0];
                    String def = (first == null || first.isBlank()) ? ("http://localhost:3000") : first.trim();
                    Object r = request.getSession().getAttribute("OAUTH2_REDIRECT");
                    String redirect = (r instanceof String s && !s.isBlank()) ? s : (def + "/login");
                    request.getSession().removeAttribute("OAUTH2_REDIRECT");
                    String target = redirect + (redirect.contains("?") ? "&" : "?") + "token=" + java.net.URLEncoder.encode(token, java.nio.charset.StandardCharsets.UTF_8);
                    response.sendRedirect(target);
                })
                .failureHandler((req, resp, ex) -> {
                    String origins = appProperties.getCors().getAllowedOrigins();
                    String first = origins == null ? null : origins.split(",")[0];
                    String def = (first == null || first.isBlank()) ? ("http://localhost:3000") : first.trim();
                    Object r = req.getSession().getAttribute("OAUTH2_REDIRECT");
                    String redirect = (r instanceof String s && !s.isBlank()) ? s : (def + "/login");
                    req.getSession().removeAttribute("OAUTH2_REDIRECT");
                    String target = redirect + (redirect.contains("?") ? "&" : "?") + "error=" + java.net.URLEncoder.encode("OAuth2 failed", java.nio.charset.StandardCharsets.UTF_8);
                    resp.sendRedirect(target);
                })
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
