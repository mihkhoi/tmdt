import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptIcon from "@mui/icons-material/Receipt";
import http from "../api/http";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import PaymentStatusTracker from "../components/PaymentStatusTracker";
import { useI18n } from "../i18n";
import { formatCurrency } from "../utils/currencyUtils";
import { useTheme } from "@mui/material/styles";

const OrderSuccessPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const id = Number(sp.get("id") || 0);
  const [order, setOrder] = useState<any>(null);
  const [suggest, setSuggest] = useState<any[]>([]);
  const { t, lang } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const loadOrder = useCallback(async () => {
    if (!id) return;
    try {
      const res = await http.get(`/orders/${id}`);
      setOrder(res.data);
    } catch {}
  }, [id]);

  const loadSuggest = useCallback(async () => {
    try {
      const res = await productApi.getProductsPage({
        sort: "rating_desc",
        page: 0,
        size: 8,
      });
      const list = Array.isArray((res as any)?.content)
        ? (res as any).content
        : [];
      setSuggest(list);
    } catch {
      setSuggest([]);
    }
  }, []);

  useEffect(() => {
    loadOrder();
    loadSuggest();
  }, [loadOrder, loadSuggest]);
  useEffect(() => {
    const vnpRef = sp.get("vnp_TxnRef");
    const vnpHash = sp.get("vnp_SecureHash");
    if (
      vnpRef &&
      vnpHash &&
      order &&
      String(order.status).toUpperCase() === "PENDING"
    ) {
      const doConfirm = async () => {
        try {
          await http.post(`/orders/${vnpRef}/pay/vnpay/confirm`, null, {
            params: Object.fromEntries((sp as any).entries()),
          });
          await loadOrder();
        } catch {}
      };
      doConfirm();
    }
  }, [sp, order, loadOrder]);
  useEffect(() => {
    const paid = sp.get("paid") === "true";
    const provider = sp.get("provider") || "";
    if (
      id &&
      paid &&
      order &&
      String(order.status).toUpperCase() === "PENDING"
    ) {
      const doPay = async () => {
        try {
          const token = localStorage.getItem("token");
          await http.post(`/orders/${id}/pay/simulate`, null, {
            params: { method: String(provider).toUpperCase() },
            headers: { Authorization: `Bearer ${token}` },
          });
          await loadOrder();
        } catch {}
      };
      doPay();
    }
  }, [id, sp, order, loadOrder]);
  useEffect(() => {
    const moOrderId = sp.get("orderId");
    const moResult = sp.get("resultCode");
    if (
      moOrderId &&
      moResult &&
      order &&
      String(order.status).toUpperCase() === "PENDING"
    ) {
      const idStr = String(moOrderId).replace(/[^0-9]/g, "");
      if (!idStr) return;
      const doConfirm = async () => {
        try {
          await http.post(`/orders/${idStr}/pay/momo/confirm`, null, {
            params: Object.fromEntries((sp as any).entries()),
          });
          await loadOrder();
        } catch {}
      };
      doConfirm();
    }
  }, [sp, order, loadOrder]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
      {/* Success Header - VNPay Style */}
      <Card
        sx={{
          mb: 3,
          border: "2px solid #4CAF50",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(76, 175, 80, 0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
            color: "#fff",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "16px",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t("checkout.success")}
            </Typography>
            {id ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {lang === "en" ? "Order ID" : "Mã đơn hàng"}: #{id}
                </Typography>
                {order?.totalAmount && (
                  <>
                    <Typography sx={{ opacity: 0.7 }}>•</Typography>
                    <Typography
                      variant="body1"
                      sx={{ opacity: 0.9, fontWeight: 600 }}
                    >
                      {lang === "en" ? "Total" : "Tổng"}:{" "}
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t("checkout.success")}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              component={Link}
              to="/orders"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {t("checkout.viewOrders")}
            </Button>
            {id && (
              <Button
                component={Link}
                to={`/orders/${id}`}
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#4CAF50",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
              >
                {t("checkout.viewOrderDetail")}
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      {order && Array.isArray(order.items) && (
        <Card
          sx={{
            mb: 3,
            border: "1px solid #E0E0E0",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <ReceiptIcon sx={{ color: "#1E88E5", fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {lang === "en" ? "Order Summary" : "Tóm tắt đơn"}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {order.items.map((it: any, idx: number) => (
              <Box key={`${it.product?.id}-${it.quantity}`}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1.5,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {it.product?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lang === "en" ? "Quantity" : "Số lượng"}: {it.quantity}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "#1E88E5",
                      minWidth: 100,
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency(it.subtotal)}
                  </Typography>
                </Box>
                {idx < order.items.length - 1 && <Divider />}
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                bgcolor: "#F5F5F5",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {lang === "en" ? "Total" : "Tổng cộng"}:
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1E88E5", fontSize: "1.5rem" }}
              >
                {formatCurrency(order.totalAmount)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {order &&
        String(order.status).toUpperCase() === "PENDING" &&
        ["VNPAY", "MOMO"].includes(
          String(order.paymentMethod).toUpperCase()
        ) && (
          <Box sx={{ mb: 3 }}>
            <PaymentStatusTracker
              orderId={id}
              paymentMethod={
                String(order.paymentMethod).toUpperCase() as "VNPAY" | "MOMO"
              }
              onSuccess={() => loadOrder()}
            />
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    await http.post(`/orders/${id}/pay/simulate`, null, {
                      params: {
                        method: String(order.paymentMethod).toUpperCase(),
                      },
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    await loadOrder();
                  } catch {}
                }}
              >
                {t("orderSuccess.payNow")}
              </Button>
            </Box>
          </Box>
        )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <ShoppingBagIcon sx={{ color: "#1E88E5", fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {lang === "en" ? "You may also like" : "Có thể bạn sẽ thích"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {suggest.map((p: any) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => navigate(`/product/${p.id}`)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default OrderSuccessPage;
