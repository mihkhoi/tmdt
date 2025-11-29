package com.quanao.shop.shop_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user nào đặt
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal totalAmount;

    // PENDING / PAID / SHIPPING / DONE / CANCEL
    private String status;

    // COD / BANK / ONLINE...
    private String paymentMethod;

    private String shippingAddress;
    private String billingAddress;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 1 order có nhiều item
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
