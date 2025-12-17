# 🐛 Debug Checklist - Các Tính Năng Mới

## ✅ Đã Sửa Các Lỗi

### 1. ProductImageGallery

- ✅ **Fixed**: Import `useMemo` và `useEffect` từ React
- ✅ **Fixed**: Logic navigation với edge cases (empty images array)
- ✅ **Fixed**: Reset selectedIndex khi allImages thay đổi

### 2. RecentlyViewed

- ✅ **Fixed**: Thay `fetch` bằng `productApi.getOne()` để consistency
- ✅ **Fixed**: Type safety với Product[]

### 3. WishlistButton

- ✅ **Fixed**: Thêm event listener để sync state khi wishlist thay đổi từ component khác
- ✅ **Fixed**: Cleanup listener khi unmount

### 4. ProductQuickView

- ✅ **Fixed**: Reset state khi đóng modal
- ✅ **Fixed**: Check stock trước khi add to cart
- ✅ **Fixed**: Error handling khi load product fail

---

## 🧪 Test Checklist

### Dark Mode Toggle

- [ ] Click toggle button → Theme chuyển đổi
- [ ] Refresh page → Theme được giữ nguyên (localStorage)
- [ ] Icon thay đổi (Moon ↔ Sun)
- [ ] Animation mượt mà

### Loading Skeletons

- [ ] Hiển thị khi loading products
- [ ] Wave animation hoạt động
- [ ] Responsive trên mobile
- [ ] Disappear khi data load xong

### Wishlist

- [ ] Click heart icon → Thêm vào wishlist
- [ ] Click lại → Xóa khỏi wishlist
- [ ] Badge hiển thị số lượng đúng
- [ ] Sync giữa ProductCard và ProductDetailPage
- [ ] Lưu trong localStorage
- [ ] Persist sau khi refresh

### Quick View

- [ ] Click eye icon → Modal mở
- [ ] Load product data đúng
- [ ] Add to Cart hoạt động
- [ ] View Details navigate đúng
- [ ] Wishlist button trong modal hoạt động
- [ ] Close modal → State reset
- [ ] Responsive trên mobile

### Image Gallery

- [ ] Thumbnail gallery hiển thị
- [ ] Click thumbnail → Main image thay đổi
- [ ] Click main image → Zoom fullscreen
- [ ] Navigation buttons (prev/next) hoạt động
- [ ] Edge case: 1 image → Không hiện navigation
- [ ] Edge case: 0 images → Không crash

### Recently Viewed

- [ ] Xem product → Tự động track
- [ ] Section hiển thị ở HomePage
- [ ] Click product → Navigate đúng
- [ ] Close section → Ẩn đi
- [ ] Max 6 products
- [ ] Lưu trong localStorage

### Toast Notifications

- [ ] Hiển thị khi add to cart
- [ ] Slide animation mượt mà
- [ ] Auto-dismiss sau 4 giây
- [ ] Close button hoạt động
- [ ] Multiple severity levels (success, error, warning, info)
- [ ] Không overlap với nhau

---

## 🔍 Common Issues & Fixes

### Issue 1: Wishlist không sync giữa các components

**Fix**: Đã thêm event listener `wishlist-updated` trong WishlistButton

### Issue 2: ProductImageGallery crash khi không có images

**Fix**: Đã thêm checks cho empty array và edge cases

### Issue 3: RecentlyViewed dùng fetch thay vì http client

**Fix**: Đã thay bằng `productApi.getOne()` để consistency

### Issue 4: ProductQuickView không reset state khi đóng

**Fix**: Đã thêm reset state trong useEffect cleanup

### Issue 5: Navigation buttons trong ImageGallery không hoạt động với 1 image

**Fix**: Đã thêm check `allImages.length > 1` trước khi render buttons

---

## 🚀 Testing Commands

```bash
# Start backend
cd shop-backend
mvn spring-boot:run

# Start frontend
cd shop-frontend
npm start
```

---

## 📝 Notes

- Tất cả components đã được test với TypeScript
- Không có linter errors
- Edge cases đã được handle
- Error handling đã được thêm vào

---

**Status**: ✅ Tất cả lỗi đã được sửa và sẵn sàng test!
