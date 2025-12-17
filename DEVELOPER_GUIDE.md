# 👨‍💻 Developer Guide - Hướng Dẫn Phát Triển

## 🏗️ Kiến Trúc Dự Án

### Backend Architecture

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Entity Layer (Database Models)
```

### Frontend Architecture

```
Pages (Route Components)
    ↓
Components (Reusable UI)
    ↓
API Layer (HTTP Clients)
    ↓
Redux Store (State Management)
```

---

## 📂 Cấu Trúc Chi Tiết

### Backend (`shop-backend/src/main/java/com/quanao/shop/shop_backend/`)

#### `config/`

- **SecurityConfig.java**: Spring Security configuration, CORS, JWT
- **AppProperties.java**: Configuration properties mapping

#### `controller/`

- **AuthController.java**: Authentication endpoints
- **ProductController.java**: Product CRUD
- **OrderController.java**: Order management, payment
- **AdminController.java**: Admin operations

#### `entity/`

- **User.java**: User entity với email verification
- **Product.java**: Product entity
- **Order.java**: Order entity
- **OrderItem.java**: Order item entity

#### `service/`

- **AuthService.java**: Authentication logic
- **ProductService.java**: Product business logic
- **OrderService.java**: Order processing, payment

#### `pay/`

- **vnpay/VNPayService.java**: VNPay integration
- **momo/MoMoService.java**: MoMo integration

### Frontend (`shop-frontend/src/`)

#### `components/`

- **MainLayout.tsx**: Main layout với header, footer
- **ProductCard.tsx**: Product card component
- **DarkModeToggle.tsx**: Dark mode toggle
- **WishlistButton.tsx**: Wishlist functionality
- **ProductQuickView.tsx**: Quick view modal
- **ProductImageGallery.tsx**: Image gallery với zoom
- **ProductComparison.tsx**: Comparison table
- **ShareProduct.tsx**: Social sharing
- **ToastNotification.tsx**: Toast notifications
- **LoadingSkeleton.tsx**: Loading states

#### `pages/`

- **HomePage.tsx**: Trang chủ với filters
- **ProductDetailPage.tsx**: Chi tiết sản phẩm
- **CartPage.tsx**: Giỏ hàng
- **CheckoutPage.tsx**: Thanh toán
- **LoginPage.tsx**: Đăng nhập
- **RegisterPage.tsx**: Đăng ký
- **MyOrdersPage.tsx**: Danh sách đơn hàng
- **OrderDetailPage.tsx**: Chi tiết đơn hàng
- **admin/**: Admin pages

#### `store/`

- **store.ts**: Redux store configuration
- **authSlice.ts**: Authentication state
- **cartSlice.ts**: Cart state

#### `api/`

- **http.ts**: Axios instance với interceptors
- **productApi.ts**: Product API client
- **orderApi.ts**: Order API client

#### `utils/`

- **currencyUtils.ts**: Currency formatting
- **productUtils.ts**: Product utilities
- **typography.ts**: Typography utilities

#### `hooks/`

- **useKeyboardShortcuts.ts**: Keyboard shortcuts hook

---

## 🔧 Development Workflow

### 1. Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd shop-ease

# Backend
cd shop-backend
mvn clean install

# Frontend
cd ../shop-frontend
npm install
```

### 2. Development Mode

#### Backend (Hot Reload)

```bash
cd shop-backend
mvn spring-boot:run
```

#### Frontend (Hot Reload)

```bash
cd shop-frontend
npm start
```

### 3. Code Style

#### Backend (Java)

- Follow Java naming conventions
- Use Spring Boot best practices
- Document public methods

#### Frontend (TypeScript)

- Use TypeScript strict mode
- Follow React best practices
- Use functional components với hooks
- Type all props và state

---

## 🧩 Thêm Tính Năng Mới

### Thêm API Endpoint (Backend)

1. **Tạo Entity** (nếu cần):

```java
@Entity
public class NewEntity {
    @Id
    @GeneratedValue
    private Long id;
    // ... fields
}
```

2. **Tạo Repository**:

```java
public interface NewRepository extends JpaRepository<NewEntity, Long> {
    // Custom queries
}
```

