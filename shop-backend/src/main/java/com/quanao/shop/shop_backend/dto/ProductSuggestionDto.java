package com.quanao.shop.shop_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductSuggestionDto {

    private Long id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
}
