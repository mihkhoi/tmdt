package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.dto.AdminStatsResponse;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.security.JwtUtil;
import com.quanao.shop.shop_backend.service.AdminService;
import com.quanao.shop.shop_backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // ====== HÀM CHECK ADMIN ======
    private User requireAdmin(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = header.substring(7);
        String username = jwtUtil.extractUsername(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Forbidden: ADMIN only");
        }
        return user;
    }

    // ====== QUẢN LÝ USER ======

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(HttpServletRequest request) {
        requireAdmin(request);
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable @NonNull Long id,
            @RequestParam String role,
            HttpServletRequest request
    ) {
        requireAdmin(request);
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable @NonNull Long id,
            HttpServletRequest request
    ) {
        requireAdmin(request);
        try {
            adminService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(409).build();
        }
    }

    @PutMapping("/users/{id}/password")
    public ResponseEntity<User> updateUserPassword(
            @PathVariable @NonNull Long id,
            @RequestParam String password,
            HttpServletRequest request
    ) {
        requireAdmin(request);
        return ResponseEntity.ok(adminService.updateUserPassword(id, password));
    }

    @PutMapping("/users/{id}/username")
    public ResponseEntity<User> updateUsername(
            @PathVariable @NonNull Long id,
            @RequestParam String username,
            HttpServletRequest request
    ) {
        requireAdmin(request);
        try {
            return ResponseEntity.ok(adminService.updateUsername(id, username));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(409).build();
        }
    }

    // ====== QUẢN LÝ ORDER ======

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders(HttpServletRequest request) {
        requireAdmin(request);
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable @org.springframework.lang.NonNull Long id,
            @RequestParam String status,
            HttpServletRequest request
    ) {
        requireAdmin(request);
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    // ====== THỐNG KÊ ======

    @GetMapping("/stats/summary")
    public ResponseEntity<AdminStatsResponse> getStats(HttpServletRequest request) {
        requireAdmin(request);
        return ResponseEntity.ok(adminService.getStats());
    }
}
