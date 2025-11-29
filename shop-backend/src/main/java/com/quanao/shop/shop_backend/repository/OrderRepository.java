package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // lấy order theo username
    List<Order> findByUser_UsernameOrderByCreatedAtDesc(String username);
    Page<Order> findByUser_UsernameOrderByCreatedAtDesc(String username, Pageable pageable);
    Page<Order> findByUser_UsernameAndStatusIgnoreCaseOrderByCreatedAtDesc(String username, String status, Pageable pageable);

    @Query("select o from Order o where o.user.username = :username and o.createdAt between :start and :end order by o.createdAt desc")
    Page<Order> findByUsernameAndCreatedBetween(@Param("username") String username, @Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, Pageable pageable);

    @Query("select distinct o from Order o join o.items i join i.product p where o.user.username = :username and (:start is null or o.createdAt >= :start) and (:end is null or o.createdAt <= :end) and (:status is null or lower(o.status) = lower(:status)) and (:keyword is null or lower(p.name) like concat('%', lower(:keyword), '%')) order by o.createdAt desc")
    Page<Order> searchMyOrders(
            @Param("username") String username,
            @Param("start") java.time.LocalDateTime start,
            @Param("end") java.time.LocalDateTime end,
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("select coalesce(sum(i.quantity),0) from Order o join o.items i where i.product.id = :productId and upper(o.status) in ('PROCESSING','SHIPPED','DELIVERED')")
    Long countSoldByProductId(@Param("productId") Long productId);
}
