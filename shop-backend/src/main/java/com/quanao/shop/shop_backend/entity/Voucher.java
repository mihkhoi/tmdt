package com.quanao.shop.shop_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private Integer percent; // 0-100
    private BigDecimal minOrder; // tối thiểu để áp dụng

    private LocalDateTime validFrom;
    private LocalDateTime validTo;
}