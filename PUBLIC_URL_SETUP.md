# ShopEase - Public URL Setup Guide

Hướng dẫn expose ShopEase app ra public URL để có thể truy cập từ bất kỳ đâu.

## Cách 1: Sử dụng ngrok (Khuyến nghị)

### Cài đặt ngrok

**Windows:**

1. Tải ngrok từ: https://ngrok.com/download
2. Giải nén `ngrok.exe` vào một thư mục trong PATH
3. Hoặc dùng Chocolatey: `choco install ngrok`

**macOS:**

```bash
brew install ngrok/ngrok/ngrok
```

**Linux:**

1. Tải từ: https://ngrok.com/download
2. Giải nén và thêm vào PATH

### Đăng ký tài khoản ngrok (Miễn phí)

1. Truy cập: https://dashboard.ngrok.com/signup
2. Đăng ký tài khoản miễn phí
3. Lấy authtoken từ dashboard
4. Chạy lệnh: `ngrok config add-authtoken YOUR_TOKEN`

### Sử dụng

1. **Khởi động app:**

   ```bash
   cd shop-frontend
   npm start
   ```

2. **Expose public URL (Terminal mới):**

   ```powershell
   # Windows PowerShell
   .\expose-public.ps1 -Tool ngrok -Port 3000

   # Hoặc chạy trực tiếp
   ngrok http 3000
   ```

3. **Copy public URL:**
   - ngrok sẽ hiển thị URL dạng: `https://xxxx-xx-xxx-xxx-xx.ngrok-free.app`
   - URL này có thể truy cập từ bất kỳ đâu

## Cách 2: Sử dụng localtunnel (Không cần đăng ký)

### Cài đặt

Không cần cài đặt, script sẽ tự động dùng `npx` (có sẵn với Node.js)

### Sử dụng

1. **Khởi động app:**

   ```bash
   cd shop-frontend
   npm start
   ```

2. **Expose public URL (Terminal mới):**

   ```powershell
   # Windows PowerShell
   .\expose-public.ps1 -Tool localtunnel -Port 3000

   # Hoặc chạy trực tiếp
   npx --yes localtunnel --port 3000
   ```

3. **Copy public URL:**
   - localtunnel sẽ hiển thị URL dạng: `https://xxxx.loca.lt`
   - URL này có thể truy cập từ bất kỳ đâu

## Cấu hình Backend cho Public URL

Khi có public URL, bạn cần cập nhật backend để chấp nhận requests từ URL đó:

### 1. Cập nhật CORS trong `application.properties`:

```properties
app.cors.allowed-origins=http://localhost:3000,https://your-ngrok-url.ngrok-free.app,https://your-localtunnel-url.loca.lt
```

### 2. Cập nhật VNPay ReturnUrl (nếu dùng VNPay):

Trong VNPay merchant portal, thêm ReturnUrl:

```
https://your-ngrok-url.ngrok-free.app/api/orders/*/pay/vnpay/return
```

### 3. Cập nhật MoMo RedirectUrl (nếu dùng MoMo):

Khi tạo payment, sử dụng public URL:

```
https://your-ngrok-url.ngrok-free.app/order-success?id={orderId}
```

## Lưu ý

1. **ngrok Free Plan:**

   - URL thay đổi mỗi lần restart (trừ khi dùng ngrok account)
   - Có giới hạn số lượng requests
   - Có thể upgrade lên paid plan để có static domain

2. **localtunnel:**

   - URL có thể thay đổi
   - Miễn phí, không cần đăng ký
   - Có thể chậm hơn ngrok

3. **Bảo mật:**
   - Public URL có thể truy cập bởi bất kỳ ai
   - Chỉ dùng cho development/testing
   - Không dùng cho production

## Troubleshooting

### Lỗi "Port already in use"

- Kiểm tra xem có process nào đang dùng port 3000 không
- Đổi port: `npm start -- --port 3001`
- Hoặc kill process: `netstat -ano | findstr :3000` (Windows)

### Lỗi "ngrok: command not found"

- Đảm bảo ngrok đã được thêm vào PATH
- Hoặc dùng đường dẫn đầy đủ: `C:\path\to\ngrok.exe http 3000`

### Lỗi "localtunnel: subdomain already taken"

- Script sẽ tự động tạo subdomain random
- Hoặc chỉ định subdomain khác: `npx localtunnel --port 3000 --subdomain your-subdomain`

## Production Deployment

Để deploy production, nên dùng:

- **Vercel** (Frontend): https://vercel.com
- **Netlify** (Frontend): https://netlify.com
- **Railway** (Full stack): https://railway.app
- **Render** (Full stack): https://render.com
- **AWS/GCP/Azure** (Enterprise)
