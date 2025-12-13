# MoMo Payment Fix - Theo Đặc Tả GitHub

## Đã sửa theo đặc tả từ GitHub

### 1. Raw Signature Format

Theo [GitHub MoMo CollectionLink.js](https://github.com/momo-wallet/payment/blob/master/nodejs/CollectionLink.js):

**Format**: `accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType`

**Lưu ý**:

- Thứ tự các field phải đúng như trên
- Không có URL encoding trong raw signature
- Sử dụng HMAC SHA256 với secretKey

### 2. Request Body Format

Theo GitHub example, request body **KHÔNG có** `accessKey`:

```json
{
  "partnerCode": "...",
  "partnerName": "...",
  "storeId": "...",
  "requestId": "...",
  "amount": "...",
  "orderId": "...",
  "orderInfo": "...",
  "redirectUrl": "...",
  "ipnUrl": "...",
  "lang": "vi",
  "requestType": "payWithMethod",
  "autoCapture": true,
  "extraData": "",
  "signature": "..."
}
```

### 3. IPN Callback Verification

Khi MoMo gửi callback về, signature được tạo từ:

```
accessKey=$accessKey&amount=$amount&extraData=$extraData&message=$message&orderId=$orderId&orderInfo=$orderInfo&orderType=$orderType&partnerCode=$partnerCode&payType=$payType&requestId=$requestId&responseTime=$responseTime&resultCode=$resultCode&transId=$transId
```

**Lưu ý**: Callback có thêm các field: `message`, `orderType`, `payType`, `responseTime`, `resultCode`, `transId`

### 4. Code đã sửa

#### File: `OrderController.java` - `momoCreate()`

- ✅ Sửa raw signature format theo đúng thứ tự GitHub
- ✅ Loại bỏ `accessKey` khỏi request body
- ✅ Thêm log để debug
- ✅ IPN URL: `/api/orders/pay/momo/ipn`

#### File: `OrderController.java` - `momoIpn()`

- ✅ Đổi endpoint từ `/pay/momo/callback` thành `/pay/momo/ipn`
- ✅ Sửa signature verification theo đúng format callback
- ✅ Thêm log chi tiết
- ✅ Return đúng format response cho MoMo

#### File: `SecurityConfig.java`

- ✅ Thêm `/api/pay/momo/ipn` vào permitAll

## Kiểm tra lại

### 1. Xác nhận Config trong `local.env`:

```
MOMO_ENABLED=true
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_PARTNER_CODE=...
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...
MOMO_REQUEST_TYPE=payWithMethod
MOMO_PARTNER_NAME=Test
MOMO_STORE_ID=MomoTestStore
MOMO_LANG=vi
MOMO_AUTO_CAPTURE=true
```

### 2. Restart Backend

**QUAN TRỌNG**: Sau khi sửa code, **PHẢI RESTART BACKEND**:

```bash
# Dừng backend (Ctrl+C)
cd shop-backend
mvn spring-boot:run
```

### 3. Kiểm tra Log

Khi tạo payment request, backend sẽ log:

```
=== MoMo Payment Request ===
  Order ID: ...
  Amount: ...
  Partner Code: ...
  Access Key (first 10): ...
  Raw Signature: accessKey=...&amount=...&extraData=...&...
  Signature: abc123...
```

Khi nhận IPN callback, backend sẽ log:

```
=== MoMo IPN Callback ===
  Order ID: ...
  Result Code: ...
  Transaction ID: ...
  Raw Signature: accessKey=...&amount=...&...
  Received Signature: ...
  Calculated Signature: ...
```

### 4. Verify Request Body

Request body gửi đến MoMo phải:

- ✅ Có đầy đủ các field: partnerCode, partnerName, storeId, requestId, amount, orderId, orderInfo, redirectUrl, ipnUrl, lang, requestType, autoCapture, extraData, signature
- ✅ **KHÔNG có** `accessKey` trong body
- ✅ Signature được tạo từ raw signature với HMAC SHA256

### 5. Verify IPN Response

Khi MoMo gửi IPN callback:

- ✅ Verify signature đúng
- ✅ Check `resultCode = "0"` (success)
- ✅ Update order status
- ✅ Return `{"resultCode": "0", "message": "Success"}`

## Lỗi thường gặp

### Lỗi signature không đúng

- **Nguyên nhân**: Raw signature format không đúng hoặc secret key sai
- **Giải pháp**:
  - Kiểm tra raw signature có đúng thứ tự không
  - Kiểm tra secret key trong `local.env`
  - Xem log để verify raw signature và calculated signature

### Payment URL không tạo được

- Kiểm tra log backend
- Kiểm tra order status = PENDING
- Kiểm tra MoMo config có đầy đủ không

### IPN callback không nhận được

- Kiểm tra IPN URL có đúng không: `http://your-domain/api/orders/pay/momo/ipn`
- Kiểm tra SecurityConfig có permit endpoint không
- Kiểm tra firewall/network có block không

## Tài liệu tham khảo

- MoMo GitHub: https://github.com/momo-wallet/payment/blob/master/nodejs/CollectionLink.js
- MoMo Developer Docs: https://developers.momo.vn/
