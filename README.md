# ShopEase Monorepo

E-commerce demo gồm 2 phần: Spring Boot backend và React frontend. Clone về là chạy được ngay với H2 file DB, không cần cài thêm cơ sở dữ liệu.

## Cấu trúc

- `shop-backend`: Spring Boot 3, JPA, JWT, H2 file DB
- `shop-frontend`: React (Create React App), MUI, Redux Toolkit

## Yêu cầu môi trường

- Java 17+ (đã kèm Maven Wrapper)
- Node.js 16+ và npm

## Cài đặt môi trường

- Windows
  - Cài Java 17+ (JDK). Kiểm tra: `java -version`.
  - Không cần cài Maven: dự án dùng `mvnw.cmd` (Maven Wrapper) đi kèm.
  - Cài Node.js từ nodejs.org. Kiểm tra: `node -v`, `npm -v`.
  - Tuỳ chọn Docker Desktop nếu muốn chạy frontend qua Docker.
- macOS / Linux
  - Cài Java 17+ (OpenJDK). Kiểm tra: `java -version`.
  - Không cần cài Maven: dùng `./mvnw`.
  - Cài Node.js (khuyến nghị qua nvm). Kiểm tra: `node -v`, `npm -v`.
  - Tuỳ chọn Docker nếu dùng container.

## Chạy nhanh (development)

1. Backend

```powershell
cd shop-backend
./mvnw.cmd -DskipTests spring-boot:run
```

- Vì sao: Maven Wrapper (`mvnw.cmd`) đảm bảo mọi máy đều dùng đúng phiên bản Maven kèm dự án, không cần tự cài Maven. `spring-boot:run` chạy app trực tiếp từ mã nguồn, nhanh để dev. `-DskipTests` bỏ chạy test cho tốc độ khi phát triển.

- API gốc: `http://localhost:8080/api`
- DB: H2 file tại `shop-backend/shopdb.mv.db` (tạo tự động khi chạy)

2. Frontend

```powershell
cd shop-frontend
npm install
npm start
```

- Vì sao: `npm install` cài đúng dependencies theo `package.json`. `npm start` (CRA) chạy dev server với hot-reload, kết nối API mặc định `http://localhost:8080/api` từ `src/api/http.ts`.

- Mở `http://localhost:3000`

## Tuỳ chọn chạy backend bằng jar

```powershell
cd shop-backend
./mvnw.cmd -q -DskipTests package
java -jar target/shop-backend-0.0.1-SNAPSHOT.jar
```

- Vì sao: `package` đóng gói thành file jar độc lập, phù hợp chạy production/dev không cần IDE. `-q` giảm log build, `-DskipTests` tăng tốc khi không cần test.

## Biến môi trường

- Backend
  - `APP_JWT_SECRET`: bí mật ký JWT (mặc định giá trị demo)
  - `SPRING_DATASOURCE_URL`: ghi đè datasource (ví dụ Postgres). Mặc định: `jdbc:h2:file:./shopdb`
  - `APP_MAIL_ENABLED`, `APP_MAIL_FROM`, `APP_MAIL_SUBJECT`: bật/tắt email OTP và cấu hình gửi.
  - `APP_SMS_ENABLED`, `APP_SMS_PROVIDER` (`log`/`twilio`), `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`: bật/tắt SMS OTP và thông tin nhà cung cấp.
- Frontend

  - `REACT_APP_API_URL`: URL API khi build/run (mặc định `http://localhost:8080/api`)

- Vì sao: tách biệt cấu hình khỏi mã nguồn, build cho các môi trường khác nhau không cần sửa code.

### Thiết lập nhanh biến môi trường

- Windows (PowerShell)

  - Ví dụ đặt JWT secret: `setx APP_JWT_SECRET "super-secret-123"`
  - Ví dụ chuyển sang Postgres: `setx SPRING_DATASOURCE_URL "jdbc:postgresql://localhost:5432/shopdb?user=shop&password=shop"`
  - Bật email OTP: `setx APP_MAIL_ENABLED true`
  - Bật SMS OTP (Twilio):
    - `setx APP_SMS_ENABLED true`
    - `setx APP_SMS_PROVIDER twilio`
    - `setx TWILIO_ACCOUNT_SID <sid>`
    - `setx TWILIO_AUTH_TOKEN <token>`
    - `setx TWILIO_FROM +1234567890`

- macOS / Linux (bash/zsh)

  - `export APP_JWT_SECRET=super-secret-123`
  - `export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/shopdb?user=shop&password=shop"`
  - `export APP_MAIL_ENABLED=true`
  - `export APP_SMS_ENABLED=true && export APP_SMS_PROVIDER=twilio`
  - `export TWILIO_ACCOUNT_SID=<sid> TWILIO_AUTH_TOKEN=<token> TWILIO_FROM=+1234567890`

- Frontend khi build
  - Windows (cmd/PowerShell): `set REACT_APP_API_URL=http://localhost:8080/api && npm run build`
  - macOS/Linux: `REACT_APP_API_URL=http://localhost:8080/api npm run build`

## Tài khoản mặc định

- Lần đầu chạy sẽ tạo user `admin/admin123` nếu chưa tồn tại. Về sau không reset mật khẩu.

## Kiểm thử

- Frontend: `npm test`
- Backend: `./mvnw.cmd test`

## Docker (frontend)

```bash
cd shop-frontend
docker build -t shop-frontend --build-arg REACT_APP_API_URL=http://localhost:8080/api .
docker run -p 8081:80 shop-frontend
```

- Vì sao: Docker đóng gói frontend thành image chuẩn, chạy ổn định ở mọi máy/CI/CD mà không lo khác biệt môi trường Node. `--build-arg REACT_APP_API_URL` gắn URL API vào build. `-p 8081:80` publish Nginx phục vụ tĩnh, thích hợp demo/deploy.

## Lưu ý thêm

- Backend dùng H2 file DB (`./shopdb`), dữ liệu bền sau restart; muốn dùng Postgres, đặt `SPRING_DATASOURCE_URL` tương ứng.

## Ghi chú

- Nếu gặp lỗi H2 “Feature not supported”, đảm bảo `SPRING_DATASOURCE_URL=jdbc:h2:file:./shopdb` (không thêm `AUTO_SERVER` hay `DB_CLOSE_ON_EXIT`).
- CORS đã mở cho `http://localhost:3000`. Nếu đổi port, cập nhật `app.cors.allowed-origins` trong backend.
