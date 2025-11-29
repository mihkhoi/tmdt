package com.quanao.shop.shop_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
// import thêm:
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

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

                // tạm thời mở hết các API khác cho dễ dev
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
