# QR Code Module Fix

## Vấn đề

Lỗi: `Module not found: Error: Can't resolve 'qrcode.react'`

## Giải pháp

### 1. Package đã được cài đặt

- Package `qrcode.react@4.2.0` đã có trong `package.json`
- Build thành công: `npm run build` ✅

### 2. Nếu vẫn gặp lỗi khi chạy dev server:

#### Option 1: Restart Dev Server

```bash
# Dừng dev server (Ctrl+C)
# Sau đó chạy lại:
npm start
```

#### Option 2: Xóa cache và reinstall

```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại dependencies
npm install

# Restart dev server
npm start
```

#### Option 3: Clear cache của webpack

```bash
# Xóa cache
rm -rf node_modules/.cache
rm -rf .cache

# Restart dev server
npm start
```

### 3. Kiểm tra import

Import đúng:

```typescript
import { QRCodeSVG } from "qrcode.react";
```

### 4. Nếu vẫn không được

Thử dùng default import:

```typescript
import QRCode from "qrcode.react";

// Sử dụng:
<QRCode value={payUrl} renderAs="svg" size={256} level="H" />;
```

## Status

✅ Package installed: `qrcode.react@4.2.0`
✅ Build successful
✅ Type definitions available
✅ Exports correct: `QRCodeSVG` và `QRCodeCanvas`
