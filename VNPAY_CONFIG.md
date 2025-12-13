# Cấu hình VNPay Sandbox

Thông tin cấu hình từ email VNPay:

## Thông tin kết nối

### Terminal & Secret Key

- **Terminal ID (vnp_TmnCode):** `U2SCOB58`
- **Secret Key (vnp_HashSecret):** `BFP63DZHASBOT68EACY7QVVDJTZBN6CD`
- **URL thanh toán TEST:** `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`

### Merchant Admin Portal

- **Địa chỉ:** https://sandbox.vnpayment.vn/merchantv2/
- **Tên đăng nhập:** lolmekiep123@gmail.com
- **Mật khẩu:** (Mật khẩu đã đăng ký khi tạo merchant)

### Test Case Portal

- **Địa chỉ:** https://sandbox.vnpayment.vn/vnpaygw-sit-testing/user/login
- **Tên đăng nhập:** lolmekiep123@gmail.com
- **Mật khẩu:** (Mật khẩu đã đăng ký khi tạo merchant)

## URLs cần cấu hình

### 1. Return URL (Browser Redirect)

- **URL:** `http://localhost:8080/api/orders/{id}/pay/vnpay/return`
- **Mục đích:** VNPay redirect về sau khi thanh toán
- **Cách cấu hình:** Backend tự động build URL này

### 2. IPN URL (Server-to-Server Callback)

- **URL:** `http://localhost:8080/api/orders/pay/vnpay/ipn`
- **Mục đích:** VNPay gọi để cập nhật trạng thái thanh toán
- **Cách cấu hình:**
  1. Đăng nhập Merchant Portal
  2. Vào phần **Cấu hình** hoặc **Settings**
  3. Tìm mục **IPN URL** hoặc **Instant Payment Notification URL**
  4. Nhập: `http://localhost:8080/api/orders/pay/vnpay/ipn`
  5. Lưu cấu hình

**Lưu ý:**

- IPN URL phải là backend URL (không phải frontend)
- Nếu deploy production, cần dùng domain thật
- Có thể dùng ngrok để test: `https://your-ngrok-url.ngrok.io/api/orders/pay/vnpay/ipn`

## Test Card

Theo email từ VNPay:

| Thông tin      | Giá trị             |
| -------------- | ------------------- |
| Ngân hàng      | NCB                 |
| Số thẻ         | 9704198526191432198 |
| Tên chủ thẻ    | NGUYEN VAN A        |
| Ngày phát hành | 07/15               |
| Mật khẩu OTP   | 123456              |

## Tài liệu tham khảo

- **Tài liệu tích hợp:** https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
- **Code demo:** https://sandbox.vnpayment.vn/apis/vnpay-demo/code-demo-tích-hợp
- **Demo cổng thanh toán:** https://sandbox.vnpayment.vn/apis/vnpay-demo/

## Liên hệ hỗ trợ

- **Email:** support.vnpayment@vnpay.vn
- **Hotline:** 1900 55 55 77

## Cấu hình trong local.env

File `shop-backend/local.env` đã được cấu hình đúng:

```properties
VNPAY_ENABLED=true
VNPAY_TMN_CODE=U2SCOB58
VNPAY_SECRET_KEY=BFP63DZHASBOT68EACY7QVVDJTZBN6CD
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_VERSION=2.1.0
VNPAY_COMMAND=pay
VNPAY_CURR_CODE=VND
VNPAY_LOCALE=vn
```

## Kiểm tra

1. ✅ Terminal ID đã đúng: `U2SCOB58`
2. ✅ Secret Key đã đúng: `BFP63DZHASBOT68EACY7QVVDJTZBN6CD`
3. ✅ Pay URL đã đúng: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
4. ⚠️ **Cần cấu hình IPN URL trong Merchant Portal**
