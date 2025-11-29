package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.entity.Review;
import com.quanao.shop.shop_backend.security.JwtUtil;
import com.quanao.shop.shop_backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public List<Review> list(@PathVariable @NonNull Long productId) {
        return reviewService.listByProduct(productId);
    }

    @PostMapping
    public ResponseEntity<Review> add(
            @PathVariable @NonNull Long productId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            HttpServletRequest request
    ) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = header.substring(7);
        String username = jwtUtil.extractUsername(token);
        Review review = reviewService.addReview(java.util.Objects.requireNonNull(username), java.util.Objects.requireNonNull(productId), rating, comment);
        return ResponseEntity.ok(review);
    }
}