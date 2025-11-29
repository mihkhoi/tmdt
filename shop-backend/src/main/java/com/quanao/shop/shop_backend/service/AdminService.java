package com.quanao.shop.shop_backend.service;

import com.quanao.shop.shop_backend.dto.AdminStatsResponse;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.OrderRepository;
import com.quanao.shop.shop_backend.repository.ProductRepository;
import com.quanao.shop.shop_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(@NonNull Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(@NonNull Long id) {
        userRepository.deleteById(id);
    }

    public User updateUserPassword(@NonNull Long id, String rawPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(java.util.Objects.requireNonNull(rawPassword)));
        return userRepository.save(user);
    }

    public User updateUsername(@NonNull Long id, String newUsername) {
        String u = java.util.Objects.requireNonNull(newUsername).trim();
        if (u.isBlank()) {
            throw new RuntimeException("Username cannot be blank");
        }
        var exists = userRepository.findByUsername(u);
        if (exists.isPresent() && !exists.get().getId().equals(id)) {
            throw new org.springframework.dao.DataIntegrityViolationException("Username already exists");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(u);
        return userRepository.save(user);
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .map(Order::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminStatsResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
        );
    }
}
