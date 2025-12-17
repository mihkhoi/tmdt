package com.quanao.shop.shop_backend;

import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.quanao.shop.shop_backend.config.AppProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableJpaRepositories(basePackages = "com.quanao.shop.shop_backend.repository")
public class ShopBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            String adminUsername = "admin";
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            java.util.Optional<User> opt = userRepository.findByUsername(adminUsername);
            if (opt.isEmpty()) {
                User admin = User.builder()
                        .username(adminUsername)
                        .password(encoder.encode("admin123"))
                        .role("ADMIN")
                        .build();
                userRepository.save(java.util.Objects.requireNonNull(admin));
                System.out.println(">>> CREATED DEFAULT ADMIN: admin / admin123");
            } else {
                User existing = java.util.Objects.requireNonNull(opt.get());
                if (!"ADMIN".equals(existing.getRole())) {
                    existing.setRole("ADMIN");
                    userRepository.save(existing);
                    System.out.println(">>> ENSURED ADMIN ROLE FOR USER 'admin'");
                } else {
                    System.out.println(">>> ADMIN USER EXISTS");
                }
            }
        };
    }
}
