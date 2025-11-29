package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    List<OrderStatusHistory> findByOrder_IdOrderByCreatedAtAsc(Long orderId);
}