import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import { RootState } from "../store/store";
import {
  removeFromCart,
  incItem,
  decItem,
  toggleSelect,
  selectAll,
  removeSelected,
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider, Chip } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import http from "../api/http";
import { useI18n } from "../i18n";
<<<<<<< HEAD
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../utils/currencyUtils";
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

const CartPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
<<<<<<< HEAD
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) => (u && u.startsWith("/uploads/") ? apiOrigin + u : u);

  const [voucherCode, setVoucherCode] = useState("");

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    items.forEach((it: any) => {
      const seller = it.brand || "Khác";
      if (!map[seller]) map[seller] = [];
      map[seller].push(it);
    });
    return map;
  }, [items]);

  const selectedItems = useMemo(() => items.filter((i: any) => i.selected), [items]);
  const selectedQty = useMemo(
    () => selectedItems.reduce((n: number, i: any) => n + i.quantity, 0),
    [selectedItems]
  );
  const subtotal = useMemo(
    () => selectedItems.reduce((sum: number, i: any) => sum + Number(i.price) * i.quantity, 0),
    [selectedItems]
  );
  const shippingFee = useMemo(() => (subtotal >= 100000 ? 0 : selectedItems.length ? 25000 : 0), [subtotal, selectedItems]);
  const voucherDiscount = 0;
  const totalPayable = subtotal + shippingFee - voucherDiscount;

  const weekdayName = (d: Date) => {
    const day = d.getDay();
<<<<<<< HEAD
    return lang === "en"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
      : ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];
=======
    return ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
  };
  const deliveryEtaText = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
<<<<<<< HEAD
    if (lang === "en") return `${t("product.deliveryPrefix")} ${weekdayName(d)}, ${mm}/${dd}`;
    return `${t("product.deliveryPrefix")} ${weekdayName(d)}, ${dd}/${mm}`;
