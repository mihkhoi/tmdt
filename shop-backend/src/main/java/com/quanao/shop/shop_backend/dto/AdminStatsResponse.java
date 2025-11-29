package com.quanao.shop.shop_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
}
