package com.quanao.shop.shop_backend.repository;

import com.quanao.shop.shop_backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser_UsernameOrderByIdDesc(String username);
    List<Address> findByUser_UsernameAndTypeOrderByIdDesc(String username, String type);
    Optional<Address> findByUser_UsernameAndIsDefaultTrueAndType(String username, String type);
}