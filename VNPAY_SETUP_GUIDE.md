# 📋 Hướng Dẫn Cài Đặt VNPay

## 🔑 Thông Tin Cấu Hình

Từ tài liệu VNPay Sandbox:

- **Terminal ID / Website Code (vnp_TmnCode):** `U2SCOB58`
- **Secret Key / Checksum Secret String (vnp_HashSecret):** `BFP63DZHASBOT68EACY7QVVDJTZBN6CD`
- **Test Environment Payment URL (vnp_Url):** `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`

## 📝 Cấu Hình Trong Dự Án

### 1. File `shop-backend/local.env`

Đã được cấu hình sẵn:

```env
VNPAY_ENABLED=true
VNPAY_TMN_CODE=U2SCOB58
VNPAY_SECRET_KEY=BFP63DZHASBOT68EACY7QVVDJTZBN6CD
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_VERSION=2.1.0
VNPAY_COMMAND=pay
VNPAY_CURR_CODE=VND
VNPAY_LOCALE=vn
```

### 2. Các Endpoint Đã Được Cài Đặt

#### ✅ Build URL Thanh Toán

- **Endpoint:** `POST /api/orders/{id}/pay/vnpay/create`
- **Mô tả:** Tạo URL thanh toán và chuyển hướng khách hàng sang VNPay
- **Code:** `VNPayService.createPaymentUrl()`

#### ✅ Return URL (vnp_ReturnUrl)

- **Endpoint:** `GET /api/orders/{id}/pay/vnpay/return`
- **Mô tả:** Nhận kết quả thanh toán từ VNPay và redirect về frontend
- **Code:** `OrderController.handleVNPayReturn()`
- **Lưu ý:** Chỉ kiểm tra checksum và hiển thị kết quả, không cập nhật database

#### ✅ IPN URL (Server-to-Server)

- **Endpoint:** `POST /api/orders/pay/vnpay/ipn`
- **Mô tả:** Nhận thông báo từ VNPay và cập nhật kết quả thanh toán vào database
- **Code:** `OrderController.handleVNPayIPN()`
- **Response:** JSON với `RspCode` và `Message`

## 🔄 Luồng Thanh Toán

### Bước 1: Khách hàng chọn thanh toán VNPay

- Frontend gọi: `POST /api/orders/{id}/pay/vnpay/create?bankCode=NCB` (optional)
- Backend tạo payment URL với các tham số:
  - `vnp_Version`: 2.1.0
  - `vnp_Command`: pay
  - `vnp_TmnCode`: U2SCOB58
  - `vnp_Amount`: Số tiền × 100 (ví dụ: 1000000 = 10,000 VND)
  - `vnp_CurrCode`: VND
  - `vnp_TxnRef`: Order ID
  - `vnp_OrderInfo`: Mô tả đơn hàng
  - `vnp_OrderType`: other
  - `vnp_Locale`: vn
  - `vnp_ReturnUrl`: Backend URL để nhận callback
  - `vnp_IpAddr`: IP của khách hàng
  - `vnp_CreateDate`: Thời gian tạo (yyyyMMddHHmmss)
  - `vnp_ExpireDate`: Thời gian hết hạn (+15 phút)
  - `vnp_BankCode`: (optional) Mã ngân hàng
  - `vnp_SecureHash`: Checksum (HMAC SHA512)

### Bước 2: Khách hàng thanh toán tại VNPay

- VNPay xử lý thanh toán
- Khách hàng nhập thông tin thẻ/tài khoản

### Bước 3: VNPay gửi kết quả

- **Return URL:** VNPay redirect khách hàng về `GET /api/orders/{id}/pay/vnpay/return`
- **IPN URL:** VNPay gọi `POST /api/orders/pay/vnpay/ipn` (server-to-server)

### Bước 4: Xử lý kết quả

- **Return URL:** Kiểm tra checksum → Redirect về frontend với kết quả
- **IPN URL:** Kiểm tra checksum → Cập nhật database → Trả về JSON

## 🔐 Xử Lý Checksum

### Khi tạo payment URL:

1. Sắp xếp các tham số theo alphabet
2. Tạo hash data: `fieldName=fieldValue&fieldName2=fieldValue2` (URL encode)
3. Tạo query string: `fieldName=fieldValue&fieldName2=fieldValue2` (URL encode)
4. Tính `vnp_SecureHash` = HMAC SHA512(secretKey, hashData)
5. Thêm `vnp_SecureHash` vào query string

