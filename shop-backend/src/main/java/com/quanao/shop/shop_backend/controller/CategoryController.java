package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.entity.Category;
import com.quanao.shop.shop_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> list() {
        return categoryRepository.findAll();
    }
}