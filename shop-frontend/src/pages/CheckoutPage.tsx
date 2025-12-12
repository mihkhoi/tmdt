import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import http from "../api/http";
import { clearCart } from "../store/cartSlice";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Switch,
  LinearProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QrCodeIcon from "@mui/icons-material/QrCode";

const CheckoutPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const { t, lang } = useI18n();
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
        billingAddress,
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

      setLastOrderTotal(Number(res.data?.totalAmount ?? 0));
      setSuccessOrderId(Number(res.data?.id ?? 0) || null);
      dispatch(clearCart());
      setShippingAddress("");
      setBillingAddress("");
      setPaymentMethod("COD");
      setVoucherCode("");

      const newId = Number(res.data?.id);
      if (newId) {
        const pm = String(paymentMethod).toUpperCase();
        const origin = window.location.origin;
        if (pm === "VNPAY") {
          try {
            const r = await http.post(
              `/orders/${newId}/pay/vnpay/create`,
              null,
              {
                params: { returnUrl: `${origin}/order-success?id=${newId}` },
              }
            );
            const vnpHost =
              process.env.REACT_APP_VNPAY_HOST ||
              "https://sandbox.vnpayment.vn";
            const token = String(r.data?.token || "");
            if (token) {
              window.location.href = `${vnpHost}/paymentv2/TransactionPaymentMethod.html?token=${token}`;
              return;
            }
            const payUrl = String(r.data?.payUrl || "");
            if (payUrl) {
              window.location.href = payUrl;
              return;
            }
          } catch {}
          const linkRes = await http.post(`/orders/${newId}/pay/link`, null, {
            params: {
              provider: pm,
              returnUrl: `${origin}/order-success?id=${newId}`,
            },
          });
          const vnpHost =
            process.env.REACT_APP_VNPAY_HOST || "https://sandbox.vnpayment.vn";
          const token = String(linkRes.data?.token || "");
          if (token) {
            window.location.href = `${vnpHost}/paymentv2/TransactionPaymentMethod.html?token=${token}`;
            return;
          }
          const payUrl = String(linkRes.data?.payUrl || "");
          if (payUrl) {
            window.location.href = payUrl;
            return;
          }
        } else if (pm === "MOMO") {
          try {
            const r = await http.post(
              `/orders/${newId}/pay/momo/create`,
              null,
              {
                params: { returnUrl: `${origin}/order-success` },
              }
            );
            const payUrl = String(r.data?.payUrl || "");
            if (payUrl) {
              window.location.href = payUrl;
              return;
            }
          } catch {}
          const linkRes = await http.post(`/orders/${newId}/pay/link`, null, {
            params: { provider: pm, returnUrl: `${origin}/order-success` },
          });
          const payUrl = String(linkRes.data?.payUrl || "");
          if (payUrl) {
            window.location.href = payUrl;
            return;
          }
        }
        navigate(`/order-success?id=${newId}`);
      }
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
  const fmtMoney = (n: number) => {
    const currency = localStorage.getItem("currency") || "VND";
    const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
    if (currency === "USD")
      return `$${(Number(n || 0) / rate).toLocaleString("en-US")}`;
    return `${Number(n || 0).toLocaleString("vi-VN")} ₫`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        {t("checkout.title")}
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {successOrderId !== null && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "#e8f5e9",
            border: "1px solid #c8e6c9",
          }}
        >
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("checkout.success")}
            </Typography>
            <Typography variant="body2">
              Mã đơn #{successOrderId}
              {lastOrderTotal !== null ? ` • Tổng ${lastOrderTotal} ₫` : ""}
            </Typography>
          </Box>
          <Button component={Link} to="/orders" variant="outlined">
            {t("checkout.viewOrders")}
          </Button>
          <Button
            component={Link}
            to={`/orders/${successOrderId}`}
            variant="contained"
            color="success"
          >
            {t("checkout.viewOrderDetail")}
          </Button>
        </Paper>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "1fr 380px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={1}>
            {t("checkout.shipping.title")}
          </Typography>
          <RadioGroup
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="SAVER"
              control={<Radio />}
              label={t("checkout.shipping.saver")}
            />
            <FormControlLabel
              value="FAST"
              control={<Radio />}
              label={t("checkout.shipping.fast")}
            />
          </RadioGroup>
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingIcon color="primary" />
                <Typography variant="subtitle2">
                  {shippingMethod === "SAVER"
                    ? t("checkout.shipping.saver")
                    : t("checkout.shipping.fast")}
                </Typography>
              </Box>
              <Chip
                label={
                  shipFee === 0
                    ? lang === "en"
                      ? "FREE"
                      : "MIỄN PHÍ"
                    : fmtMoney(shipFee)
                }
                color={shipFee === 0 ? "success" : "default"}
                size="small"
              />
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {deliveryEtaText()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {shipFee > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {lang === "en"
                    ? `Add ${fmtMoney(freeRemain)} more for free shipping`
                    : `Cần thêm ${fmtMoney(freeRemain)} để miễn phí vận chuyển`}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={freeProgress}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            )}
            {items.map((i: any) => (
              <Box
                key={i.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                }}
              >
                <Typography variant="body2">{i.name}</Typography>
                <Typography variant="body2">SL: {i.quantity}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocalOfferIcon color="secondary" />
              <Typography variant="subtitle2">
                {t("checkout.voucher.title")}
              </Typography>
            </Box>
            <input
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              style={{ width: "100%", padding: 8 }}
              placeholder={t("checkout.voucher.placeholder")}
            />
          </Box>

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
              value="MOMO"
              control={<Radio />}
              label={t("checkout.payment.momo")}
            />
            <FormControlLabel
              value="VNPAY"
              control={<Radio />}
              label={t("checkout.payment.vnpay")}
            />
          </RadioGroup>

          <Box
            sx={{
              p: 2,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" mb={1}>
              Ưu đãi thanh toán thẻ
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip label="Giảm 30k" size="small" />
              <Chip label="Giảm 50k" size="small" />
              <Chip label="Freeship" size="small" />
              <Chip label="Giảm 8%" size="small" />
            </Box>
          </Box>
          {/* Chỉ hiển thị COD, VNPAY, MoMo theo yêu cầu */}
          {paymentMethod === "VNPAY" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" mb={1}>
                {t("checkout.payment.section.vnpay")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <QrCodeIcon color="primary" />
                <Typography variant="caption">
                  {t("checkout.payment.section.simulated")}
                </Typography>
              </Box>
            </Box>
          )}
          {paymentMethod === "MOMO" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" mb={1}>
                {t("checkout.payment.section.momo")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon color="secondary" />
                <Typography variant="caption">
                  {t("checkout.payment.section.simulated")}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" mb={0.5}>
                  {t("checkout.shipTo")}
                </Typography>
                <Typography variant="body2">
                  {shippingAddress || t("checkout.noAddress")}
                </Typography>
              </Box>
              <Button size="small" onClick={() => setShowShipAddrs((v) => !v)}>
                {t("checkout.change")}
              </Button>
            </Box>
            {showShipAddrs && (
              <Box sx={{ mt: 1 }}>
                <input
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder={
                    lang === "en"
                      ? "Enter shipping address"
                      : "Nhập địa chỉ giao hàng"
                  }
                  style={{ width: "100%", padding: 8, marginBottom: 8 }}
                />
                {shippingBook.map((a) => (
                  <Box
                    key={a.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <input
                        type="radio"
                        name="ship_addr"
                        checked={shippingAddress === a.line}
                        onChange={() => setShippingAddress(a.line)}
                      />
                      <Typography variant="body2">
                        {a.line}
                        {a.isDefault
                          ? lang === "en"
                            ? " (Default)"
                            : " (Mặc định)"
                          : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" onClick={() => editAddress(a)}>
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteAddress(a.id)}
                      >
                        Xóa
                      </Button>
                      {!a.isDefault && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => setDefault(a)}
                        >
                          Mặc định
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addAddress("SHIPPING")}
                >
                  {t("checkout.saveCurrentAddress")}
                </Button>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalOfferIcon color="primary" />
                <Typography variant="subtitle2">
                  {t("checkout.promos.title")}
                </Typography>
              </Box>
              <Button size="small" onClick={() => setApplyPromo((v) => !v)}>
                {applyPromo
                  ? t("checkout.promos.remove")
                  : t("checkout.promos.apply")}
              </Button>
            </Box>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label="Giảm 30K"
                color={applyPromo ? "primary" : "default"}
                size="small"
              />
              <Switch
                checked={applyShipVoucher}
                onChange={(e) => setApplyShipVoucher(e.target.checked)}
              />
              <Typography variant="caption">
                {lang === "en" ? "Shipping discount" : "Giảm giá vận chuyển"}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MonetizationOnIcon color="disabled" />
                <Typography variant="subtitle2">
                  Thanh toán bằng Tiki Xu
                </Typography>
              </Box>
              <Switch
                checked={applyTikiXu}
                disabled
                onChange={(e) => setApplyTikiXu(e.target.checked)}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Bạn không có đủ Tiki Xu
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>
              {t("checkout.summary.title")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  {t("checkout.summary.itemsTotal")}
                </Typography>
                <Typography variant="body2">{fmtMoney(total)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  {t("checkout.summary.shippingFee")}
                </Typography>
                <Typography variant="body2">{fmtMoney(shipFee)}</Typography>
              </Box>
              {shipDiscount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    {t("checkout.summary.shippingDiscount")}
                  </Typography>
                  <Typography variant="body2">
                    -{fmtMoney(shipDiscount)}
                  </Typography>
                </Box>
              )}
              {promoDiscount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    {t("checkout.summary.promoDiscount")}
                  </Typography>
                  <Typography variant="body2">
                    -{fmtMoney(promoDiscount)}
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2">
                {t("checkout.summary.totalPayable")}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {fmtMoney(finalTotal)}
              </Typography>
            </Box>
            {savedAmount > 0 && (
              <Typography
                variant="caption"
                sx={{ color: "success.main", mb: 1, display: "block" }}
              >
                Tiết kiệm {fmtMoney(savedAmount)}
              </Typography>
            )}
            <Button
              sx={{ mt: 1 }}
              onClick={handleCheckout}
              disabled={
                loading || items.length === 0 || !shippingAddress.trim()
              }
              variant="contained"
              color="error"
              fullWidth
            >
              {loading ? t("checkout.processing") : t("checkout.placeOrder")}
            </Button>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "text.secondary" }}
            >
              Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các
              chi phí phát sinh khác
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
