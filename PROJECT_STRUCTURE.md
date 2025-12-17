# 📁 Cấu Trúc Dự Án Chi Tiết

## 🗂️ Tổng Quan

```
shop-ease/
├── shop-backend/          # Spring Boot Backend
├── shop-frontend/         # React Frontend
├── README.md              # Tài liệu chính
├── USER_GUIDE.md          # Hướng dẫn người dùng
├── DEVELOPER_GUIDE.md     # Hướng dẫn developer
├── QUICK_START.md         # Hướng dẫn nhanh
└── PROJECT_STRUCTURE.md   # File này
```

---

## 📦 Backend Structure

```
shop-backend/
├── src/
│   ├── main/
│   │   ├── java/com/quanao/shop/shop_backend/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java      # Security, CORS, JWT
│   │   │   │   └── AppProperties.java       # Config properties
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java      # /api/auth/*
│   │   │   │   ├── ProductController.java   # /api/products/*
│   │   │   │   ├── OrderController.java     # /api/orders/*
│   │   │   │   └── AdminController.java     # /api/admin/*
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── User.java                # User entity
│   │   │   │   ├── Product.java             # Product entity
│   │   │   │   ├── Order.java               # Order entity
│   │   │   │   └── OrderItem.java          # Order item entity
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   └── OrderRepository.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── ProductService.java
│   │   │   │   └── OrderService.java
│   │   │   │
│   │   │   ├── pay/
│   │   │   │   ├── vnpay/
│   │   │   │   │   └── VNPayService.java
│   │   │   │   └── momo/
│   │   │   │       └── MoMoService.java
│   │   │   │
│   │   │   └── util/
│   │   │       └── (Utilities)
│   │   │
│   │   └── resources/
│   │       ├── application.properties       # Main config
│   │       └── (Other resources)
│   │
│   └── test/                                # Unit tests
│
├── pom.xml                                  # Maven dependencies
└── local.env                                # Environment variables
```

---

## 🎨 Frontend Structure

```
shop-frontend/
├── public/
│   ├── index.html                          # HTML template
│   └── manifest.json                      # PWA manifest
│
├── src/
│   ├── api/
│   │   ├── http.ts                         # Axios instance
│   │   ├── productApi.ts                   # Product API
│   │   └── orderApi.ts                     # Order API
│   │
│   ├── components/
│   │   ├── MainLayout.tsx                  # Main layout
│   │   ├── ProductCard.tsx                 # Product card
│   │   ├── DarkModeToggle.tsx              # Dark mode
│   │   ├── WishlistButton.tsx             # Wishlist
│   │   ├── ProductQuickView.tsx            # Quick view
│   │   ├── ProductImageGallery.tsx        # Image gallery
│   │   ├── ProductComparison.tsx           # Comparison
│   │   ├── ShareProduct.tsx                # Social sharing
│   │   ├── ToastNotification.tsx           # Toast
│   │   ├── LoadingSkeleton.tsx             # Loading
│   │   ├── RecentlyViewed.tsx              # Recently viewed
│   │   ├── AdvancedSearch.tsx              # Advanced search
│   │   ├── CompareButton.tsx               # Compare button
│   │   ├── PriceRangeFilter.tsx            # Price filter
│   │   ├── ProductRecommendations.tsx      # Recommendations
│   │   ├── PrintInvoice.tsx                # Print invoice
│   │   ├── InfiniteScroll.tsx              # Infinite scroll
│   │   ├── ChatWidget.tsx                  # Chat widget
│   │   └── (Other components)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx                    # Trang chủ
│   │   ├── ProductDetailPage.tsx           # Chi tiết sản phẩm
│   │   ├── CartPage.tsx                    # Giỏ hàng
│   │   ├── CheckoutPage.tsx                # Thanh toán
│   │   ├── LoginPage.tsx                   # Đăng nhập
│   │   ├── RegisterPage.tsx                # Đăng ký
│   │   ├── MyOrdersPage.tsx                # Đơn hàng
│   │   ├── OrderDetailPage.tsx             # Chi tiết đơn
│   │   ├── OrderSuccessPage.tsx            # Thành công
│   │   ├── VerifyEmailPage.tsx             # Xác minh email
│   │   ├── admin/                          # Admin pages
│   │   └── account/                        # Account pages
│   │
│   ├── store/
│   │   ├── store.ts                        # Redux store
│   │   ├── authSlice.ts                    # Auth state
│   │   └── cartSlice.ts                    # Cart state
│   │
│   ├── utils/
│   │   ├── currencyUtils.ts                # Currency formatting
│   │   ├── productUtils.ts                 # Product utilities
│   │   └── typography.ts                   # Typography utilities
│   │
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts         # Keyboard shortcuts
│   │
│   ├── i18n.tsx                            # Internationalization
│   ├── App.tsx                             # Main app
│   └── index.tsx                           # Entry point
│
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
└── .env                                    # Environment variables
```

---

## 📄 Configuration Files

### Backend

- `application.properties`: Main configuration
- `local.env`: Environment variables (not committed)
- `pom.xml`: Maven dependencies

### Frontend

- `.env`: Environment variables
- `package.json`: npm dependencies
- `tsconfig.json`: TypeScript configuration

---

## 🔑 Key Files

### Backend

- **SecurityConfig.java**: Security, CORS, JWT setup
- **OrderController.java**: Payment gateway integration
- **VNPayService.java**: VNPay payment logic

### Frontend

- **MainLayout.tsx**: Main layout với navigation
- **HomePage.tsx**: Product listing với filters
- **ProductDetailPage.tsx**: Product details với recommendations
- **index.tsx**: Theme setup với dark mode

---

## 📊 Database Schema

### Tables

- `users`: User accounts
- `products`: Product catalog
- `orders`: Customer orders
- `order_items`: Order line items
- `reviews`: Product reviews
- `vouchers`: Discount vouchers

---

## 🎯 Entry Points

### Backend

- Main class: `ShopBackendApplication.java`
- Port: `8080`
- Base URL: `http://localhost:8080/api`

### Frontend

- Entry: `src/index.tsx`
- Port: `3000`
- URL: `http://localhost:3000`

---

**Cấu trúc này giúp dễ dàng navigate và maintain code! 📁**
