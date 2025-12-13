# VNPay Checksum Fix - Theo Đặc Tả VNPay v2.1.0

## Vấn đề đã sửa

Theo tài liệu đặc tả VNPay v2.1.0, cách tạo checksum (vnp_SecureHash) phải tuân thủ:

### 1. Quy tắc tạo Hash Data

- Sắp xếp các tham số theo thứ tự **alphabet** (A-Z)
- Loại bỏ các field có giá trị **null hoặc rỗng**
- Format: `fieldName=fieldValue&fieldName2=fieldValue2`
- **KHÔNG được URL encode** hash data (chỉ query string mới encode)

### 2. Quy tắc tạo Secure Hash

- Hash data được tạo từ bước trên
- Sử dụng **HMACSHA512** với secret key
- Format output: **hexadecimal uppercase** (ví dụ: `2CD8A970B02A...`)

### 3. Code đã sửa

#### File: `VNPayUtil.java`

- ✅ Sửa `getPaymentURL()` để khi `encodeKey=false` thì **KHÔNG encode** hash data
- ✅ Đảm bảo sắp xếp theo alphabet
- ✅ Loại bỏ field null/rỗng

#### File: `OrderController.java`

- ✅ Thay thế tất cả `hmacSHA512()` local bằng `VNPayUtil.hmacSHA512()` để nhất quán
- ✅ Đảm bảo verify checksum đúng cách

#### File: `VNPayService.java`

- ✅ Đã đúng cách tạo hash data (không encode)
- ✅ Đã đúng cách tạo secure hash với HMACSHA512

## Kiểm tra lại

### 1. Xác nhận Config trong `local.env`:

```
VNPAY_ENABLED=true
VNPAY_TMN_CODE=U2SCOB58
VNPAY_SECRET_KEY=BFP63DZHASBOT68EACY7QVVDJTZBN6CD
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### 2. Restart Backend

**QUAN TRỌNG**: Sau khi sửa code, **PHẢI RESTART BACKEND**:

```bash
# Dừng backend (Ctrl+C)
cd shop-backend
mvn spring-boot:run
```

### 3. Kiểm tra Log

Khi tạo payment URL, backend sẽ log:

```
=== VNPay Payment URL Creation ===
  Order ID: ...
  Amount: ...
  TMN Code: U2SCOB58
  Secret Key (first 10 chars): BFP63DZHAS
  Hash Data: vnp_Amount=...&vnp_Command=pay&vnp_CreateDate=...&...
  Secure Hash: 2CD8A970B02A...
```

### 4. Verify Hash Data Format

Hash data phải có format:

```
vnp_Amount=1000000&vnp_Command=pay&vnp_CreateDate=20240101120000&vnp_CurrCode=VND&vnp_ExpireDate=20240101121500&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Pay order 123&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:8080/api/orders/123/pay/vnpay/return&vnp_TmnCode=U2SCOB58&vnp_TxnRef=123&vnp_Version=2.1.0
```

**LƯU Ý**:

- Không có URL encoding trong hash data
- Các field được sắp xếp theo alphabet
- Không có field `vnp_SecureHash` trong hash data

### 5. Test với VNPay Sandbox

1. Tạo order mới
2. Chọn VNPay payment
3. Xem log backend để verify hash data và secure hash
4. Kiểm tra URL được tạo có chứa đúng secure hash không
5. Test với thẻ test VNPay:
   - Số thẻ: 9704198526191432198
   - Tên: NGUYEN VAN A
   - Ngày: 07/15
   - OTP: 123456

## Lỗi thường gặp

### Lỗi 72: "Không tìm thấy website"

- **Nguyên nhân**: TMN Code không đúng hoặc chưa được kích hoạt
- **Giải pháp**:
  - Kiểm tra `VNPAY_TMN_CODE=U2SCOB58` trong `local.env`
  - Restart backend
  - Kiểm tra trong VNPay Merchant Portal

### Lỗi 97: "Sai chữ ký"

- **Nguyên nhân**: Checksum không đúng
- **Giải pháp**:
  - Kiểm tra Secret Key: `BFP63DZHASBOT68EACY7QVVDJTZBN6CD`
  - Đảm bảo hash data **KHÔNG được URL encode**
  - Đảm bảo các field được sắp xếp theo alphabet
  - Kiểm tra log để xem hash data và secure hash

### Payment URL không tạo được

- Kiểm tra log backend
- Kiểm tra order status = PENDING
- Kiểm tra user có quyền truy cập order

## Tài liệu tham khảo

- VNPay Integration Document v2.1.0
- VNPay Sandbox: https://sandbox.vnpayment.vn/
- Merchant Portal: https://sandbox.vnpayment.vn/merchantv2/
