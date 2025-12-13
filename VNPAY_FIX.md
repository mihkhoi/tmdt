# Hướng dẫn sửa lỗi VNPay Code 72

## Vấn đề

Lỗi code 72 từ VNPay: "Không tìm thấy website" có thể xảy ra khi:

1. **TMN Code không tồn tại hoặc không đúng** (nguyên nhân phổ biến nhất)
2. ReturnUrl không hợp lệ hoặc không được whitelist trong VNPay merchant account
3. ReturnUrl là frontend URL thay vì backend URL
4. Secret Key không đúng
5. Terminal (TMN Code) chưa được kích hoạt trong VNPay merchant portal

## Giải pháp đã áp dụng

### 1. Backend tự động build ReturnUrl

- Backend sẽ tự động tạo ReturnUrl: `http://localhost:8080/api/orders/{id}/pay/vnpay/return`
- VNPay sẽ callback về URL này
- Backend xử lý callback và redirect về frontend

### 2. Cấu hình VNPay Sandbox

Đảm bảo trong VNPay merchant portal (sandbox):

- ReturnUrl phải được whitelist: `http://localhost:8080/api/orders/*/pay/vnpay/return`
- Hoặc có thể dùng pattern: `http://localhost:8080/api/orders/*`

### 3. Kiểm tra local.env

File `shop-backend/local.env` cần có:

```
VNPAY_ENABLED=true
VNPAY_TMN_CODE=U2SCOB58
VNPAY_SECRET_KEY=BFP63DZHASBOT68EACY7QVVDJTZBN6CD
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### 4. Kiểm tra TMN Code (Quan trọng!)

**Lỗi code 72 thường do TMN Code không đúng hoặc không tồn tại:**

1. Đăng nhập vào VNPay Sandbox Portal: https://sandbox.vnpayment.vn
2. Vào phần **Quản lý merchant** hoặc **Cấu hình**
3. Kiểm tra TMN Code của bạn có đúng không
4. Đảm bảo terminal đã được **kích hoạt** và **approved**
5. Nếu TMN Code khác, cập nhật trong `local.env`:
   ```
   VNPAY_TMN_CODE=<TMN_CODE_MỚI>
   ```

### 5. Nếu vẫn lỗi

1. Kiểm tra VNPay merchant portal:

   - Đăng nhập vào https://sandbox.vnpayment.vn
   - Vào phần cấu hình merchant
   - Thêm ReturnUrl: `http://localhost:8080/api/orders/*/pay/vnpay/return`
   - Hoặc pattern: `http://localhost:8080/api/orders/*`

2. Kiểm tra logs backend:

   - Xem console output khi tạo payment URL
   - Kiểm tra ReturnUrl có đúng format không
   - Kiểm tra TMN Code có được log ra không

3. Test với ngrok (nếu cần):
   - Nếu VNPay không chấp nhận localhost, dùng ngrok để expose backend
   - Cập nhật ReturnUrl trong code để dùng ngrok URL

## IPN (Instant Payment Notification) URL

VNPay yêu cầu cấu hình IPN URL để nhận thông báo server-to-server về trạng thái thanh toán.

**IPN URL:** `http://localhost:8080/api/orders/pay/vnpay/ipn`

**Cách cấu hình:**

1. Đăng nhập vào VNPay Merchant Portal: https://sandbox.vnpayment.vn/merchantv2/
2. Vào phần **Cấu hình** hoặc **Settings**
3. Tìm mục **IPN URL** hoặc **Instant Payment Notification URL**
4. Nhập: `http://localhost:8080/api/orders/pay/vnpay/ipn`
5. Lưu cấu hình

**Lưu ý:**

- IPN URL phải là backend URL (không phải frontend)
- Nếu deploy production, cần dùng domain thật (không phải localhost)
- Có thể dùng ngrok để test IPN nếu cần: `https://your-ngrok-url.ngrok.io/api/orders/pay/vnpay/ipn`

## Testing

1. Tạo đơn hàng
2. Chọn VNPay payment
3. Chọn ngân hàng (hoặc để trống)
4. Click "Thanh toán ngay"
5. Kiểm tra console logs để xem ReturnUrl
6. Sau khi thanh toán, kiểm tra logs IPN để xem VNPay có gọi callback không
7. Nếu vẫn lỗi, kiểm tra VNPay merchant portal

## Test Card

Theo email từ VNPay:

- **Ngân hàng:** NCB
- **Số thẻ:** 9704198526191432198
- **Tên chủ thẻ:** NGUYEN VAN A
- **Ngày phát hành:** 07/15
- **Mật khẩu OTP:** 123456
