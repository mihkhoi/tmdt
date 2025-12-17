# 🛍️ ShopEase - E-Commerce Platform

Một nền tảng thương mại điện tử hiện đại được xây dựng với Spring Boot (Backend) và React + TypeScript (Frontend).

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Dự Án](#-chạy-dự-án)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Tính Năng Nâng Cao](#-tính-năng-nâng-cao)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Tính Năng

### Phần A: Tính Năng Cơ Bản (7 điểm)

1. ✅ **Giao diện Responsive** - Hiện đại, dễ sử dụng, thích ứng trên mobile và desktop
2. ✅ **Trang Chủ** - Banner carousel, sản phẩm nổi bật, CTA buttons
3. ✅ **Tìm Kiếm & Lọc** - Hiển thị theo danh mục, lọc theo giá, thương hiệu
4. ✅ **Quản Lý Sản Phẩm** - CRUD đầy đủ, lưu trong database quan hệ
5. ✅ **Giỏ Hàng** - Thêm/xóa sản phẩm, tính tổng giá, lưu trạng thái
6. ✅ **Thanh Toán** - Tích hợp VNPay, MoMo, PayPal, Stripe
7. ✅ **Tài Khoản** - Đăng ký, đăng nhập, quên mật khẩu, xác minh email, JWT, bcrypt

### Phần B: Tính Năng Mở Rộng (2 điểm)

8. ✅ **Đánh Giá Sản Phẩm** - Rating và bình luận
9. ✅ **Mã Giảm Giá** - Voucher system
10. ✅ **Tìm Kiếm Nâng Cao** - Full-text search, lọc nhiều tiêu chí
11. ✅ **Phân Tích & Báo Cáo** - Admin dashboard với thống kê

### Phần C: Tính Năng Tùy Chọn (1 điểm)

12. ✅ **Chatbot** - Chat widget tích hợp
13. ✅ **Đa Ngôn Ngữ & Tiền Tệ** - Tiếng Việt/English, VND/USD

### Tính Năng Nâng Cao

14. ✅ **Dark Mode** - Toggle dark/light theme
15. ✅ **Wishlist** - Lưu sản phẩm yêu thích
16. ✅ **Quick View** - Xem nhanh sản phẩm
17. ✅ **Image Zoom** - Zoom hình ảnh sản phẩm
18. ✅ **Recently Viewed** - Sản phẩm đã xem
19. ✅ **Product Comparison** - So sánh sản phẩm
20. ✅ **Share Product** - Chia sẻ lên mạng xã hội
21. ✅ **Product Recommendations** - Gợi ý sản phẩm
22. ✅ **Print Invoice** - In hóa đơn
23. ✅ **Keyboard Shortcuts** - Phím tắt

---

## 🛠️ Công Nghệ Sử Dụng

### Backend

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database ORM
- **H2 Database** - Embedded database
- **Maven** - Dependency management
- **Bcrypt** - Password hashing

### Frontend

- **React 18**
- **TypeScript**
- **Material-UI (MUI)** - UI components
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Inter Font** - Typography

### Payment Gateways

- **VNPay**
- **MoMo**
- **PayPal** (Sandbox)
- **Stripe** (Test mode)

---

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- **Java**: JDK 17 hoặc cao hơn
- **Node.js**: 16.x hoặc cao hơn
- **npm** hoặc **yarn**
- **Maven**: 3.6+

### Backend Setup

```bash
# Di chuyển vào thư mục backend
cd shop-backend

# Cài đặt dependencies (Maven sẽ tự động download)
mvn clean install

# Hoặc chỉ compile
mvn compile
```

### Frontend Setup

```bash
# Di chuyển vào thư mục frontend
cd shop-frontend

# Cài đặt dependencies
npm install

# Hoặc dùng yarn
yarn install
```

---

## ⚙️ Cấu Hình

### Backend Configuration

File: `shop-backend/src/main/resources/application.properties`

```properties
# Server
server.port=8080

# Database (H2 - Embedded)
spring.datasource.url=jdbc:h2:file:./shopdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JWT
app.jwt.secret=your-secret-key-change-this-in-production
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000

# VNPay
app.pay.vnpay.tmn-code=YOUR_TMN_CODE
app.pay.vnpay.secret-key=YOUR_SECRET_KEY
app.pay.vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# MoMo
app.pay.momo.partner-code=YOUR_PARTNER_CODE
app.pay.momo.access-key=YOUR_ACCESS_KEY
app.pay.momo.secret-key=YOUR_SECRET_KEY
```

### Frontend Configuration

File: `shop-frontend/.env`

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_USD_RATE=24000
```

---

## 🚀 Chạy Dự Án

### 1. Chạy Backend

```bash
cd shop-backend
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 2. Chạy Frontend

```bash
cd shop-frontend
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Truy Cập

Mở trình duyệt và truy cập: `http://localhost:3000`

---

## 📁 Cấu Trúc Dự Án

```
shop-ease/
├── shop-backend/              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/quanao/shop/shop_backend/
│   │   │   │       ├── config/        # Configuration
│   │   │   │       ├── controller/    # REST Controllers
│   │   │   │       ├── entity/        # JPA Entities
│   │   │   │       ├── repository/    # Data Repositories
│   │   │   │       ├── service/       # Business Logic
│   │   │   │       ├── pay/           # Payment Gateways
│   │   │   │       └── util/          # Utilities
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── shop-frontend/             # React Frontend
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    ├── src/
    │   ├── api/              # API clients
    │   ├── components/       # React components
    │   ├── pages/            # Page components
    │   ├── store/            # Redux store
    │   ├── utils/            # Utilities
    │   ├── hooks/            # Custom hooks
    │   ├── i18n.tsx          # Internationalization
    │   ├── App.tsx           # Main app component
    │   └── index.tsx         # Entry point
    ├── package.json
    └── tsconfig.json
```

---

## 📚 API Documentation

### Authentication

#### Đăng Ký

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com",
  "fullName": "Full Name"
}
```

#### Đăng Nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

#### Xác Minh Email

```http
GET /api/auth/verify-email?code=VERIFICATION_CODE
```

### Products

#### Lấy Danh Sách Sản Phẩm

```http
GET /api/products?page=0&size=12&category=ao-khoac&q=search
```

#### Lấy Chi Tiết Sản Phẩm

```http
GET /api/products/{id}
```

#### Tạo Sản Phẩm (Admin)

```http
POST /api/products
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### Orders

