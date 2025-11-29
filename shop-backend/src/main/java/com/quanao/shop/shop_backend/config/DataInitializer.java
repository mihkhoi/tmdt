package com.quanao.shop.shop_backend.config;

import com.quanao.shop.shop_backend.entity.User;
import com.quanao.shop.shop_backend.entity.Product;
import com.quanao.shop.shop_backend.repository.UserRepository;
import com.quanao.shop.shop_backend.repository.ProductRepository;
import com.quanao.shop.shop_backend.repository.CategoryRepository;
import com.quanao.shop.shop_backend.entity.Category;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           ProductRepository productRepository,
                           CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        // nếu chưa có admin thì tạo mới
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // mật khẩu
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Created default admin: admin / admin123");
        }

        if (productRepository.count() == 0) {
            Category fashion = categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Thời trang").slug("thoi-trang").build()));
            Category shoes = categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Giày dép").slug("giay-dep").build()));
            Category electronics = categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Điện tử").slug("dien-tu").build()));

            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Áo thun Shopeee")
                    .description("Áo thun cotton 100%")
                    .price(java.math.BigDecimal.valueOf(99000))
                    .stock(100)
                    .imageUrl("https://picsum.photos/seed/shirt/600/400")
                    .status("ACTIVE")
                    .category(fashion)
                    .brand("NoBrand")
                    .discountPercent(10)
                    .flashSaleEndAt(java.time.LocalDateTime.now().plusDays(1))
                    .build()));

            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Giày thể thao")
                    .description("Giày chạy bộ siêu êm")
                    .price(java.math.BigDecimal.valueOf(499000))
                    .stock(50)
                    .imageUrl("https://picsum.photos/seed/shoes/600/400")
                    .status("ACTIVE")
                    .category(shoes)
                    .brand("NoBrand")
                    .build()));

            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Tai nghe Bluetooth")
                    .description("Âm bass mạnh, pin 24h")
                    .price(java.math.BigDecimal.valueOf(299000))
                    .stock(80)
                    .imageUrl("https://picsum.photos/seed/earbuds/600/400")
                    .status("ACTIVE")
                    .category(electronics)
                    .brand("NoBrand")
                    .discountPercent(20)
                    .flashSaleEndAt(java.time.LocalDateTime.now().plusHours(6))
                    .build()));
            System.out.println(">>> Seeded demo products");
        }

        Category aoNam = categoryRepository.findBySlug("ao-nam")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Áo Nam").slug("ao-nam").build())));
        Category aoNu = categoryRepository.findBySlug("ao-nu")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Áo Nữ").slug("ao-nu").build())));
        Category quanNam = categoryRepository.findBySlug("quan-nam")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Quần Nam").slug("quan-nam").build())));
        Category quanNu = categoryRepository.findBySlug("quan-nu")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Quần Nữ").slug("quan-nu").build())));
        Category phuKien = categoryRepository.findBySlug("phu-kien")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Phụ kiện").slug("phu-kien").build())));

        Category aoThun = categoryRepository.findBySlug("ao-thun")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Áo thun").slug("ao-thun").build())));
        Category aoSoMi = categoryRepository.findBySlug("ao-so-mi")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Áo sơ mi").slug("ao-so-mi").build())));
        Category hoodie = categoryRepository.findBySlug("hoodie")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Hoodie").slug("hoodie").build())));
        Category quanShort = categoryRepository.findBySlug("quan-short")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Quần short").slug("quan-short").build())));
        Category quanTay = categoryRepository.findBySlug("quan-tay")
                .orElseGet(() -> categoryRepository.save(java.util.Objects.requireNonNull(Category.builder().name("Quần tây").slug("quan-tay").build())));

        boolean hasShirtBasic = !productRepository.findByNameContainingIgnoreCase("Áo thun nam Basics", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasShirtBasic) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Áo thun nam Basics")
                    .description("Áo thun nam cotton thoáng mát")
                    .price(java.math.BigDecimal.valueOf(129000))
                    .stock(120)
                    .imageUrl("https://picsum.photos/seed/ao-nam-1/600/400")
                    .status("ACTIVE")
                    .category(aoNam)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasShirtWomen = !productRepository.findByNameContainingIgnoreCase("Sơ mi nữ Elegant", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasShirtWomen) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Sơ mi nữ Elegant")
                    .description("Sơ mi nữ dáng công sở")
                    .price(java.math.BigDecimal.valueOf(249000))
                    .stock(80)
                    .imageUrl("https://picsum.photos/seed/ao-nu-1/600/400")
                    .status("ACTIVE")
                    .category(aoNu)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasJeanMen = !productRepository.findByNameContainingIgnoreCase("Quần jean nam", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasJeanMen) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Quần jean nam")
                    .description("Jean nam co giãn")
                    .price(java.math.BigDecimal.valueOf(299000))
                    .stock(60)
                    .imageUrl("https://picsum.photos/seed/quan-nam-1/600/400")
                    .status("ACTIVE")
                    .category(quanNam)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasSkirtWomen = !productRepository.findByNameContainingIgnoreCase("Quần váy nữ", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasSkirtWomen) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Quần váy nữ")
                    .description("Quần váy nữ thời trang")
                    .price(java.math.BigDecimal.valueOf(279000))
                    .stock(70)
                    .imageUrl("https://picsum.photos/seed/quan-nu-1/600/400")
                    .status("ACTIVE")
                    .category(quanNu)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasCap = !productRepository.findByNameContainingIgnoreCase("Nón thời trang", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasCap) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Nón thời trang")
                    .description("Mũ lưỡi trai unisex")
                    .price(java.math.BigDecimal.valueOf(99000))
                    .stock(150)
                    .imageUrl("https://picsum.photos/seed/phu-kien-1/600/400")
                    .status("ACTIVE")
                    .category(phuKien)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasThun = !productRepository.findByNameContainingIgnoreCase("Áo thun basic", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasThun) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Áo thun basic")
                    .description("Áo thun unisex, cotton mềm")
                    .price(java.math.BigDecimal.valueOf(149000))
                    .stock(140)
                    .imageUrl("https://picsum.photos/seed/ao-thun-1/600/400")
                    .status("ACTIVE")
                    .category(aoThun)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasSomi = !productRepository.findByNameContainingIgnoreCase("Áo sơ mi classic", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasSomi) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Áo sơ mi classic")
                    .description("Sơ mi cổ điển, form chuẩn")
                    .price(java.math.BigDecimal.valueOf(259000))
                    .stock(90)
                    .imageUrl("https://picsum.photos/seed/ao-so-mi-1/600/400")
                    .status("ACTIVE")
                    .category(aoSoMi)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasHoodie = !productRepository.findByNameContainingIgnoreCase("Hoodie nỉ ấm", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasHoodie) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Hoodie nỉ ấm")
                    .description("Hoodie unisex, nỉ dày")
                    .price(java.math.BigDecimal.valueOf(329000))
                    .stock(70)
                    .imageUrl("https://picsum.photos/seed/hoodie-1/600/400")
                    .status("ACTIVE")
                    .category(hoodie)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasShort = !productRepository.findByNameContainingIgnoreCase("Quần short thoáng", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasShort) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Quần short thoáng")
                    .description("Short vải nhẹ, phù hợp mùa hè")
                    .price(java.math.BigDecimal.valueOf(179000))
                    .stock(110)
                    .imageUrl("https://picsum.photos/seed/quan-short-1/600/400")
                    .status("ACTIVE")
                    .category(quanShort)
                    .brand("NoBrand")
                    .build()));
        }

        boolean hasTay = !productRepository.findByNameContainingIgnoreCase("Quần tây công sở", org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty();
        if (!hasTay) {
            productRepository.save(java.util.Objects.requireNonNull(Product.builder()
                    .name("Quần tây công sở")
                    .description("Quần tây form chuẩn, lịch sự")
                    .price(java.math.BigDecimal.valueOf(349000))
                    .stock(85)
                    .imageUrl("https://picsum.photos/seed/quan-tay-1/600/400")
                    .status("ACTIVE")
                    .category(quanTay)
                    .brand("NoBrand")
                    .build()));
        }
    }
}
