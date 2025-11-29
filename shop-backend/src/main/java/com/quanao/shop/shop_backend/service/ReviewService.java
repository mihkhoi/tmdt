package com.quanao.shop.shop_backend.service;

import com.quanao.shop.shop_backend.entity.Product;
import com.quanao.shop.shop_backend.entity.Review;
import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.ProductRepository;
import com.quanao.shop.shop_backend.repository.ReviewRepository;
import com.quanao.shop.shop_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Review> listByProduct(@NonNull Long productId) {
        return reviewRepository.findByProduct_IdOrderByCreatedAtDesc(productId);
    }

    public Review addReview(@NonNull String username, @NonNull Long productId, Integer rating, String comment) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Invalid rating");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(rating)
                .comment(comment)
                .build();
        reviewRepository.save(java.util.Objects.requireNonNull(review));

        Integer count = product.getRatingCount() == null ? 0 : product.getRatingCount();
        Integer sum = product.getRatingSum() == null ? 0 : product.getRatingSum();
        count += 1;
        sum += rating;
        product.setRatingCount(count);
        product.setRatingSum(sum);
        product.setAverageRating(sum / (double) count);
        productRepository.save(product);

        return review;
    }
}