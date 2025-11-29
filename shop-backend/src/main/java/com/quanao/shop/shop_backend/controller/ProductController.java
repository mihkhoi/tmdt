package com.quanao.shop.shop_backend.controller;

import com.quanao.shop.shop_backend.entity.Product;
import com.quanao.shop.shop_backend.service.ProductService;
import com.quanao.shop.shop_backend.security.AdminOnly;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.quanao.shop.shop_backend.dto.ProductSuggestionDto;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;
import com.quanao.shop.shop_backend.entity.ProductImage;
import com.quanao.shop.shop_backend.repository.ProductImageRepository;
import com.quanao.shop.shop_backend.repository.OrderRepository;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductImageRepository productImageRepository;
    private final OrderRepository orderRepository;
    private final com.quanao.shop.shop_backend.config.AppProperties appProperties;
    

    // GET /api/products?q=phone&page=0&size=12
    @GetMapping
    public Page<Product> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean newOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return productService.searchAdvanced(q, category, minPrice, maxPrice, sort, newOnly, page, size);
    }

    // GET /api/products/1
    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable @NonNull Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/products
    @PostMapping
    @AdminOnly
    public Product create(@RequestBody Product product, jakarta.servlet.http.HttpServletRequest request) {
        return productService.create(product);
    }

    // PUT /api/products/1
    @PutMapping("/{id}")
    @AdminOnly
    public Product update(@PathVariable @NonNull Long id, @RequestBody Product product, jakarta.servlet.http.HttpServletRequest request) {
        return productService.update(id, java.util.Objects.requireNonNull(product));
    }

    // DELETE /api/products/1
    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> delete(@PathVariable @NonNull Long id, jakarta.servlet.http.HttpServletRequest request) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ====== API GỢI Ý TÌM KIẾM ======
    // GET /api/products/suggest?q=ip
    @GetMapping("/suggest")
    public List<ProductSuggestionDto> suggest(@RequestParam String q) {
        return productService.suggest(q);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return productService.categories();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<java.util.Map<String, Object>> stats(@PathVariable @NonNull Long id) {
        var opt = productService.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        var p = opt.get();
        Long sold = orderRepository.countSoldByProductId(id);
        java.util.Map<String, Object> m = new java.util.HashMap<>();
        m.put("averageRating", p.getAverageRating());
        m.put("ratingCount", p.getRatingCount());
        m.put("soldCount", sold == null ? 0L : sold);
        return ResponseEntity.ok(m);
    }

    @PostMapping("/{id}/image")
    @AdminOnly
    public ResponseEntity<Product> uploadImage(
            @PathVariable @NonNull Long id,
            @RequestParam("file") MultipartFile file,
            jakarta.servlet.http.HttpServletRequest request
    ) throws java.io.IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String uploadDir = appProperties.getUploadDir();
        java.nio.file.Path dir = java.nio.file.Paths.get(System.getProperty("user.dir"), uploadDir);
        java.nio.file.Files.createDirectories(dir);
        String filename = "product_" + id + "_" + System.currentTimeMillis() + "." + getExt(file.getOriginalFilename());
        java.nio.file.Path path = dir.resolve(filename);
        java.io.File dest = path.toFile();
        file.transferTo(java.util.Objects.requireNonNull(dest));

        String url = "/uploads/" + filename;
        Product p = productService.updateImageUrl(id, url);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/{id}/images")
    @AdminOnly
    public ResponseEntity<ProductImage> uploadGalleryImage(
            @PathVariable @NonNull Long id,
            @RequestParam("file") MultipartFile file
    ) throws java.io.IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String uploadDir2 = appProperties.getUploadDir();
        java.nio.file.Path dir = java.nio.file.Paths.get(System.getProperty("user.dir"), uploadDir2);
        java.nio.file.Files.createDirectories(dir);
        String filename = "product_" + id + "_gallery_" + System.currentTimeMillis() + "." + getExt(file.getOriginalFilename());
        java.nio.file.Path path = dir.resolve(filename);
        java.io.File dest = path.toFile();
        file.transferTo(java.util.Objects.requireNonNull(dest));
        String url = "/uploads/" + filename;
        ProductImage pi = productImageRepository.save(java.util.Objects.requireNonNull(ProductImage.builder()
                .product(java.util.Objects.requireNonNull(productService.findById(id).orElseThrow()))
                .url(url)
                .build()));
        return ResponseEntity.ok(pi);
    }

    @PutMapping("/{id}/images/{imageId}")
    @AdminOnly
    public ResponseEntity<ProductImage> updateGalleryImage(
            @PathVariable @NonNull Long id,
            @PathVariable @NonNull Long imageId,
            @RequestParam("file") MultipartFile file
    ) throws java.io.IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ProductImage img = productImageRepository.findById(imageId).orElseThrow();
        if (!img.getProduct().getId().equals(id)) {
            return ResponseEntity.status(400).build();
        }
        String uploadDir = appProperties.getUploadDir();
        java.nio.file.Path dir = java.nio.file.Paths.get(System.getProperty("user.dir"), uploadDir);
        java.nio.file.Files.createDirectories(dir);
        String old = img.getUrl();
        String filename = "product_" + id + "_gallery_" + System.currentTimeMillis() + "." + getExt(file.getOriginalFilename());
        java.nio.file.Path path = dir.resolve(filename);
        java.io.File dest = path.toFile();
        file.transferTo(java.util.Objects.requireNonNull(dest));
        String url = "/uploads/" + filename;
        img.setUrl(url);
        productImageRepository.save(img);
        if (old != null && old.startsWith("/uploads/")) {
            try {
                java.nio.file.Path oldPath = dir.resolve(old.substring("/uploads/".length()));
                java.nio.file.Files.deleteIfExists(oldPath);
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(img);
    }

    @GetMapping("/{id}/images")
    public List<ProductImage> listGallery(@PathVariable @NonNull Long id) {
        return productImageRepository.findByProduct_IdOrderByPositionAsc(id);
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @AdminOnly
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable @NonNull Long id, @PathVariable @NonNull Long imageId) {
        ProductImage img = productImageRepository.findById(imageId).orElseThrow();
        if (!img.getProduct().getId().equals(id)) {
            return ResponseEntity.status(400).build();
        }
        productImageRepository.deleteById(imageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/images/order")
    @AdminOnly
    public ResponseEntity<Void> orderGallery(@PathVariable @NonNull Long id, @RequestBody java.util.List<Long> ids) {
        java.util.List<ProductImage> imgs = productImageRepository.findByProduct_IdOrderByPositionAsc(id);
        java.util.Map<Long, Integer> pos = new java.util.HashMap<>();
        for (int i = 0; i < ids.size(); i++) pos.put(ids.get(i), i);
        for (ProductImage im : imgs) {
            Integer p = pos.get(im.getId());
            if (p != null) {
                im.setPosition(p);
                productImageRepository.save(im);
            }
        }
        return ResponseEntity.noContent().build();
    }

    private String getExt(String name) {
        if (name == null) return "bin";
        int i = name.lastIndexOf('.');
        return (i >= 0) ? name.substring(i + 1) : "bin";
    }

}
