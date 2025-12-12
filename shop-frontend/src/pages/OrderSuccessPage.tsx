import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import http from "../api/http";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";
<<<<<<< HEAD
import { useI18n } from "../i18n";
=======
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2

const OrderSuccessPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const id = Number(sp.get("id") || 0);
  const [order, setOrder] = useState<any>(null);
  const [suggest, setSuggest] = useState<any[]>([]);
<<<<<<< HEAD
  const { t } = useI18n();
=======
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2

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
<<<<<<< HEAD
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
=======
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2

  const fmt = (n: number | string) => {
    const currency = localStorage.getItem("currency") || "VND";
    const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
    if (currency === "USD")
      return `$${(Number(n || 0) / rate).toLocaleString("en-US")}`;
    return `${Number(n || 0).toLocaleString("vi-VN")} ₫`;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
      <Paper
        sx={{ p: 3, mb: 3, display: "flex", alignItems: "center", gap: 2 }}
      >
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
<<<<<<< HEAD
            {t("checkout.success")}
=======
            Đặt hàng thành công
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          </Typography>
          {id ? (
            <Typography variant="body2">
              Mã đơn #{id}
              {order?.totalAmount ? ` • Tổng ${fmt(order.totalAmount)}` : ""}
            </Typography>
          ) : (
<<<<<<< HEAD
            <Typography variant="body2">{t("checkout.success")}</Typography>
          )}
        </Box>
        <Button component={Link} to="/orders" variant="outlined">
          {t("checkout.viewOrders")}
=======
            <Typography variant="body2">
              Đơn hàng của bạn đã được ghi nhận
            </Typography>
          )}
        </Box>
        <Button component={Link} to="/orders" variant="outlined">
          Xem Đơn Mua
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
        </Button>
        {id ? (
          <Button
            component={Link}
            to={`/orders/${id}`}
            variant="contained"
            color="success"
          >
<<<<<<< HEAD
            {t("checkout.viewOrderDetail")}
=======
            Xem chi tiết đơn
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          </Button>
        ) : null}
      </Paper>

      {order && Array.isArray(order.items) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" mb={1}>
            Tóm tắt đơn
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {order.items.map((it: any) => (
            <Box
              key={`${it.product?.id}-${it.quantity}`}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                {it.product?.name} x {it.quantity}
              </Typography>
              <Typography variant="body2">{fmt(it.subtotal)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">
            Tổng: {fmt(order.totalAmount)}
          </Typography>
        </Paper>
      )}

<<<<<<< HEAD
      {order &&
        String(order.status).toUpperCase() === "PENDING" &&
        ["VNPAY", "MOMO"].includes(
          String(order.paymentMethod).toUpperCase()
        ) && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
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
        )}
=======
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      <Typography variant="h6" mb={2}>
        Có thể bạn sẽ thích
      </Typography>
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
