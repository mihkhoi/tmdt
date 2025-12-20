import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import http from "../api/http";
import { clearCart } from "../store/cartSlice";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Switch,
  LinearProgress,
  Card,
  CardContent,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../utils/currencyUtils";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QrCodeIcon from "@mui/icons-material/QrCode";
import VNPayPaymentDialog from "../components/VNPayPaymentDialog";
import MoMoPaymentDialog from "../components/MoMoPaymentDialog";
import VietQrPaymentDialog from "../components/VietQrPaymentDialog"; // ✅ NEW

const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
const toAbs = (u: string) =>
  u && u.startsWith("/uploads/") ? apiOrigin + u : u;

const CheckoutPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const { t, lang } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingMethod, setShippingMethod] = useState("SAVER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const [lastOrderTotal, setLastOrderTotal] = useState<number | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  type Addr = { id: number; line: string; type: string; isDefault: boolean };
  const [shippingBook, setShippingBook] = useState<Addr[]>([]);
  const [showShipAddrs, setShowShipAddrs] = useState(false);

  const [applyPromo, setApplyPromo] = useState(false);
  const [applyShipVoucher, setApplyShipVoucher] = useState(false);
  const [applyTikiXu, setApplyTikiXu] = useState(false);

  const [showVNPayDialog, setShowVNPayDialog] = useState(false);
  const [showMoMoDialog, setShowMoMoDialog] = useState(false);

  // ✅ NEW: VietQR dialog
  const [showVietQrDialog, setShowVietQrDialog] = useState(false);
  const [vietQrUrl, setVietQrUrl] = useState<string>("");

  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [momoPayUrl, setMomoPayUrl] = useState<string>("");
  const [vnpayPayUrl, setVnpayPayUrl] = useState<string>("");

  const loadAddresses = useCallback(async () => {
    try {
      const [shipRes, billRes] = await Promise.all([
        http.get("/addresses", { params: { type: "SHIPPING" } }),
        http.get("/addresses", { params: { type: "BILLING" } }),
      ]);
      const sList: Addr[] = Array.isArray(shipRes.data) ? shipRes.data : [];
      const bList: Addr[] = Array.isArray(billRes.data) ? billRes.data : [];
      setShippingBook(sList);
      const sDef = sList.find((a) => a.isDefault);
      const bDef = bList.find((a) => a.isDefault);
      if (sDef) setShippingAddress(sDef.line);
      if (bDef) setBillingAddress(bDef.line);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const pm = localStorage.getItem("default_payment");
    if (pm) setPaymentMethod(pm);
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    localStorage.setItem("default_payment", paymentMethod);
  }, [paymentMethod]);

  const addAddress = async (type: "SHIPPING" | "BILLING") => {
    const line = type === "SHIPPING" ? shippingAddress : billingAddress;
    if (!line.trim()) return;
    await http.post("/addresses", { line, type });
    await loadAddresses();
  };

  const deleteAddress = async (id: number) => {
    await http.delete(`/addresses/${id}`);
    await loadAddresses();
  };

  const editAddress = async (a: Addr) => {
    const next = window.prompt("Sửa địa chỉ", a.line);
    if (next && next.trim() && next !== a.line) {
      await http.put(`/addresses/${a.id}`, { line: next });
      await loadAddresses();
    }
  };

  const setDefault = async (a: Addr) => {
    await http.put(`/addresses/${a.id}/default`);
    await loadAddresses();
  };

  const handleCheckout = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      if (!shippingAddress.trim()) {
        setError(t("checkout.error.address"));
        setLoading(false);
        return;
      }
      if (!billingAddress.trim()) {
        setBillingAddress(shippingAddress);
      }

      const token = localStorage.getItem("token");
      const body = {
        shippingAddress,
        billingAddress: billingAddress.trim()
          ? billingAddress
          : shippingAddress,
        paymentMethod,
        voucherCode: voucherCode || undefined,
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await http.post("/orders", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newId = Number(res.data?.id);
      const orderTotal = Number(res.data?.totalAmount ?? 0);

      setLastOrderTotal(orderTotal);
      setSuccessOrderId(newId || null);

      // ✅ clear cart + reset form
      dispatch(clearCart());
      setShippingAddress("");
      setBillingAddress("");
      setVoucherCode("");

      if (newId) {
        const pm = String(paymentMethod).toUpperCase();

        if (pm === "VNPAY") {
          setPendingOrderId(newId);
          setVnpayPayUrl("");
          setShowVNPayDialog(true);
          setLoading(false);
          return;
        } else if (pm === "MOMO") {
          setPendingOrderId(newId);
          setMomoPayUrl("");

          try {
            const origin = window.location.origin;
            const r = await http.post(
              `/orders/${newId}/pay/momo/create`,
              null,
              {
                params: { returnUrl: `${origin}/order-success?id=${newId}` },
              }
            );
            const payUrl = String(r.data?.payUrl || "");
            if (payUrl) {
              setMomoPayUrl(payUrl);
              setShowMoMoDialog(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("Failed to create MoMo payment:", e);
          }
        } else if (pm === "VIETQR") {
          setPendingOrderId(newId);
          setVietQrUrl("");

          try {
            // ✅ Backend bạn làm: GET /orders/{id}/pay/vietqr -> { imageUrl }
            const r = await http.get(`/orders/${newId}/pay/vietqr`);
            const url = String(r.data?.imageUrl || "");
            if (url) {
              setVietQrUrl(url);
              setShowVietQrDialog(true);
              setLoading(false);
              return;
            }
            setError(
              lang === "en" ? "Cannot create VietQR" : "Không thể tạo mã VietQR"
            );
          } catch (e) {
            console.error("VietQR failed:", e);
            setError(lang === "en" ? "Payment failed" : "Thanh toán thất bại");
          }
        }

        // mặc định: đi trang success luôn
        navigate(`/order-success?id=${newId}`);
      }

      // ✅ reset payment method sau khi xử lý xong
      setPaymentMethod("COD");
    } catch (e) {
      console.error(e);
      setError(t("checkout.error.failed"));
    } finally {
      setLoading(false);
    }
  }, [
    shippingAddress,
    billingAddress,
    paymentMethod,
    voucherCode,
    items,
    t,
    dispatch,
    navigate,
    lang,
  ]);

  useEffect(() => {
    if (sp.get("stripe") === "success" && !loading) {
      handleCheckout();
    }
  }, [sp, loading, handleCheckout]);

  const weekdayName = (d: Date) => {
    const day = d.getDay();
    return lang === "en"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
      : ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][day];
  };

  const deliveryEtaText = () => {
    const d = new Date();
    d.setDate(d.getDate() + (shippingMethod === "SAVER" ? 3 : 2));
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    if (lang === "en")
      return `${t("product.deliveryPrefix")} ${weekdayName(d)}, ${mm}/${dd}`;
    return `${t("product.deliveryPrefix")} ${weekdayName(d)}, ${dd}/${mm}`;
  };

  const shipBase = useMemo(
    () => (shippingMethod === "SAVER" ? 18500 : 25000),
    [shippingMethod]
  );

  const shipDiscount = useMemo(() => {
    if (total >= 100000) return shipBase;
    if (applyShipVoucher) return Math.min(16500, shipBase);
    return 0;
  }, [total, shipBase, applyShipVoucher]);

  const shipFee = useMemo(
    () => Math.max(0, shipBase - shipDiscount),
    [shipBase, shipDiscount]
  );

  const promoDiscount = useMemo(() => (applyPromo ? 30000 : 0), [applyPromo]);

  const finalTotal = useMemo(
    () => Math.max(0, total + shipFee - promoDiscount),
    [total, shipFee, promoDiscount]
  );

  const savedAmount = useMemo(
    () => shipDiscount + promoDiscount,
    [shipDiscount, promoDiscount]
  );

  const freeShipThreshold = 100000;

  const freeRemain = useMemo(
    () => Math.max(0, freeShipThreshold - total),
    [freeShipThreshold, total]
  );

  const freeProgress = useMemo(
    () =>
      Math.min(
        100,
        Math.floor(
          (Math.min(total, freeShipThreshold) / freeShipThreshold) * 100
        )
      ),
    [total]
  );

  return (
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
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#333",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {t("checkout.title")}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {successOrderId !== null && (
          <Card
            sx={{
              mb: 3,
              border: "2px solid #4CAF50",
              borderRadius: 2,
              bgcolor: "#E8F5E9",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 40, color: "#4CAF50" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t("checkout.success")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lang === "en" ? "Order ID" : "Mã đơn"} #{successOrderId}
                    {lastOrderTotal !== null
                      ? ` • ${
                          lang === "en" ? "Total" : "Tổng"
                        } ${formatCurrency(lastOrderTotal)}`
                      : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    component={Link}
                    to="/orders"
                    variant="outlined"
                    sx={{
                      borderColor: "#1A94FF",
                      color: "#1A94FF",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {t("checkout.viewOrders")}
                  </Button>
                  <Button
                    component={Link}
                    to={`/orders/${successOrderId}`}
                    variant="contained"
                    sx={{
                      bgcolor: "#4CAF50",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#388E3C",
                      },
                    }}
                  >
                    {t("checkout.viewOrderDetail")}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 420px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Shipping Method */}
            <Card sx={{ border: "1px solid #E8E8E8", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <LocalShippingIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#333" }}
                  >
                    {t("checkout.shipping.title")}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />
                <RadioGroup
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                >
                  <Card
                    sx={{
                      mb: 1.5,
                      border:
                        shippingMethod === "SAVER"
                          ? "2px solid #1A94FF"
                          : "1px solid #E8E8E8",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#1A94FF" },
                    }}
                    onClick={() => setShippingMethod("SAVER")}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <FormControlLabel
                        value="SAVER"
                        control={
                          <Radio
                            sx={{
                              color: "#1A94FF",
                              "&.Mui-checked": { color: "#1A94FF" },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {t("checkout.shipping.saver")}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {deliveryEtaText()}
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card
                    sx={{
                      border:
                        shippingMethod === "FAST"
                          ? "2px solid #1A94FF"
                          : "1px solid #E8E8E8",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#1A94FF" },
                    }}
                    onClick={() => setShippingMethod("FAST")}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <FormControlLabel
                        value="FAST"
                        control={
                          <Radio
                            sx={{
                              color: "#1A94FF",
                              "&.Mui-checked": { color: "#1A94FF" },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {t("checkout.shipping.fast")}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {deliveryEtaText()}
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </RadioGroup>

                {shipFee > 0 && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "#FFF4E6", borderRadius: 2 }}
                  >
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      {lang === "en"
                        ? `Add ${formatCurrency(
                            freeRemain
                          )} more for free shipping`
                        : `Cần thêm ${formatCurrency(
                            freeRemain
                          )} để miễn phí vận chuyển`}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={freeProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#FFE0B2",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#FFC120",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Voucher */}
            <Card sx={{ border: "1px solid #E8E8E8", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <LocalOfferIcon sx={{ color: "#FF424E", fontSize: 24 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#333" }}
                  >
                    {t("checkout.voucher.title")}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  size="small"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder={t("checkout.voucher.placeholder")}
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {lang === "en"
                    ? "View more vouchers in Voucher Wallet"
                    : "Xem thêm voucher ở Kho Voucher"}
                </Typography>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card sx={{ border: "1px solid #E8E8E8", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2.5, color: "#333" }}
                >
                  {t("checkout.payment.title")}
                </Typography>
                <Divider sx={{ mb: 2.5 }} />
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {/* COD */}
                  <Card
                    sx={{
                      mb: 1.5,
                      border:
                        paymentMethod === "COD"
                          ? "2px solid #1A94FF"
                          : "1px solid #E8E8E8",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#1A94FF" },
                    }}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <FormControlLabel
                        value="COD"
                        control={
                          <Radio
                            sx={{
                              color: "#1A94FF",
                              "&.Mui-checked": { color: "#1A94FF" },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {t("checkout.payment.cod")}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {lang === "en"
                                ? "Pay on delivery"
                                : "Thanh toán khi nhận hàng"}
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  {/* VNPAY */}
                  <Card
                    sx={{
                      mb: 1.5,
                      border:
                        paymentMethod === "VNPAY"
                          ? "2px solid #1A94FF"
                          : "1px solid #E8E8E8",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#1A94FF" },
                    }}
                    onClick={() => setPaymentMethod("VNPAY")}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <FormControlLabel
                        value="VNPAY"
                        control={
                          <Radio
                            sx={{
                              color: "#1A94FF",
                              "&.Mui-checked": { color: "#1A94FF" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <QrCodeIcon
                              sx={{ color: "#1A94FF", fontSize: 20 }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                {t("checkout.payment.vnpay")}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {lang === "en"
                                  ? "Pay with VNPay"
                                  : "Thanh toán qua VNPay"}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  {/* MOMO */}
                  <Card
                    sx={{
                      mb: 1.5,
                      border:
                        paymentMethod === "MOMO"
                          ? "2px solid #1A94FF"
                          : "1px solid #E8E8E8",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#1A94FF" },
                    }}
                    onClick={() => setPaymentMethod("MOMO")}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <FormControlLabel
                        value="MOMO"
                        control={
                          <Radio
                            sx={{
                              color: "#1A94FF",
                              "&.Mui-checked": { color: "#1A94FF" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AccountBalanceWalletIcon
                              sx={{ color: "#A50064", fontSize: 20 }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                {t("checkout.payment.momo")}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {lang === "en"
                                  ? "Pay with MoMo"
                                  : "Thanh toán qua MoMo"}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  {/* ✅ NEW: VIETQR (✅ FIX: thêm mb: 1.5) */}
                  <Card
                    sx={{
                      mb: 1.5, // ✅ FIX
                      border:
                        paymentMethod === "VIETQR"
                          ? "2px solid #1A94FF"
                          : "1px solid #E8E8E8",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#1A94FF" },
                    }}
                    onClick={() => setPaymentMethod("VIETQR")}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <FormControlLabel
                        value="VIETQR"
                        control={
                          <Radio
                            sx={{
                              color: "#1A94FF",
                              "&.Mui-checked": { color: "#1A94FF" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <QrCodeIcon
                              sx={{ color: "#1A94FF", fontSize: 20 }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                VietQR (Chuyển khoản QR)
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {lang === "en"
                                  ? "Scan QR to transfer exact amount"
                                  : "Quét mã để chuyển khoản đúng số tiền"}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </RadioGroup>

                {/* Payment Promotions */}
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    bgcolor: "#FFF4E6",
                    borderRadius: 2,
                    border: "1px solid #FFE0B2",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, color: "#FF424E" }}
                  >
                    {lang === "en" ? "Payment Promotions" : "Ưu đãi thanh toán"}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      label={lang === "en" ? "Save 30k" : "Giảm 30k"}
                      size="small"
                      sx={{
                        bgcolor: "#FF424E",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={lang === "en" ? "Save 50k" : "Giảm 50k"}
                      size="small"
                      sx={{
                        bgcolor: "#FF424E",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label="Freeship"
                      size="small"
                      sx={{
                        bgcolor: "#1A94FF",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={lang === "en" ? "Save 8%" : "Giảm 8%"}
                      size="small"
                      sx={{
                        bgcolor: "#4CAF50",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Address & Summary */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Delivery Address */}
            <Card sx={{ border: "1px solid #E8E8E8", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#333" }}
                    >
                      {t("checkout.shipTo")}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setShowShipAddrs((v) => !v)}
                    sx={{
                      color: "#1A94FF",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {t("checkout.change")}
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {shippingAddress ? (
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {shippingAddress}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t("checkout.noAddress")}
                  </Typography>
                )}

                {showShipAddrs && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder={
                        lang === "en"
                          ? "Enter shipping address"
                          : "Nhập địa chỉ giao hàng"
                      }
                      sx={{ mb: 2 }}
                    />

                    {shippingBook.map((a) => (
                      <Card
                        key={a.id}
                        sx={{
                          mb: 1.5,
                          border:
                            shippingAddress === a.line
                              ? "2px solid #1A94FF"
                              : "1px solid #E8E8E8",
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": { borderColor: "#1A94FF" },
                        }}
                        onClick={() => setShippingAddress(a.line)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <input
                                type="radio"
                                name="ship_addr"
                                checked={shippingAddress === a.line}
                                onChange={() => setShippingAddress(a.line)}
                                style={{
                                  width: 18,
                                  height: 18,
                                  cursor: "pointer",
                                }}
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {a.line}
                                </Typography>
                                {a.isDefault && (
                                  <Chip
                                    label={
                                      lang === "en" ? "Default" : "Mặc định"
                                    }
                                    size="small"
                                    sx={{
                                      mt: 0.5,
                                      bgcolor: "#1A94FF",
                                      color: "#fff",
                                      fontSize: "0.7rem",
                                      height: 20,
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editAddress(a);
                                }}
                                sx={{ color: "#1A94FF" }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAddress(a.id);
                                }}
                                sx={{ color: "#FF424E" }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              {!a.isDefault && (
                                <Button
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDefault(a);
                                  }}
                                  sx={{
                                    color: "#1A94FF",
                                    textTransform: "none",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {lang === "en" ? "Set default" : "Mặc định"}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => addAddress("SHIPPING")}
                      sx={{
                        mt: 1,
                        borderColor: "#1A94FF",
                        color: "#1A94FF",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#0D7AE6",
                          bgcolor: "rgba(26,148,255,0.1)",
                        },
                      }}
                    >
                      {t("checkout.saveCurrentAddress")}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Promotions */}
            <Card sx={{ border: "1px solid #E8E8E8", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StarIcon sx={{ color: "#FFC120", fontSize: 24 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#333" }}
                    >
                      {t("checkout.promos.title")}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setApplyPromo((v) => !v)}
                    sx={{
                      color: applyPromo ? "#FF424E" : "#1A94FF",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {applyPromo
                      ? t("checkout.promos.remove")
                      : t("checkout.promos.apply")}
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      bgcolor: applyPromo ? "#E8F4FD" : "#F5F5F5",
                      borderRadius: 1,
                      border: applyPromo
                        ? "1px solid #1A94FF"
                        : "1px solid #E8E8E8",
                    }}
                  >
                    <Chip
                      label={lang === "en" ? "Save 30k" : "Giảm 30K"}
                      size="small"
                      sx={{
                        bgcolor: applyPromo ? "#1A94FF" : "#666",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                    <Switch
                      checked={applyPromo}
                      onChange={(e) => setApplyPromo(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#1A94FF",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            bgcolor: "#1A94FF",
                          },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      bgcolor: applyShipVoucher ? "#E8F4FD" : "#F5F5F5",
                      borderRadius: 1,
                      border: applyShipVoucher
                        ? "1px solid #1A94FF"
                        : "1px solid #E8E8E8",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {lang === "en"
                        ? "Shipping discount"
                        : "Giảm giá vận chuyển"}
                    </Typography>
                    <Switch
                      checked={applyShipVoucher}
                      onChange={(e) => setApplyShipVoucher(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#1A94FF",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            bgcolor: "#1A94FF",
                          },
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card
              sx={{
                border: "1px solid #E8E8E8",
                borderRadius: 2,
                position: "sticky",
                top: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                bgcolor: "#fff",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2.5, color: "#333" }}
                >
                  {t("checkout.summary.title")}
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                {/* Items */}
                <Box sx={{ mb: 2.5 }}>
                  {items.map((i: any) => (
                    <Box
                      key={i.id}
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom: "1px solid #E8E8E8",
                      }}
                    >
                      {i.imageUrl && (
                        <Box
                          component="img"
                          src={toAbs(i.imageUrl)}
                          alt={i.name || i.nameEn || ""}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid #E8E8E8",
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {lang === "en" && i.nameEn ? i.nameEn : i.name || ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {lang === "en" ? "Quantity" : "Số lượng"}:{" "}
                          {i.quantity}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#FF424E" }}
                      >
                        {formatCurrency(Number(i.price) * i.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Summary */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("checkout.summary.itemsTotal")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(total)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("checkout.summary.shippingFee")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: shipFee === 0 ? "#4CAF50" : "#333",
                      }}
                    >
                      {shipFee === 0
                        ? lang === "en"
                          ? "FREE"
                          : "MIỄN PHÍ"
                        : formatCurrency(shipFee)}
                    </Typography>
                  </Box>

                  {shipDiscount > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t("checkout.summary.shippingDiscount")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#4CAF50" }}
                      >
                        -{formatCurrency(shipDiscount)}
                      </Typography>
                    </Box>
                  )}

                  {promoDiscount > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t("checkout.summary.promoDiscount")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#4CAF50" }}
                      >
                        -{formatCurrency(promoDiscount)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t("checkout.summary.totalPayable")}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#FF424E",
                      fontSize: "1.5rem",
                    }}
                  >
                    {formatCurrency(finalTotal)}
                  </Typography>
                </Box>

                {savedAmount > 0 && (
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2,
                      bgcolor: "#E8F5E9",
                      color: "#2E7D32",
                      border: "1px solid #A5D6A7",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {lang === "en" ? "Saved" : "Tiết kiệm"}:{" "}
                      {formatCurrency(savedAmount)}
                    </Typography>
                  </Alert>
                )}

                <Button
                  fullWidth
                  onClick={handleCheckout}
                  disabled={
                    loading || items.length === 0 || !shippingAddress.trim()
                  }
                  variant="contained"
                  sx={{
                    py: 1.5,
                    bgcolor: "#FF424E",
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(255,66,78,0.3)",
                    "&:hover": {
                      bgcolor: "#E53935",
                      boxShadow: "0 6px 16px rgba(255,66,78,0.4)",
                    },
                    "&:disabled": { bgcolor: "#FFB3B3" },
                  }}
                >
                  {loading
                    ? t("checkout.processing")
                    : t("checkout.placeOrder")}
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 2,
                    color: "#999",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {lang === "en"
                    ? "Price includes VAT, packaging fees, shipping fees and other costs"
                    : "Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các chi phí phát sinh khác"}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* VNPay Payment Dialog */}
      <VNPayPaymentDialog
        open={showVNPayDialog}
        onClose={() => {
          setShowVNPayDialog(false);
          if (pendingOrderId) {
            navigate(`/order-success?id=${pendingOrderId}`);
          }
        }}
        onConfirm={async (bankCode) => {
          if (!pendingOrderId || vnpayPayUrl) return;
          try {
            setLoading(true);
            const params: any = {};
            const origin = window.location.origin;
            if (/^https:\/\/(www\.)?shopmoikhinh\.com$/i.test(origin)) {
              params.returnUrl = `${origin}/order-success?id=${pendingOrderId}`;
            }
            if (bankCode) params.bankCode = bankCode;

            const r = await http.post(
              `/orders/${pendingOrderId}/pay/vnpay/create`,
              null,
              {
                params,
              }
            );
            const payUrl = String(r.data?.payUrl || "");
            if (payUrl) {
              setVnpayPayUrl(payUrl);
              setLoading(false);
            } else {
              const errorMsg =
                r.data?.error ||
                (lang === "en"
                  ? "Payment URL creation failed"
                  : "Không thể tạo URL thanh toán");
              setError(errorMsg);
              setShowVNPayDialog(false);
              setLoading(false);
            }
          } catch (e: any) {
            console.error("VNPay payment failed:", e);
            const errorMsg =
              e.response?.data?.error ||
              e.message ||
              (lang === "en" ? "Payment failed" : "Thanh toán thất bại");
            setError(errorMsg);
            setShowVNPayDialog(false);
            setLoading(false);
          }
        }}
        amount={lastOrderTotal || total}
        orderId={pendingOrderId || 0}
        payUrl={vnpayPayUrl}
        loading={loading}
      />

      {/* MoMo Payment Dialog */}
      <MoMoPaymentDialog
        open={showMoMoDialog}
        onClose={() => {
          setShowMoMoDialog(false);
          if (pendingOrderId) {
            navigate(`/order-success?id=${pendingOrderId}`);
          }
        }}
        onConfirm={async () => {
          if (!pendingOrderId || momoPayUrl) return;
          try {
            setLoading(true);
            const origin = window.location.origin;
            const r = await http.post(
              `/orders/${pendingOrderId}/pay/momo/create`,
              null,
              {
                params: {
                  returnUrl: `${origin}/order-success?id=${pendingOrderId}`,
                },
              }
            );
            const payUrl = String(r.data?.payUrl || "");
            if (payUrl) {
              setMomoPayUrl(payUrl);
            }
          } catch (e) {
            console.error("MoMo payment failed:", e);
            setError(lang === "en" ? "Payment failed" : "Thanh toán thất bại");
            setShowMoMoDialog(false);
            setLoading(false);
          }
        }}
        amount={lastOrderTotal || total}
        orderId={pendingOrderId || 0}
        payUrl={momoPayUrl}
        loading={loading}
      />

      {/* ✅ NEW: VietQR Payment Dialog (✅ FIX: orderId = pendingOrderId) */}
      <VietQrPaymentDialog
        open={showVietQrDialog}
        onClose={() => {
          setShowVietQrDialog(false);
          if (pendingOrderId) {
            navigate(`/order-success?id=${pendingOrderId}`);
          }
        }}
        orderId={pendingOrderId} // ✅ FIX
        imageUrl={vietQrUrl}
        amountText={formatCurrency(lastOrderTotal || finalTotal)}
      />
    </Box>
  );
};

export default CheckoutPage;
