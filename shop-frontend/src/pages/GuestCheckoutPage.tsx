import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Divider, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { productApi } from "../api/productApi";

const GuestCheckoutPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const pid = Number(sp.get("pid") || 0);
  const qty = Math.max(1, Number(sp.get("qty") || 1));
  const [product, setProduct] = useState<any>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingMethod, setShippingMethod] = useState("FAST");
  const [voucherCode, setVoucherCode] = useState("");

  useEffect(() => {
    (async () => {
      if (pid) {
        const res = await productApi.getOne(pid);
        setProduct(res.data);
      }
    })();
  }, [pid]);

  const total = product ? Number(product.price) * qty : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Thanh toán (khách)</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 380px" }, gap: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>Thông tin giao hàng</Typography>
          <label style={{ display: "block", marginBottom: 8 }}>Địa chỉ giao hàng</label>
          <textarea value={shippingAddress} onChange={(e)=>setShippingAddress(e.target.value)} rows={3} style={{ width: "100%", padding: 8, marginBottom: 16 }} placeholder="Nhập địa chỉ cụ thể của bạn" />

          <Typography variant="h6" mb={1}>Phương thức vận chuyển</Typography>
          <RadioGroup value={shippingMethod} onChange={(e)=>setShippingMethod(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="FAST" control={<Radio />} label="Nhanh" />
            <FormControlLabel value="SAVER" control={<Radio />} label="Tiết kiệm" />
          </RadioGroup>

          <Typography variant="h6" mb={1}>Phương thức thanh toán</Typography>
          <RadioGroup value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="COD" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
            <FormControlLabel value="BANK" control={<Radio />} label="Chuyển khoản ngân hàng" />
            <FormControlLabel value="ONLINE" control={<Radio />} label="Thanh toán online" />
          </RadioGroup>

          <label style={{ display: "block", marginBottom: 8 }}>Mã voucher</label>
          <input value={voucherCode} onChange={(e)=>setVoucherCode(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 16 }} placeholder="Nhập mã giảm giá nếu có" />

          <Button variant="contained" color="primary" onClick={() => navigate("/login", { state: { redirect: "/cart" } })}>Đăng nhập để đặt hàng</Button>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>Tóm tắt đơn hàng</Typography>
          <Divider sx={{ mb: 2 }} />
          {product ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">{product.name} x {qty}</Typography>
                <Typography variant="body2">{(Number(product.price)*qty).toLocaleString("vi-VN")} ₫</Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body2">Đang tải sản phẩm...</Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Tổng: {total.toLocaleString("vi-VN")} ₫</Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>Đăng nhập để hoàn tất thanh toán và lưu thông tin.</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default GuestCheckoutPage;
