# VNPay Debug Guide

## Kiểm tra cấu hình VNPay

### 1. Xác nhận file `local.env` có đúng key:

```
VNPAY_ENABLED=true
VNPAY_TMN_CODE=U2SCOB58
VNPAY_SECRET_KEY=BFP63DZHASBOT68EACY7QVVDJTZBN6CD
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### 2. Restart Backend

Sau khi thay đổi `local.env`, **PHẢI RESTART BACKEND** để đọc lại config:

```bash
# Dừng backend (Ctrl+C)
# Sau đó chạy lại:
cd shop-backend
mvn spring-boot:run
```

### 3. Kiểm tra log khi tạo payment URL

Khi bạn tạo payment URL, backend sẽ log ra:

- TMN Code đang dùng
- Secret Key (10 ký tự đầu)
- Pay URL
- Hash Data và Secure Hash

### 4. Kiểm tra trong VNPay Merchant Portal

1. Đăng nhập: https://sandbox.vnpayment.vn/merchantv2/
2. Email: lolmekiep123@gmail.com
3. Vào **Cấu hình** → **IPN URL**
4. Đảm bảo IPN URL được cấu hình: `http://localhost:8080/api/orders/pay/vnpay/ipn`
   - Hoặc nếu deploy: `https://your-domain.com/api/orders/pay/vnpay/ipn`

### 5. Lỗi thường gặp

#### Lỗi 72: "Không tìm thấy website"

- **Nguyên nhân**: TMN Code không đúng hoặc chưa được kích hoạt
- **Giải pháp**:
  - Kiểm tra lại TMN Code trong `local.env` = `U2SCOB58`
  - Đảm bảo đã restart backend
  - Kiểm tra trong VNPay Merchant Portal xem TMN Code có active không

#### Lỗi checksum không đúng

- **Nguyên nhân**: Secret Key không đúng
- **Giải pháp**:
  - Kiểm tra Secret Key trong `local.env` = `BFP63DZHASBOT68EACY7QVVDJTZBN6CD`
  - Đảm bảo không có khoảng trắng thừa
  - Restart backend

#### Payment URL không tạo được

- Kiểm tra log backend xem có error gì không
- Kiểm tra xem order có status = PENDING không
- Kiểm tra xem user có quyền truy cập order không

### 6. Test với thẻ test VNPay

- **Ngân hàng**: NCB
- **Số thẻ**: 9704198526191432198
- **Tên chủ thẻ**: NGUYEN VAN A
- **Ngày phát hành**: 07/15
- **Mật khẩu OTP**: 123456

### 7. Debug Steps

1. Tạo order mới
2. Chọn VNPay payment
3. Xem log backend để kiểm tra:
   - Config có đúng không
   - Payment URL có được tạo không
   - Hash có đúng không
4. Kiểm tra URL được tạo có chứa đúng TMN Code và Secure Hash không
5. Nếu vẫn lỗi, kiểm tra trong VNPay Merchant Portal xem có transaction nào được tạo không
