import React from "react";

type Lang = "vi" | "en";

const translations: Record<Lang, Record<string, string>> = {
  vi: {
    brandName: "ShopEase",
    searchPlaceholder: "Tìm sản phẩm...",
    register: "Đăng ký",
    login: "Đăng nhập",
    dashboard: "Bảng điều khiển",
    myAccount: "Tài Khoản Của Tôi",
    orders: "Đơn Mua",
    notifications: "Thông Báo",
    logout: "Đăng Xuất",
    tagline: "Mua sắm dễ dàng, giao hàng nhanh chóng, hỗ trợ tận tâm.",
    support: "Hỗ trợ khách hàng",
    helpCenter: "Trung tâm trợ giúp",
    returns: "Chính sách đổi trả",
    shipping: "Vận chuyển",
    about: "Giới thiệu",
    careers: "Tuyển dụng",
    followUs: "Theo dõi chúng tôi",
    hotline: "Hotline",
<<<<<<< HEAD
    deliverTo: "Giao đến",
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

    "sidebar.categories": "Danh mục",
    "sidebar.hot": "NỔI BẬT",
    "products.title": "Danh sách sản phẩm",
    "suggestions.title": "Gợi ý gần giống",
    "error.productsLoadFailed": "Không tải được danh sách sản phẩm.",

    "filter.title": "Tìm kiếm",
    "filter.minPrice": "Giá từ",
    "filter.maxPrice": "Giá đến",
    "filter.sort": "Sắp xếp",
    "filter.brands": "Thương hiệu",
    "filter.priceRange": "Khoảng giá",
    "filter.inStock": "Còn hàng",
    "filter.ratingMin": "Đánh giá từ",
    "filter.newOnly": "Chỉ sản phẩm mới (30 ngày)",
    "filter.apply": "Áp dụng",

    "sort.default": "Mặc định",
    "sort.priceAsc": "Giá tăng dần",
    "sort.priceDesc": "Giá giảm dần",
    "sort.ratingDesc": "Đánh giá cao",
    "sort.ratingAsc": "Đánh giá thấp",

    "chip.authentic": "100% hàng thật",
    "chip.freeship": "Freeship mỗi đơn",
    "chip.refund": "Hoàn 200% nếu hàng giả",
    "chip.returns30": "30 ngày đổi trả",
    "chip.delivery2h": "Giao nhanh 2h",
    "chip.superCheap": "Giá siêu rẻ",
    "chip.new": "Mới",
    "chip.freeshipDomestic": "Freeship nội địa",
    "chip.deliveryFast": "Giao nhanh",
    "chip.goodPrice": "Giá tốt",
    "chip.nationwide": "Giao hàng toàn quốc",
    "product.brandLabel": "Thương hiệu",
    "product.deliveryPrefix": "Giao",
    "home.hero.title": "Siêu ưu đãi cuối năm",
    "home.hero.subtitle": "Giảm đến 50% cho thời trang hot",
    "home.hero.cta": "Xem ưu đãi",
    "home.featured.title": "Ưu đãi nổi bật",

    "category.ao-nam": "Áo Nam",
    "category.ao-nu": "Áo Nữ",
    "category.ao-thun": "Áo thun",
    "category.ao-so-mi": "Áo sơ mi",
    "category.hoodie": "Hoodie",
    "category.ao-khoac": "Áo khoác",
    "category.quan-jean": "Quần jean",
    "category.quan-tay": "Quần tây",
    "category.quan-short": "Quần short",
    "category.vay-dam": "Váy đầm",
    "category.do-the-thao": "Đồ thể thao",
    "category.do-ngu": "Đồ ngủ",
    "category.do-lot": "Đồ lót",
    "category.phu-kien": "Phụ kiện",
    "category.giay-dep": "Giày dép",

    "hot.hang-moi": "Hàng mới về",
    "hot.giam-gia-sau": "Giảm giá sâu",
    "hot.bestseller": "Bán chạy",

    "checkout.title": "Thanh toán",
    "checkout.shipping.title": "Chọn hình thức giao hàng",
    "checkout.shipping.saver": "Giao tiết kiệm",
    "checkout.shipping.fast": "Giao nhanh",
    "checkout.voucher.title": "Thêm mã khuyến mãi của Shop",
    "checkout.voucher.placeholder": "Nhập mã voucher",
    "checkout.payment.title": "Chọn hình thức thanh toán",
    "checkout.payment.cod": "Thanh toán khi nhận hàng (COD)",
    "checkout.payment.vnpay": "VNPAY",
    "checkout.payment.momo": "Ví MoMo",
    "checkout.payment.section.vnpay": "Thanh toán qua VNPAY",
    "checkout.payment.section.momo": "Thanh toán qua MoMo",
    "checkout.payment.section.simulated":
      "Hiện tại giả lập: tạo đơn với phương thức đã chọn.",
    "checkout.promos.title": "Khuyến Mãi",
    "checkout.promos.apply": "Áp dụng",
    "checkout.promos.remove": "Bỏ áp dụng",
    "checkout.summary.title": "Đơn hàng",
    "checkout.summary.itemsTotal": "Tổng tiền hàng",
    "checkout.summary.shippingFee": "Phí vận chuyển",
    "checkout.summary.shippingDiscount": "Giảm giá vận chuyển",
    "checkout.summary.promoDiscount": "Khuyến mãi",
    "checkout.summary.totalPayable": "Tổng tiền thanh toán",
    "checkout.placeOrder": "Đặt hàng",
    "checkout.processing": "Đang xử lý...",
    "checkout.change": "Thay đổi",
    "checkout.shipTo": "Giao tới",
    "checkout.noAddress": "Chưa có địa chỉ",
    "checkout.saveCurrentAddress": "Lưu địa chỉ giao hàng hiện tại",
    "checkout.success": "Đặt hàng thành công",
    "checkout.viewOrders": "Xem Đơn Mua",
    "checkout.viewOrderDetail": "Xem chi tiết đơn",
    "checkout.error.address": "Vui lòng nhập địa chỉ giao hàng",
    "checkout.error.failed": "Đặt hàng thất bại, vui lòng thử lại.",
    "orderSuccess.payNow": "Xác nhận thanh toán (giả lập)",
<<<<<<< HEAD

    "banner.freeship.title": "Freeship đơn từ 100K",
    "banner.freeship.subtitle": "Áp dụng cho tất cả sản phẩm, không giới hạn",
    "banner.freeship.cta": "Mua ngay",
    "banner.newArrivals.title": "Hàng mới về mỗi ngày",
    "banner.newArrivals.subtitle": "Cập nhật sản phẩm mới nhất, hot nhất",
    "banner.newArrivals.cta": "Xem ngay",

    "flashSale.title": "Flash Sale",
    "flashSale.subtitle": "Giảm giá sốc - Kết thúc sau",
    "flashSale.hours": "Giờ",
    "flashSale.minutes": "Phút",
    "flashSale.seconds": "Giây",
    "flashSale.viewAll": "Xem tất cả",

    "section.viewAll": "Xem tất cả",
    "section.featured.title": "Sản phẩm nổi bật",
    "section.featured.subtitle": "Những sản phẩm được yêu thích nhất",
    "section.newArrivals.title": "Hàng mới về",
    "section.newArrivals.subtitle": "Sản phẩm mới nhất, hot nhất",
    "section.bestseller.title": "Bán chạy",
    "section.bestseller.subtitle": "Sản phẩm được mua nhiều nhất",

    "footer.aboutUs": "Về ShopEase",
    "footer.cooperation": "Hợp tác và liên kết",
    "footer.paymentMethods": "Phương thức thanh toán",
    "footer.deliveryServices": "Dịch vụ giao hàng",
    "footer.orderGuide": "Hướng dẫn đặt hàng",
    "footer.shippingMethods": "Phương thức vận chuyển",
    "footer.privacyPolicy": "Chính sách bảo mật",
    "footer.termsOfUse": "Điều khoản sử dụng",
    "footer.aboutShopEaseXu": "Giới thiệu ShopEase Xu",
    "footer.operationRules": "Quy chế hoạt động",
    "footer.sellWithUs": "Bán hàng cùng ShopEase",
    "footer.affiliateMarketing": "Tiếp thị liên kết",
    "footer.saverShipping": "Giao tiết kiệm",
    "footer.fastShipping": "Giao nhanh 2h",
    "footer.hotlineFull": "1900-6035 (1000 đ/phút, 8-21h kể cả T7, CN)",
    "footer.email": "Email",
    "footer.emailValue": "support@shopease.local",
    "footer.securityReport": "Báo lỗi bảo mật",
    "footer.securityEmail": "security@shopease.local",
    "footer.copyright": "© {year} ShopEase. All rights reserved.",
    "footer.vietnamese": "Tiếng Việt",
    "footer.english": "English",

    "location.hoChiMinh": "Hồ Chí Minh",
    "location.haNoi": "Hà Nội",
    "location.daNang": "Đà Nẵng",
    "location.canTho": "Cần Thơ",
    "location.haiPhong": "Hải Phòng",

    "payment.vnpay.title": "Thanh toán VNPay",
    "payment.vnpay.selectBank": "Chọn ngân hàng",
    "payment.vnpay.allBanks": "Tất cả ngân hàng",
    "payment.vnpay.redirecting": "Đang chuyển hướng đến cổng thanh toán...",
    "payment.vnpay.info":
      "Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để hoàn tất thanh toán. Sau khi thanh toán thành công, bạn sẽ được chuyển về trang đơn hàng.",
    "payment.momo.title": "Thanh toán MoMo",
    "payment.momo.creating": "Đang tạo liên kết thanh toán...",
    "payment.momo.redirecting": "Đang chuyển hướng đến MoMo...",
    "payment.momo.scanQR":
      "Quét mã QR hoặc nhấn nút bên dưới để thanh toán bằng ví MoMo",
    "payment.momo.info":
      "Bạn sẽ được chuyển hướng đến ứng dụng/website MoMo để hoàn tất thanh toán. Đảm bảo bạn có đủ số dư trong ví MoMo.",
    "payment.momo.open": "Mở MoMo",
    "payment.momo.create": "Tạo thanh toán",
    "payment.status.checking": "Đang kiểm tra thanh toán...",
    "payment.status.success": "Thanh toán thành công!",
    "payment.status.failed": "Thanh toán thất bại",
    "payment.status.redirecting": "Đang chuyển đến trang đơn hàng...",
    "payment.status.pleaseComplete":
      "Vui lòng hoàn tất thanh toán trên {method}. Chúng tôi sẽ tự động phát hiện khi thanh toán thành công.",
    "payment.status.tryAgain":
      "Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.",
    "payment.status.viewOrder": "Xem đơn hàng",
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
  },
  en: {
    brandName: "ShopEase",
    searchPlaceholder: "Search products...",
    register: "Register",
    login: "Login",
    dashboard: "Admin",
    myAccount: "My Account",
    orders: "Orders",
    notifications: "Notifications",
    logout: "Logout",
    tagline: "Shop with ease, fast delivery, caring support.",
    support: "Customer Support",
    helpCenter: "Help Center",
    returns: "Return Policy",
    shipping: "Shipping",
    about: "About",
    careers: "Careers",
    followUs: "Follow us",
    hotline: "Hotline",
<<<<<<< HEAD
    deliverTo: "Deliver to",
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

    "sidebar.categories": "Categories",
    "sidebar.hot": "HOT",
    "products.title": "Products",
    "suggestions.title": "Similar suggestions",
    "error.productsLoadFailed": "Failed to load products.",

    "filter.title": "Search",
    "filter.minPrice": "Min price",
    "filter.maxPrice": "Max price",
    "filter.sort": "Sort",
    "filter.brands": "Brands",
    "filter.priceRange": "Price range",
    "filter.inStock": "In stock",
    "filter.ratingMin": "Min rating",
    "filter.newOnly": "Only new products (30 days)",
    "filter.apply": "Apply",

    "sort.default": "Default",
    "sort.priceAsc": "Price ascending",
    "sort.priceDesc": "Price descending",
    "sort.ratingDesc": "Rating high",
    "sort.ratingAsc": "Rating low",

    "chip.authentic": "100% authentic",
    "chip.freeship": "Free shipping per order",
    "chip.refund": "200% refund if counterfeit",
    "chip.returns30": "30-day returns",
    "chip.delivery2h": "2-hour delivery",
    "chip.superCheap": "Super low price",
    "chip.new": "New",
    "chip.freeshipDomestic": "Domestic free shipping",
    "chip.deliveryFast": "Fast delivery",
    "chip.goodPrice": "Great price",
    "chip.nationwide": "Nationwide delivery",
    "product.brandLabel": "Brand",
    "product.deliveryPrefix": "Deliver by",
    "home.hero.title": "Year-end mega deals",
    "home.hero.subtitle": "Up to 50% off hot fashion",
    "home.hero.cta": "View deals",
    "home.featured.title": "Featured promotions",

    "category.ao-nam": "Men",
    "category.ao-nu": "Women",
    "category.ao-thun": "T-Shirts",
    "category.ao-so-mi": "Shirts",
    "category.hoodie": "Hoodies",
    "category.ao-khoac": "Jackets",
    "category.quan-jean": "Jeans",
    "category.quan-tay": "Trousers",
    "category.quan-short": "Shorts",
    "category.vay-dam": "Dresses",
    "category.do-the-thao": "Sportswear",
    "category.do-ngu": "Sleepwear",
    "category.do-lot": "Underwear",
    "category.phu-kien": "Accessories",
    "category.giay-dep": "Shoes",

    "hot.hang-moi": "New arrivals",
    "hot.giam-gia-sau": "Deep discounts",
    "hot.bestseller": "Best sellers",

    "checkout.title": "Checkout",
    "checkout.shipping.title": "Choose shipping method",
    "checkout.shipping.saver": "Saver shipping",
    "checkout.shipping.fast": "Fast shipping",
    "checkout.voucher.title": "Add shop voucher",
    "checkout.voucher.placeholder": "Enter voucher code",
    "checkout.payment.title": "Choose payment method",
    "checkout.payment.cod": "Cash on delivery (COD)",
    "checkout.payment.vnpay": "VNPAY",
    "checkout.payment.momo": "MoMo Wallet",
    "checkout.payment.section.vnpay": "Pay with VNPAY",
    "checkout.payment.section.momo": "Pay with MoMo",
    "checkout.payment.section.simulated":
      "Currently simulated: create order with selected method.",
    "checkout.promos.title": "Promotions",
    "checkout.promos.apply": "Apply",
    "checkout.promos.remove": "Remove",
    "notifications.title": "Notifications",
    "notifications.all": "All",
    "notifications.unread": "Unread",
    "notifications.markAllRead": "Mark all as read",
    "checkout.summary.title": "Order",
    "checkout.summary.itemsTotal": "Items total",
    "checkout.summary.shippingFee": "Shipping fee",
    "checkout.summary.shippingDiscount": "Shipping discount",
    "checkout.summary.promoDiscount": "Promotion",
    "checkout.summary.totalPayable": "Total payable",
    "checkout.placeOrder": "Place order",
    "checkout.processing": "Processing...",
    "checkout.change": "Change",
    "checkout.shipTo": "Ship to",
    "checkout.noAddress": "No address",
    "checkout.saveCurrentAddress": "Save current shipping address",
    "checkout.success": "Order placed successfully",
    "checkout.viewOrders": "View Orders",
    "checkout.viewOrderDetail": "View order detail",
    "checkout.error.address": "Please enter a shipping address",
    "checkout.error.failed": "Checkout failed, please try again.",
    "orderSuccess.payNow": "Confirm payment (simulate)",
<<<<<<< HEAD

    "banner.freeship.title": "Free shipping for orders from 100K",
    "banner.freeship.subtitle": "Apply to all products, no limit",
    "banner.freeship.cta": "Shop now",
    "banner.newArrivals.title": "New arrivals every day",
    "banner.newArrivals.subtitle": "Latest and hottest products",
    "banner.newArrivals.cta": "View now",

    "flashSale.title": "Flash Sale",
    "flashSale.subtitle": "Shocking discounts - Ends in",
    "flashSale.hours": "Hours",
    "flashSale.minutes": "Minutes",
    "flashSale.seconds": "Seconds",
    "flashSale.viewAll": "View all",

    "section.viewAll": "View all",
    "section.featured.title": "Featured Products",
    "section.featured.subtitle": "Most loved products",
    "section.newArrivals.title": "New Arrivals",
    "section.newArrivals.subtitle": "Latest and hottest products",
    "section.bestseller.title": "Best Sellers",
    "section.bestseller.subtitle": "Most purchased products",

    "footer.aboutUs": "About ShopEase",
    "footer.cooperation": "Cooperation & Links",
    "footer.paymentMethods": "Payment Methods",
    "footer.deliveryServices": "Delivery Services",
    "footer.orderGuide": "Order Guide",
    "footer.shippingMethods": "Shipping Methods",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfUse": "Terms of Use",
    "footer.aboutShopEaseXu": "About ShopEase Points",
    "footer.operationRules": "Operation Rules",
    "footer.sellWithUs": "Sell with ShopEase",
    "footer.affiliateMarketing": "Affiliate Marketing",
    "footer.saverShipping": "Saver Shipping",
    "footer.fastShipping": "2-Hour Fast Delivery",
    "footer.hotlineFull": "1900-6035 (1000 VND/min, 8-21h including Sat, Sun)",
    "footer.email": "Email",
    "footer.emailValue": "support@shopease.local",
    "footer.securityReport": "Security Report",
    "footer.securityEmail": "security@shopease.local",
    "footer.copyright": "© {year} ShopEase. All rights reserved.",
    "footer.vietnamese": "Vietnamese",
    "footer.english": "English",

    "location.hoChiMinh": "Ho Chi Minh City",
    "location.haNoi": "Hanoi",
    "location.daNang": "Da Nang",
    "location.canTho": "Can Tho",
    "location.haiPhong": "Hai Phong",

    "payment.vnpay.title": "VNPay Payment",
    "payment.vnpay.selectBank": "Select bank",
    "payment.vnpay.allBanks": "All banks",
    "payment.vnpay.redirecting": "Redirecting to payment gateway...",
    "payment.vnpay.info":
      "You will be redirected to VNPay gateway to complete the payment. After successful payment, you will be redirected back to the order page.",
    "payment.momo.title": "MoMo Payment",
    "payment.momo.creating": "Creating payment link...",
    "payment.momo.redirecting": "Redirecting to MoMo...",
    "payment.momo.scanQR":
      "Scan QR code or click the button below to pay with MoMo wallet",
    "payment.momo.info":
      "You will be redirected to MoMo app/website to complete the payment. Make sure you have sufficient balance in your MoMo wallet.",
    "payment.momo.open": "Open MoMo",
    "payment.momo.create": "Create Payment",
    "payment.status.checking": "Checking payment...",
    "payment.status.success": "Payment Successful!",
    "payment.status.failed": "Payment Failed",
    "payment.status.redirecting": "Redirecting to order page...",
    "payment.status.pleaseComplete":
      "Please complete the payment on {method}. We will automatically detect when payment is successful.",
    "payment.status.tryAgain":
      "Please try again or contact support if the problem persists.",
    "payment.status.viewOrder": "View Order",
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = React.createContext<Ctx | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = React.useState<Lang>(
    (localStorage.getItem("lang") as Lang) || "en"
  );
  const t = React.useCallback(
    (key: string) => {
      const dict = translations[lang] || translations.en;
      return dict[key] ?? key;
    },
    [lang]
  );
  React.useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("I18nContext not found");
  return ctx;
};