=======
    return `Giao ${weekdayName(d)}, ${dd}/${mm}`;
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
  };
  const fmtMoney = (n: number) => {
    const currency = localStorage.getItem("currency") || "VND";
    const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
    if (currency === "USD") return `$${(Number(n || 0) / rate).toLocaleString("en-US")}`;
    return `${Number(n || 0).toLocaleString("vi-VN")} ₫`;
  };

  // Lấy tên sản phẩm theo ngôn ngữ
  const getProductName = (item: any) => {
    if (!item) return "";
    if (lang === "en" && item.nameEn) {
      return item.nameEn;
    }
    return item.name || "";
  };

  const [voucherCode, setVoucherCode] = useState("");

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    items.forEach((it: any) => {
      const seller = it.brand || "Khác";
      if (!map[seller]) map[seller] = [];
      map[seller].push(it);
    });
    return map;
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((i: any) => i.selected),
    [items]
  );
  const selectedQty = useMemo(
    () => selectedItems.reduce((n: number, i: any) => n + i.quantity, 0),
    [selectedItems]
  );
  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum: number, i: any) => sum + Number(i.price) * i.quantity,
        0
      ),
    [selectedItems]
  );
  const shippingFee = useMemo(
    () => (subtotal >= 100000 ? 0 : selectedItems.length ? 25000 : 0),
    [subtotal, selectedItems]
  );
  const voucherDiscount = 0;
  const totalPayable = subtotal + shippingFee - voucherDiscount;

  const weekdayName = (d: Date) => {
    const day = d.getDay();
    return lang === "en"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
      : ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];
  };
  const deliveryEtaText = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    if (lang === "en")
      return `${t("product.deliveryPrefix")} ${weekdayName(d)}, ${mm}/${dd}`;
    return `${t("product.deliveryPrefix")} ${weekdayName(d)}, ${dd}/${mm}`;
  };

  return (
<<<<<<< HEAD
    <Box
      sx={{
        bgcolor: isDark ? "#121212" : "#F5F5F5",
        minHeight: "100vh",
        py: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          mb={3}
          sx={{
            fontWeight: 700,
            color: "#333",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {lang === "en" ? "Shopping Cart" : "Giỏ hàng"}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 400px" },
            gap: 3,
          }}
        >
          <Box>
            <Paper
              sx={{
                p: 2.5,
                mb: 2,
                bgcolor: isDark ? "#1e1e1e" : "#fff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid #E8E8E8",
                borderRadius: 2,
                boxShadow: isDark
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <input
                  type="checkbox"
                  checked={
                    items.length > 0 && items.every((i: any) => i.selected)
                  }
                  onChange={(e) => dispatch(selectAll(e.target.checked))}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: isDark ? "#fff" : "#333" }}
                >
                  {lang === "en" ? "Select all" : "Chọn tất cả"} ({items.length}
                  )
                </Typography>
                <Button
                  size="small"
                  onClick={() => dispatch(removeSelected())}
                  sx={{
                    color: "#FF424E",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(255,66,78,0.1)" },
                  }}
                >
                  {lang === "en" ? "Delete" : "Xóa"}
                </Button>
              </Box>
            </Paper>

            {Object.entries(grouped).map(([seller, list]) => (
              <Paper
                key={seller}
                sx={{
                  p: 3,
                  mb: 2,
                  bgcolor: "#fff",
                  border: "1px solid #E8E8E8",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StorefrontIcon sx={{ color: "#1A94FF", fontSize: 20 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: isDark ? "#fff" : "#333" }}
                    >
                      {lang === "en" ? "Sold by" : "Bán bởi"}: {seller}
                    </Typography>
                    {seller !== "Khác" && (
                      <Chip
                        label={t("chip.authentic")}
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor: "#1A94FF",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <LocalShippingIcon fontSize="small" />
                    <Typography variant="caption">
                      {deliveryEtaText()}
                    </Typography>
                  </Box>
                </Box>

                {list.map((item: any) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "40px 100px 1fr 140px 160px 120px",
                      },
                      alignItems: "center",
                      gap: 2,
                      py: 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!item.selected}
                      onChange={() => dispatch(toggleSelect(item.id))}
                    />
                    {item.imageUrl ? (
                      <img
                        src={toAbs(item.imageUrl)}
                        alt={getProductName(item)}
                        style={{
                          width: 100,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <div />
                    )}
                    <Box>
                      <Typography variant="subtitle2">
                        {getProductName(item)}
                      </Typography>
                      {item.discountPercent > 0 && (
                        <Chip
                          label={`-${item.discountPercent}%`}
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor: "#FF424E",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#FF424E" }}
                    >
                      {formatCurrency(Number(item.price))}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => dispatch(decItem(item.id))}
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderColor: "#E8E8E8",
                          color: "#333",
                          "&:hover": {
                            borderColor: "#1A94FF",
                            bgcolor: "rgba(26,148,255,0.1)",
                          },
                        }}
                      >
                        -
                      </Button>
                      <Typography
                        variant="body1"
                        sx={{
                          minWidth: 40,
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => dispatch(incItem(item.id))}
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderColor: "#E8E8E8",
                          color: "#333",
                          "&:hover": {
                            borderColor: "#1A94FF",
                            bgcolor: "rgba(26,148,255,0.1)",
                          },
                        }}
                      >
                        +
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          color: "#FF424E",
                          fontSize: "1.1rem",
                        }}
                      >
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </Typography>
                      <Button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        sx={{
                          color: "#FF424E",
                          fontWeight: 600,
                          textTransform: "none",
                          "&:hover": { bgcolor: "rgba(255,66,78,0.1)" },
                        }}
                      >
                        {lang === "en" ? "Delete" : "Xóa"}
                      </Button>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalOfferIcon fontSize="small" color="secondary" />
                  <Typography variant="caption" color="text.secondary">
                    Xem thêm voucher của shop
                  </Typography>
                </Box>
              </Paper>
            ))}

            {items.length === 0 && (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "#fff",
                  border: "1px solid #E8E8E8",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 1, fontWeight: 600, color: "#666" }}
                >
                  {lang === "en" ? "Your cart is empty" : "Giỏ hàng trống"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {lang === "en"
                    ? "Add items to your cart to continue shopping"
                    : "Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm"}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    bgcolor: "#1A94FF",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "#0D7AE6",
                    },
                  }}
                >
                  {lang === "en" ? "Continue Shopping" : "Tiếp tục mua sắm"}
                </Button>
              </Paper>
            )}
          </Box>

          <Box>
            <Paper
              sx={{
                p: 3,
                bgcolor: "#fff",
                border: "1px solid #E8E8E8",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                position: "sticky",
                top: 16,
              }}
            >
              <Typography
                variant="h6"
                mb={2.5}
                sx={{ fontWeight: 700, color: "#333", fontSize: "1.2rem" }}
              >
                {lang === "en" ? "Order Summary" : "Tóm tắt đơn hàng"}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {lang === "en"
                    ? `Subtotal (${selectedQty} items)`
                    : `Tạm tính (${selectedQty} sản phẩm)`}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: isDark ? "#fff" : "#333" }}
                >
                  {formatCurrency(subtotal)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {lang === "en" ? "Shipping fee" : "Phí vận chuyển"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: shippingFee ? "#333" : "#4CAF50",
                    fontWeight: shippingFee ? 500 : 600,
                  }}
                >
                  {shippingFee
                    ? formatCurrency(shippingFee)
                    : lang === "en"
                    ? "Free"
                    : "Miễn phí"}
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 1.5, mb: 2.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: isDark ? "#fff" : "#333" }}
                >
                  {lang === "en" ? "Voucher" : "Mã giảm giá"}
                </Typography>
                <Box
                  component="input"
                  value={voucherCode}
                  onChange={(e: any) => setVoucherCode(e.target.value)}
                  placeholder={
                    lang === "en" ? "Enter voucher code" : "Nhập mã voucher"
                  }
                  sx={{
                    width: "100%",
                    p: 1.5,
                    border: "1px solid #E8E8E8",
                    borderRadius: 1,
                    fontSize: "0.875rem",
                    "&:focus": {
                      outline: "none",
                      borderColor: "#1A94FF",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#1A94FF", cursor: "pointer", fontWeight: 500 }}
                  onClick={() => navigate("/vouchers")}
                >
                  {lang === "en"
                    ? "View more vouchers"
                    : "Xem thêm voucher ở Kho Voucher"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2.5 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#333", fontSize: "1.1rem" }}
                >
                  {lang === "en" ? "Total" : "Tổng cộng"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#FF424E",
                    fontSize: "1.5rem",
                  }}
                >
                  {formatCurrency(totalPayable)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                disabled={selectedItems.length === 0}
                onClick={() => navigate("/checkout")}
                sx={{
                  py: 1.5,
                  bgcolor: "#FF424E",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(255,66,78,0.3)",
                  "&:hover": {
                    bgcolor: "#E53935",
                    boxShadow: "0 6px 16px rgba(255,66,78,0.4)",
                  },
                  "&:disabled": {
                    bgcolor: "#FFB3B3",
                  },
                }}
              >
                {lang === "en" ? "Checkout" : "Mua hàng"}
              </Button>
            </Paper>
          </Box>
        </Box>
=======
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Giỏ hàng</Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 360px" }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="checkbox"
                checked={items.length > 0 && items.every((i: any) => i.selected)}
                onChange={(e) => dispatch(selectAll(e.target.checked))}
              />
              <Typography variant="body2">Chọn tất cả ({items.length})</Typography>
              <Button size="small" color="error" onClick={() => dispatch(removeSelected())}>Xóa</Button>
            </Box>
          </Paper>

          {Object.entries(grouped).map(([seller, list]) => (
            <Paper key={seller} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorefrontIcon color="primary" />
                  <Typography variant="subtitle2">Bán bởi: {seller}</Typography>
                  {seller !== "Khác" && (
<<<<<<< HEAD
                    <Chip label={t("chip.authentic")} color="primary" size="small" sx={{ ml: 1 }} />
=======
                    <Chip label="CHÍNH HÃNG" color="primary" size="small" sx={{ ml: 1 }} />
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                  <LocalShippingIcon fontSize="small" />
                  <Typography variant="caption">{deliveryEtaText()}</Typography>
                </Box>
              </Box>

              {list.map((item: any) => (
                <Box key={item.id} sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "40px 100px 1fr 140px 160px 120px" },
                  alignItems: "center",
                  gap: 2,
                  py: 1,
                }}>
                  <input type="checkbox" checked={!!item.selected} onChange={() => dispatch(toggleSelect(item.id))} />
                  {item.imageUrl ? (
                    <img src={toAbs(item.imageUrl)} alt={item.name} style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }} />
                  ) : (
                    <div />
                  )}
                  <Box>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    {item.discountPercent > 0 && (
                      <Chip label={`-${item.discountPercent}%`} color="error" size="small" sx={{ mt: 0.5 }} />
                    )}
                  </Box>
                  <Typography variant="body2">{fmtMoney(Number(item.price))}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button variant="outlined" onClick={() => dispatch(decItem(item.id))}>-</Button>
                    <span>{item.quantity}</span>
                    <Button variant="outlined" onClick={() => dispatch(incItem(item.id))}>+</Button>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                    <Typography variant="body2">{fmtMoney(Number(item.price) * item.quantity)}</Typography>
                    <Button color="error" onClick={() => dispatch(removeFromCart(item.id))}>Xóa</Button>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalOfferIcon fontSize="small" color="secondary" />
                <Typography variant="caption" color="text.secondary">Xem thêm voucher của shop</Typography>
              </Box>
            </Paper>
          ))}

          {items.length === 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2">Giỏ hàng trống</Typography>
              <Button sx={{ mt: 1 }} variant="outlined" onClick={() => navigate("/")}>Tiếp tục mua sắm</Button>
            </Paper>
          )}
        </Box>

        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>Tóm tắt đơn</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">Tạm tính ({selectedQty} sản phẩm)</Typography>
              <Typography variant="subtitle1">{fmtMoney(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">Phí vận chuyển</Typography>
              <Typography variant="body2">{shippingFee ? fmtMoney(shippingFee) : "Miễn phí"}</Typography>
            </Box>
            <Box sx={{ display: "grid", gap: 1, mb: 2 }}>
              <Typography variant="subtitle2">Voucher</Typography>
              <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Nhập mã voucher" style={{ width: "100%", padding: 8 }} />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>Xem thêm voucher ở Kho Voucher</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="subtitle2">Tổng cộng</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{fmtMoney(totalPayable)}</Typography>
            </Box>
            <Button variant="contained" color="primary" fullWidth disabled={selectedItems.length === 0} onClick={() => navigate("/checkout")}>Mua hàng</Button>
          </Paper>
        </Box>
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
      </Box>
    </Box>
  );
};

export default CartPage;
