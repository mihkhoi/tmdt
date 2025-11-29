package com.quanao.shop.shop_backend.service;

import com.quanao.shop.shop_backend.entity.Product;
import com.quanao.shop.shop_backend.repository.ProductRepository;
import com.quanao.shop.shop_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.quanao.shop.shop_backend.dto.ProductSuggestionDto;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> search(String keyword, int page, int size) {
        String k = (keyword == null) ? "" : keyword.trim();
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.findByNameContainingIgnoreCase(k, pageable);
    }

    public Page<Product> searchAdvanced(String keyword, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice, String sort, Boolean newOnly, int page, int size) {
        String k = (keyword == null) ? "" : keyword.trim();
        Sort s;
        if ("price_asc".equalsIgnoreCase(sort)) {
            s = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            s = Sort.by(Sort.Direction.DESC, "price");
        } else if ("rating_asc".equalsIgnoreCase(sort)) {
            s = Sort.by(Sort.Direction.ASC, "averageRating");
        } else if ("rating_desc".equalsIgnoreCase(sort)) {
            s = Sort.by(Sort.Direction.DESC, "averageRating");
        } else {
            s = Sort.by(Sort.Direction.DESC, "id");
        }
        Pageable pageable = PageRequest.of(page, size, s);

        Specification<Product> spec = (root, cq, cb) -> cb.conjunction();
        if (!k.isEmpty()) {
            spec = spec.and((root, cq, cb) -> cb.like(cb.lower(root.get("name")), "%" + k.toLowerCase() + "%"));
        }
        if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            String cat = categorySlug.trim();
            spec = spec.and((root, cq, cb) -> cb.or(
                    cb.equal(root.join("category").get("slug"), cat),
                    cb.equal(root.join("category").get("name"), cat)
            ));
        }
        if (minPrice != null) {
            spec = spec.and((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, cq, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }
        if (Boolean.TRUE.equals(newOnly)) {
            java.time.LocalDateTime since = java.time.LocalDateTime.now().minusDays(30);
            spec = spec.and((root, cq, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), since));
        }
        return productRepository.findAll(spec, pageable);
    }

    public Optional<Product> findById(@NonNull Long id) {
        return productRepository.findById(id);
    }

    public Product create(Product p) {
        if (p.getStatus() == null) {
            p.setStatus("ACTIVE");
        }
        return productRepository.save(p);
    }

    public Product update(@NonNull Long id, @NonNull Product data) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(data.getName());
        existing.setDescription(data.getDescription());
        existing.setPrice(data.getPrice());
        existing.setStock(data.getStock());
        existing.setImageUrl(data.getImageUrl());
        existing.setStatus(data.getStatus());
        existing.setCategory(data.getCategory());
        existing.setBrand(data.getBrand());
        existing.setDiscountPercent(data.getDiscountPercent());
        existing.setFlashSaleEndAt(data.getFlashSaleEndAt());

        return productRepository.save(existing);
    }

    public void delete(@NonNull Long id) {
        productRepository.deleteById(id);
    }

    public List<ProductSuggestionDto> suggest(String keyword) {
        String k = (keyword == null) ? "" : keyword.trim();
        if (k.isEmpty()) {
            return List.of();
        }
        return productRepository
                .findTop10ByNameContainingIgnoreCaseOrderByNameAsc(k)
                .stream()
                .map(p -> new ProductSuggestionDto(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getImageUrl()
                ))
                .toList();
    }

    public List<String> categories() {
        return categoryRepository.findAll().stream().map(c -> c.getName()).toList();
    }

    public Product updateImageUrl(@NonNull Long id, @NonNull String url) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setImageUrl(java.util.Objects.requireNonNull(url));
        return productRepository.save(existing);
    }
}