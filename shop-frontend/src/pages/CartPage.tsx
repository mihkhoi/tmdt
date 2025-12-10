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

const CartPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    return ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];
  };
  const deliveryEtaText = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `Giao ${weekdayName(d)}, ${dd}/${mm}`;
  };
  const fmtMoney = (n: number) => {
    const currency = localStorage.getItem("currency") || "VND";
    const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
    if (currency === "USD") return `$${(Number(n || 0) / rate).toLocaleString("en-US")}`;
    return `${Number(n || 0).toLocaleString("vi-VN")} ₫`;
  };

  return (
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
                    <Chip label="CHÍNH HÃNG" color="primary" size="small" sx={{ ml: 1 }} />
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
      </Box>
    </Box>
  );
};

export default CartPage;
