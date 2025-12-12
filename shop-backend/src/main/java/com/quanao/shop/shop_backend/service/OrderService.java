package com.quanao.shop.shop_backend.service;

import com.quanao.shop.shop_backend.dto.CreateOrderRequest;
import com.quanao.shop.shop_backend.dto.OrderItemRequest;
import com.quanao.shop.shop_backend.entity.*;
import com.quanao.shop.shop_backend.repository.OrderRepository;
import com.quanao.shop.shop_backend.repository.ProductRepository;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.repository.OrderStatusHistoryRepository;
import com.quanao.shop.shop_backend.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;

    public Order createOrder(String username, CreateOrderRequest request) {
        // tìm user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must have at least 1 item");
        }

        // tạo order rỗng trước
        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingAddress(request.getShippingAddress());
        order.setBillingAddress(request.getBillingAddress());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        // xử lý từng item
        for (OrderItemRequest itemReq : request.getItems()) {
            Long pid = itemReq.getProductId();
            if (pid == null) {
                throw new RuntimeException("Product ID is required");
            }
            Product product = productRepository.findById(java.util.Objects.requireNonNull(pid))
                    .orElseThrow(() -> new RuntimeException("Product not found: " + pid));

            if (product.getStock() == null || product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Out of stock for product: " + product.getName());
            }

            BigDecimal basePrice = product.getPrice();
            BigDecimal unitPrice = basePrice;
            Integer discount = product.getDiscountPercent();
            java.time.LocalDateTime saleEnd = product.getFlashSaleEndAt();
            boolean saleActive = discount != null && discount > 0 && (saleEnd == null || java.time.LocalDateTime.now().isBefore(saleEnd));
            if (saleActive) {
                int disc = java.util.Objects.requireNonNull(discount).intValue();
                BigDecimal rate = BigDecimal.valueOf(100 - disc).divide(BigDecimal.valueOf(100));
                unitPrice = basePrice.multiply(rate);
            }
            int qty = itemReq.getQuantity();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(qty));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setUnitPrice(unitPrice);
            item.setSubtotal(subtotal);

            orderItems.add(item);
            total = total.add(subtotal);

            int newStock = product.getStock().intValue() - qty;
            product.setStock(newStock);
            productRepository.save(product);
        }

        order.setItems(orderItems);

        if (request.getVoucherCode() != null && !request.getVoucherCode().isBlank()) {
            var opt = voucherRepository.findByCode(request.getVoucherCode().trim());
            if (opt.isPresent()) {
                var v = opt.get();
                var now = java.time.LocalDateTime.now();
                if ((v.getValidFrom() == null || !now.isBefore(v.getValidFrom())) &&
                    (v.getValidTo() == null || !now.isAfter(v.getValidTo()))) {
                    if (v.getMinOrder() == null || total.compareTo(v.getMinOrder()) >= 0) {
                        int percent = java.util.Objects.requireNonNull(v.getPercent()).intValue();
                        java.math.BigDecimal rate = java.math.BigDecimal.valueOf(100 - percent).divide(java.math.BigDecimal.valueOf(100));
                        total = total.multiply(rate);
                    }
                }
            }
        }

        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        statusHistoryRepository.save(java.util.Objects.requireNonNull(com.quanao.shop.shop_backend.entity.OrderStatusHistory.builder()
                .order(saved)
                .status(saved.getStatus())
                .note("Order created")
                .build()));
        return saved;
    }

    public List<Order> getMyOrders(String username) {
        return orderRepository.findByUser_UsernameOrderByCreatedAtDesc(username);
    }

    public Page<Order> getMyOrdersPaged(String username, String status, String keyword, java.time.LocalDateTime start, java.time.LocalDateTime end, int page, int size) {
        var pageable = PageRequest.of(page, size);
        return orderRepository.searchMyOrders(username, start, end, status, keyword, pageable);
    }

    // tạm thêm hàm admin xem tất cả
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateStatus(@NonNull Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        statusHistoryRepository.save(java.util.Objects.requireNonNull(com.quanao.shop.shop_backend.entity.OrderStatusHistory.builder()
                .order(saved)
                .status(status)
                .note("Status updated")
                .build()));
        return saved;
    }

    public Order cancelOrder(String username, @NonNull Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Forbidden");
        }
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only PENDING orders can be canceled");
        }
        order.setStatus("CANCELED");
        Order saved = orderRepository.save(order);
        statusHistoryRepository.save(java.util.Objects.requireNonNull(com.quanao.shop.shop_backend.entity.OrderStatusHistory.builder()
                .order(saved)
                .status("CANCELED")
                .note("User canceled order")
                .build()));
        return saved;
    }

    public Order paySimulate(String username, @NonNull Long id, String method) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Forbidden");
        }
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only PENDING orders can be paid");
        }
        order.setStatus("PAID");
        Order saved = orderRepository.save(order);
        statusHistoryRepository.save(java.util.Objects.requireNonNull(com.quanao.shop.shop_backend.entity.OrderStatusHistory.builder()
                .order(saved)
                .status("PAID")
                .note("Paid via " + (method == null ? "" : method))
                .build()));
        return saved;
    }

    public Order payOnline(String username, @NonNull Long id, String provider, String txnId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Forbidden");
        }
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only PENDING orders can be paid");
        }
        order.setStatus("PAID");
        Order saved = orderRepository.save(order);
        statusHistoryRepository.save(java.util.Objects.requireNonNull(com.quanao.shop.shop_backend.entity.OrderStatusHistory.builder()
                .order(saved)
                .status("PAID")
                .note("Paid via " + (provider == null ? "" : provider) + (txnId == null ? "" : (" #" + txnId)))
                .build()));
        return saved;
    }

    public void payIpn(@NonNull Long id, String provider, String txnId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return;
        }
        order.setStatus("PAID");
        Order saved = orderRepository.save(order);
        statusHistoryRepository.save(java.util.Objects.requireNonNull(com.quanao.shop.shop_backend.entity.OrderStatusHistory.builder()
                .order(saved)
                .status("PAID")
                .note("Paid via " + (provider == null ? "" : provider) + (txnId == null ? "" : (" #" + txnId)))
                .build()));
    }
}
