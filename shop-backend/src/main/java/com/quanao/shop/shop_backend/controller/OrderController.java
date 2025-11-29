package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.dto.CreateOrderRequest;
import com.quanao.shop.shop_backend.entity.Order;
import com.quanao.shop.shop_backend.security.JwtUtil;
import com.quanao.shop.shop_backend.entity.OrderStatusHistory;
import com.quanao.shop.shop_backend.repository.OrderStatusHistoryRepository;
import com.quanao.shop.shop_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    private final OrderStatusHistoryRepository statusHistoryRepository;

    // Tạo đơn hàng mới: user phải gửi token
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest
    ) {
        String username = extractUsernameFromRequest(httpRequest);
        Order order = orderService.createOrder(username, request);
        return ResponseEntity.ok(order);
    }

    // Lấy danh sách đơn của user hiện tại
    @GetMapping("/my")
    public ResponseEntity<Page<Order>> myOrders(
            HttpServletRequest httpRequest,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String username = extractUsernameFromRequest(httpRequest);
        java.time.LocalDateTime start = null;
        java.time.LocalDateTime end = null;
        if (dateFrom != null && !dateFrom.isBlank()) {
            start = java.time.LocalDateTime.parse(dateFrom);
        }
        if (dateTo != null && !dateTo.isBlank()) {
            end = java.time.LocalDateTime.parse(dateTo);
        }
        Page<Order> orders = orderService.getMyOrdersPaged(username, status, keyword, start, end, page, size);
        return ResponseEntity.ok(orders);
    }

    // (tạm) Admin xem tất cả đơn
    @GetMapping
    public List<Order> all() {
        return orderService.getAllOrders();
    }

    // (tạm) Admin đổi trạng thái đơn
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable @NonNull Long id, @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }

    // ====== HÀM PHỤ LẤY USERNAME TỪ TOKEN ======
    private String extractUsernameFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = header.substring(7);
        return jwtUtil.extractUsername(token);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancel(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
        String username = extractUsernameFromRequest(httpRequest);
        return ResponseEntity.ok(orderService.cancelOrder(username, id));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<java.util.List<OrderStatusHistory>> timeline(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
        // Optional: check ownership/admin; simplified for demo
        return ResponseEntity.ok(statusHistoryRepository.findByOrder_IdOrderByCreatedAtAsc(id));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
        String username = extractUsernameFromRequest(httpRequest);
        var opt = orderService.getMyOrders(username).stream().filter(o -> o.getId().equals(id)).findFirst();
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.status(403).build());
    }
}
