package com.quanao.shop.shop_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer stock;      // tồn kho
    private String imageUrl;    // link ảnh (optional)

    private String status;      // ACTIVE / INACTIVE

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    private String brand;

    private Integer discountPercent; // 0-100
    private java.time.LocalDateTime flashSaleEndAt; // nếu còn hiệu lực thì áp dụng giảm giá

    private Double averageRating; // trung bình 1-5
    private Integer ratingCount;
    private Integer ratingSum;

    private java.time.LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = java.time.LocalDateTime.now();
    }
}