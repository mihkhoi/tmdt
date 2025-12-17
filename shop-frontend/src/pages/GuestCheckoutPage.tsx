import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { productApi } from "../api/productApi";
import { useI18n } from "../i18n";

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
  const { t, lang } = useI18n();

  // Lấy tên sản phẩm theo ngôn ngữ
  const getProductName = (prod: any) => {
    if (!prod) return "";
    if (lang === "en" && prod.nameEn) {
      return prod.nameEn;
    }
    return prod.name || "";
  };

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
      <Typography variant="h5" mb={2}>
        {t("checkout.title")} (guest)
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "1fr 380px" },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>
            {t("checkout.shipping.title")}
          </Typography>
          <label style={{ display: "block", marginBottom: 8 }}>
            {t("checkout.shipTo")}
          </label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8, marginBottom: 16 }}
            placeholder={
              lang === "en"
                ? "Enter your full address"
                : "Nhập địa chỉ cụ thể của bạn"
            }
          />

          <Typography variant="h6" mb={1}>
            {t("checkout.shipping.title")}
          </Typography>
          <RadioGroup
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="FAST"
              control={<Radio />}
              label={t("checkout.shipping.fast")}
            />
            <FormControlLabel
              value="SAVER"
              control={<Radio />}
              label={t("checkout.shipping.saver")}
            />
          </RadioGroup>

          <Typography variant="h6" mb={1}>
            {t("checkout.payment.title")}
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="COD"
              control={<Radio />}
              label={t("checkout.payment.cod")}
            />
            <FormControlLabel
              value="VNPAY"
              control={<Radio />}
              label={t("checkout.payment.vnpay")}
            />
            <FormControlLabel
              value="MOMO"
              control={<Radio />}
              label={t("checkout.payment.momo")}
            />
          </RadioGroup>

          <label style={{ display: "block", marginBottom: 8 }}>
            {t("checkout.voucher.title")}
          </label>
          <input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 16 }}
            placeholder={t("checkout.voucher.placeholder")}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login", { state: { redirect: "/cart" } })}
          >
            {lang === "en" ? "Login to place order" : "Đăng nhập để đặt hàng"}
          </Button>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>
            {t("checkout.summary.title")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {product ? (
            <>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  {getProductName(product)} x {qty}
                </Typography>
                <Typography variant="body2">
                  {lang === "en"
                    ? (Number(product.price) * qty).toLocaleString("en-US") +
                      " $"
                    : (Number(product.price) * qty).toLocaleString("vi-VN") +
                      " ₫"}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body2">
              {lang === "en" ? "Loading product..." : "Đang tải sản phẩm..."}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">
            {lang === "en"
              ? `Total: ${total.toLocaleString("en-US")} $`
              : `Tổng: ${total.toLocaleString("vi-VN")} ₫`}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "text.secondary" }}
          >
            {lang === "en"
              ? "Login to complete checkout and save info."
              : "Đăng nhập để hoàn tất thanh toán và lưu thông tin."}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default GuestCheckoutPage;
