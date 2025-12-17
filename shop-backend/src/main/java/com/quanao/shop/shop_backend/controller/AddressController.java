package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.entity.Address;
import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.repository.AddressRepository;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping
    public List<Address> list(HttpServletRequest request, @RequestParam(required = false) String type) {
        String username = extractUsername(request);
        if (type != null && !type.isBlank()) {
            return addressRepository.findByUser_UsernameAndTypeOrderByIdDesc(username, type);
        }
        return addressRepository.findByUser_UsernameOrderByIdDesc(username);
    }

    @PostMapping
    public ResponseEntity<Address> create(@RequestBody Address body, HttpServletRequest request) {
        String username = extractUsername(request);
        User user = userRepository.findByUsername(username).orElseThrow();
        
        // Validate required fields
        if (body.getLine() == null || body.getLine().isBlank()) {
            throw new RuntimeException("Address line is required");
        }
        
        String type = (body.getType() == null || body.getType().isBlank()) ? "SHIPPING" : body.getType();
        Address a = Address.builder()
                .user(user)
                .line(body.getLine().trim())
                .type(type)
                .isDefault(Boolean.TRUE.equals(body.getIsDefault()))
                .build();
        if (Boolean.TRUE.equals(a.getIsDefault())) {
            unsetDefaultForType(username, type);
        }
        return ResponseEntity.ok(addressRepository.save(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> update(@PathVariable @NonNull Long id, @RequestBody Address body, HttpServletRequest request) {
        String username = extractUsername(request);
        Address cur = addressRepository.findById(id).orElseThrow();
        if (!cur.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }
        String type = (body.getType() == null || body.getType().isBlank()) ? cur.getType() : body.getType();
        cur.setLine(body.getLine() != null ? body.getLine() : cur.getLine());
        cur.setType(type);
        Boolean newDefault = body.getIsDefault();
        if (newDefault != null) {
            if (Boolean.TRUE.equals(newDefault)) {
                unsetDefaultForType(username, type);
                cur.setIsDefault(true);
            } else {
                cur.setIsDefault(false);
            }
        }
        return ResponseEntity.ok(addressRepository.save(cur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @NonNull Long id, HttpServletRequest request) {
        String username = extractUsername(request);
        Address cur = addressRepository.findById(id).orElseThrow();
        if (!cur.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }
        addressRepository.delete(cur);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<Address> setDefault(@PathVariable @NonNull Long id, HttpServletRequest request) {
        String username = extractUsername(request);
        Address cur = addressRepository.findById(id).orElseThrow();
        if (!cur.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }
        unsetDefaultForType(username, cur.getType());
        cur.setIsDefault(true);
        return ResponseEntity.ok(addressRepository.save(cur));
    }

    private String extractUsername(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = header.substring(7);
        try {
        return jwtUtil.extractUsername(token);
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT token has expired. Please login again.");
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token: " + e.getMessage());
        }
    }

    private void unsetDefaultForType(String username, String type) {
        List<Address> sameType = addressRepository.findByUser_UsernameAndTypeOrderByIdDesc(username, type);
        for (Address a : sameType) {
            if (Boolean.TRUE.equals(a.getIsDefault())) {
                a.setIsDefault(false);
                addressRepository.save(a);
            }
        }
    }
}