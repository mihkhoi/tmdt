package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByCode(String code);
    java.util.List<Voucher> findByCodeContainingIgnoreCase(String q);
}