### Khi verify checksum (Return URL & IPN):

1. Lấy tất cả parameters (KHÔNG decode)
2. Loại bỏ `vnp_SecureHash` và `vnp_SecureHashType`
3. Sắp xếp theo alphabet
4. Tạo hash data: `fieldName=fieldValue&fieldName2=fieldValue2` (KHÔNG encode)
5. Tính checksum: HMAC SHA512(secretKey, hashData)
6. So sánh với `vnp_SecureHash` từ VNPay

## 📊 Mã Lỗi VNPay

### vnp_TransactionStatus:

- `00`: Giao dịch thành công
- `01`: Giao dịch chưa hoàn tất
- `02`: Giao dịch bị lỗi
- `04`: Giao dịch đảo
- `07`: Giao dịch bị nghi ngờ gian lận

### vnp_ResponseCode:

- `00`: Giao dịch thành công
- `07`: Trừ tiền thành công nhưng bị nghi ngờ
- `09`: Thẻ/Tài khoản chưa đăng ký InternetBanking
- `10`: Xác thực sai quá 3 lần
- `11`: Hết hạn chờ thanh toán
- `12`: Thẻ/Tài khoản bị khóa
- `13`: Sai mật khẩu OTP
- `24`: Khách hàng hủy giao dịch
- `51`: Tài khoản không đủ số dư
- `65`: Vượt hạn mức giao dịch trong ngày
- `75`: Ngân hàng đang bảo trì
- `79`: Sai mật khẩu quá số lần quy định
- `99`: Lỗi khác

### IPN Response Codes:

- `00`: Cập nhật thành công (VNPay kết thúc luồng)
- `02`: Đã cập nhật trước đó (VNPay kết thúc luồng)
- `01`: Không tìm thấy đơn hàng (VNPay retry)
- `04`: Số tiền không hợp lệ (VNPay retry)
- `97`: Checksum không hợp lệ (VNPay retry)
- `99`: Lỗi khác (VNPay retry)

## ⚙️ Cấu Hình IPN URL

**Lưu ý:** IPN URL cần được đăng ký với VNPay. Sau khi cài đặt xong, gửi URL này cho VNPay:

```
https://your-domain.com/api/orders/pay/vnpay/ipn
```

Hoặc nếu chạy local với ngrok:

```
https://your-ngrok-url.ngrok.io/api/orders/pay/vnpay/ipn
```

## 🧪 Test Thanh Toán

### 1. Tạo đơn hàng

```bash
POST /api/orders
Authorization: Bearer {token}
{
  "items": [...],
  "shippingAddress": "...",
  "paymentMethod": "VNPAY"
}
```

### 2. Tạo payment URL

```bash
POST /api/orders/{id}/pay/vnpay/create?bankCode=NCB
Authorization: Bearer {token}
```

### 3. Test với thẻ test

- Sử dụng thẻ test từ VNPay Sandbox
- Hoặc dùng VNPay QR để test

## ✅ Checklist Cài Đặt

- [x] Cấu hình `local.env` với thông tin VNPay
- [x] Endpoint tạo payment URL
- [x] Endpoint Return URL
- [x] Endpoint IPN URL
- [x] Xử lý checksum đúng cách
- [x] Security config cho phép public access payment callbacks
- [ ] Đăng ký IPN URL với VNPay (sau khi deploy)
- [ ] Test thanh toán thành công
- [ ] Test thanh toán thất bại
- [ ] Test IPN callback

## 📚 Tài Liệu Tham Khảo

- [VNPay Integration Guide](https://sandbox.vnpayment.vn/apis/)
- [VNPay Demo Code](https://sandbox.vnpayment.vn/apis/docs/loai-hinh-thanh-toan/)

## 🐛 Troubleshooting

### Lỗi checksum không hợp lệ

- Kiểm tra secret key đúng chưa
- Kiểm tra hash data có encode đúng không
- Kiểm tra thứ tự sắp xếp parameters

### IPN không được gọi

- Kiểm tra IPN URL có public không (cần SSL)
- Kiểm tra firewall/security config
- Kiểm tra đã đăng ký IPN URL với VNPay chưa

### Return URL không redirect đúng

- Kiểm tra CORS config
- Kiểm tra frontend URL trong config
