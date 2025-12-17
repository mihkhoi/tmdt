# ⚡ Quick Start Guide

## 🚀 Chạy Dự Án Nhanh

### Bước 1: Cài Đặt Dependencies

#### Backend

```bash
cd shop-backend
mvn clean install
```

#### Frontend

```bash
cd shop-frontend
npm install
```

### Bước 2: Cấu Hình

#### Backend

Tạo file `shop-backend/local.env`:

```env
JWT_SECRET=your-secret-key-here
VNPAY_TMN_CODE=your-tmn-code
VNPAY_SECRET_KEY=your-secret-key
```

#### Frontend

Tạo file `shop-frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_USD_RATE=24000
```

### Bước 3: Chạy

#### Terminal 1 - Backend

```bash
cd shop-backend
mvn spring-boot:run
```

#### Terminal 2 - Frontend

```bash
cd shop-frontend
npm start
```

### Bước 4: Truy Cập

Mở trình duyệt: `http://localhost:3000`

---

## 👤 Tài Khoản Mặc Định

### Admin

- Username: `admin`
- Password: `admin123`

### User

- Tạo mới qua form đăng ký

---

## 📝 Lưu Ý

- Backend chạy trên port **8080**
- Frontend chạy trên port **3000**
- Database H2 tự động tạo khi chạy lần đầu
- Email verification code sẽ hiện trong console log backend

---

**Xem thêm:**

- `README.md` - Tài liệu đầy đủ
- `USER_GUIDE.md` - Hướng dẫn sử dụng
- `DEVELOPER_GUIDE.md` - Hướng dẫn phát triển
