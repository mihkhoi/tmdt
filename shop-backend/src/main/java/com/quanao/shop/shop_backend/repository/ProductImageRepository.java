package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProduct_IdOrderByPositionAsc(Long productId);
}