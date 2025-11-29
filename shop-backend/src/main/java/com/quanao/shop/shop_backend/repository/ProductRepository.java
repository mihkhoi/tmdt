package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findTop10ByNameContainingIgnoreCaseOrderByNameAsc(String name);

    @Query("select distinct p.category from Product p where p.category is not null")
    List<String> findDistinctCategories();
}