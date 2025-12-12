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