#### Tạo Đơn Hàng

```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main St",
  "paymentMethod": "VNPAY"
}
```

#### Tạo VNPay Payment

```http
POST /api/orders/{id}/pay/vnpay/create
Authorization: Bearer {token}
```

### Admin

#### Xem Danh Sách Đơn Hàng

```http
GET /api/admin/orders
Authorization: Bearer {token}
```

#### Cập Nhật Trạng Thái Đơn Hàng

```http
PUT /api/admin/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "PROCESSING"
}
```

---

## 🎨 Tính Năng Nâng Cao

### Dark Mode

- Click icon 🌓 ở toolbar để toggle
- Preference được lưu trong localStorage

### Wishlist

- Click ❤️ trên ProductCard hoặc ProductDetailPage
- Xem wishlist trong localStorage

### Quick View

- Hover vào ProductCard → Click icon 👁️
- Xem nhanh không cần rời trang chủ

### Product Comparison

- Click ⚖️ để thêm vào comparison
- So sánh tối đa 4 sản phẩm
- Xem comparison từ icon trong toolbar

### Keyboard Shortcuts

- `Ctrl+K`: Focus search
- `Ctrl+C`: Open cart
- `Ctrl+X`: Open comparison
- `Ctrl+Shift+D`: Toggle dark mode

---

## 🔧 Troubleshooting

### Backend không start

```bash
# Kiểm tra Java version
java -version  # Cần Java 17+

# Kiểm tra port 8080 có đang dùng không
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Mac/Linux

# Xóa và rebuild
mvn clean install
```

### Frontend không start

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Kiểm tra port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # Mac/Linux
```

### Lỗi CORS

- Kiểm tra `application.properties` có đúng `app.cors.allowed-origins`
- Đảm bảo frontend URL khớp với cấu hình

### Lỗi Payment Gateway

- Kiểm tra `local.env` có đúng credentials
- VNPay: Kiểm tra `TMN_CODE` và `SECRET_KEY`
- MoMo: Kiểm tra `PARTNER_CODE`, `ACCESS_KEY`, `SECRET_KEY`

### Database Issues

- H2 database file: `shop-backend/shopdb.mv.db`
- Nếu lỗi, xóa file và restart backend (sẽ tạo lại)

---

## 📝 Environment Variables

### Backend (`shop-backend/local.env`)

```env
# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# VNPay
VNPAY_TMN_CODE=your-tmn-code
VNPAY_SECRET_KEY=your-secret-key

# MoMo
MOMO_PARTNER_CODE=your-partner-code
MOMO_ACCESS_KEY=your-access-key
MOMO_SECRET_KEY=your-secret-key
```

### Frontend (`shop-frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_USD_RATE=24000
```

---

## 🧪 Testing

### Test Backend

```bash
cd shop-backend
mvn test
```

### Test Frontend

```bash
cd shop-frontend
npm test
```

### Manual Testing Checklist

Xem file `TEST_AND_DEBUG.md` để có checklist đầy đủ.

---

## 📦 Build for Production

### Backend

```bash
cd shop-backend
mvn clean package
# JAR file sẽ ở: target/shop-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd shop-frontend
npm run build
# Build files sẽ ở: build/
```

---

## 🚀 Deployment

### Backend Deployment

1. Build JAR file: `mvn clean package`
2. Chạy: `java -jar target/shop-backend-0.0.1-SNAPSHOT.jar`
3. Hoặc deploy lên cloud (Heroku, AWS, etc.)

### Frontend Deployment

1. Build: `npm run build`
2. Deploy folder `build/` lên:
   - **Netlify**
   - **Vercel**
   - **GitHub Pages**
   - **AWS S3 + CloudFront**

---

## 👥 Default Accounts

### Admin Account

- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

### User Account

- Tạo mới qua form đăng ký

---

## 📖 Tài Liệu Tham Khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [VNPay Integration Guide](https://sandbox.vnpayment.vn/apis/)

---

## 📄 License

Dự án cá nhân - Tự do sử dụng

---

## 👨‍💻 Tác Giả

ShopEase Development Team

---

## 🎉 Chúc Bạn Sử Dụng Vui Vẻ!

Nếu có vấn đề, vui lòng kiểm tra:

- `TEST_AND_DEBUG.md` - Hướng dẫn test và debug
- `TROUBLESHOOTING.md` - Giải quyết các lỗi thường gặp
- `FEATURES_GUIDE.md` - Hướng dẫn sử dụng các tính năng
