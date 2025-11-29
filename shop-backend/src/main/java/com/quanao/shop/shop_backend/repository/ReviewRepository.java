package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_IdOrderByCreatedAtDesc(Long productId);
}