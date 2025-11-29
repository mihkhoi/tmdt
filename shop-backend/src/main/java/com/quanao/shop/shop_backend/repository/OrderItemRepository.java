package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