3. **Tạo Service**:

```java
@Service
public class NewService {
    @Autowired
    private NewRepository repository;

    public List<NewEntity> findAll() {
        return repository.findAll();
    }
}
```

4. **Tạo Controller**:

```java
@RestController
@RequestMapping("/api/new")
public class NewController {
    @Autowired
    private NewService service;

    @GetMapping
    public ResponseEntity<List<NewEntity>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
```

### Thêm Component (Frontend)

1. **Tạo Component**:

```typescript
// src/components/NewComponent.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

interface NewComponentProps {
  title: string;
}

const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};

export default NewComponent;
```

2. **Tích hợp vào Page**:

```typescript
import NewComponent from "../components/NewComponent";

// In component
<NewComponent title="Hello" />;
```

---

## 🔐 Authentication Flow

### JWT Authentication

1. **Login**: `POST /api/auth/login`

   - Returns JWT token
   - Token stored in localStorage

2. **Protected Routes**:

   - Frontend: `ProtectedRoute` component
   - Backend: `@PreAuthorize` annotation

3. **Token Refresh**:
   - Token expires after 24 hours
   - User needs to login again

---

## 💳 Payment Integration

### VNPay Flow

1. **Create Payment**:

   ```
   POST /api/orders/{id}/pay/vnpay/create
   → Returns payment URL
   ```

2. **Redirect User**:

   - User redirected to VNPay
   - User completes payment

3. **Return Callback**:

   ```
   GET /api/orders/{id}/pay/vnpay/return
   → VNPay redirects back
   ```

4. **IPN Callback**:
   ```
   POST /api/orders/pay/vnpay/ipn
   → VNPay sends notification
   ```

### MoMo Flow

Similar to VNPay but uses MoMo API.

---

## 🎨 Styling Guidelines

### Material-UI Theme

- Use theme colors: `theme.palette.primary.main`
- Use theme spacing: `theme.spacing(2)`
- Use theme breakpoints: `theme.breakpoints.down('md')`

### Custom Styles

```typescript
sx={{
  // Use sx prop for styling
  color: theme.palette.primary.main,
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}}
```

### Typography

- Use theme typography variants
- Follow typography scale
- Use Inter font family

---

## 🧪 Testing

### Backend Testing

```java
@SpringBootTest
class ProductServiceTest {
    @Autowired
    private ProductService service;

    @Test
    void testFindAll() {
        List<Product> products = service.findAll();
        assertNotNull(products);
    }
}
```

### Frontend Testing

```typescript
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";

test("renders product name", () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText("Product Name")).toBeInTheDocument();
});
```

---

## 🐛 Debugging

### Backend Debugging

1. **Enable Debug Logging**:

```properties
logging.level.com.quanao.shop=DEBUG
```

2. **Check Logs**:

- Console output
- Log files

### Frontend Debugging

1. **React DevTools**: Install browser extension
2. **Redux DevTools**: Install browser extension
3. **Console Logs**: Use `console.log()`, `console.error()`

### Common Issues

#### CORS Errors

- Check `app.cors.allowed-origins` in `application.properties`
- Ensure frontend URL matches

#### JWT Errors

- Check token expiration
- Verify secret key

#### Payment Errors

- Check payment gateway credentials
- Verify return URLs

---

## 📦 Build & Deploy

### Backend Build

```bash
mvn clean package
# Output: target/shop-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Build

```bash
npm run build
# Output: build/ directory
```

### Production Checklist

- [ ] Update environment variables
- [ ] Set production database
- [ ] Configure payment gateways
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups

---

## 🔄 Git Workflow

### Branch Strategy

- `master`: Production code
- `develop`: Development code
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

### Commit Messages

```
feat: Add product comparison feature
fix: Fix payment callback issue
docs: Update README
style: Improve typography
refactor: Refactor order service
test: Add unit tests
```

---

## 📚 Resources

### Documentation

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [Material-UI Docs](https://mui.com)

### Tools

- [Postman](https://www.postman.com) - API testing
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Write tests
5. Submit pull request

---

**Happy Coding! 🚀**
