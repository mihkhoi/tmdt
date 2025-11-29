package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.entity.Voucher;
import com.quanao.shop.shop_backend.repository.VoucherRepository;
import com.quanao.shop.shop_backend.security.AdminOnly;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

// removed unused import

@RestController
@RequestMapping("/api/admin/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherRepository voucherRepository;

    @GetMapping
    @AdminOnly
    public org.springframework.data.domain.Page<Voucher> list(@RequestParam(required = false) String q,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        if (q != null && !q.isBlank()) {
            java.util.List<Voucher> list = voucherRepository.findByCodeContainingIgnoreCase(q.trim());
            return new org.springframework.data.domain.PageImpl<>(list, pageable, list.size());
        }
        return voucherRepository.findAll(pageable);
    }

    @PostMapping
    @AdminOnly
    public ResponseEntity<Voucher> create(@RequestBody Voucher v) {
        if (v.getCode() == null || v.getCode().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (voucherRepository.findByCode(v.getCode()).isPresent()) {
            return ResponseEntity.status(409).build();
        }
        return ResponseEntity.ok(voucherRepository.save(v));
    }

    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> delete(@PathVariable @NonNull Long id) {
        voucherRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Voucher> update(@PathVariable @NonNull Long id, @RequestBody Voucher v) {
        Voucher cur = voucherRepository.findById(id).orElseThrow();
        String newCode = v.getCode();
        if (newCode == null || newCode.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        var exist = voucherRepository.findByCode(newCode);
        if (exist.isPresent() && !exist.get().getId().equals(id)) {
            return ResponseEntity.status(409).build();
        }
        cur.setCode(newCode);
        cur.setPercent(v.getPercent());
        cur.setMinOrder(v.getMinOrder());
        cur.setValidFrom(v.getValidFrom());
        cur.setValidTo(v.getValidTo());
        return ResponseEntity.ok(voucherRepository.save(cur));
    }
}