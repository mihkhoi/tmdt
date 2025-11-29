package com.quanao.shop.shop_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 1000)
    private String line;

    // SHIPPING hoặc BILLING
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    @lombok.Builder.Default
    private Boolean isDefault = false;
}