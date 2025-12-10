import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import http from "../api/http";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";

const OrderSuccessPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const id = Number(sp.get("id") || 0);
  const [order, setOrder] = useState<any>(null);
  const [suggest, setSuggest] = useState<any[]>([]);

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
            Đặt hàng thành công
          </Typography>
          {id ? (
            <Typography variant="body2">
              Mã đơn #{id}
              {order?.totalAmount ? ` • Tổng ${fmt(order.totalAmount)}` : ""}
            </Typography>
          ) : (
            <Typography variant="body2">
              Đơn hàng của bạn đã được ghi nhận
            </Typography>
          )}
        </Box>
        <Button component={Link} to="/orders" variant="outlined">
          Xem Đơn Mua
        </Button>
        {id ? (
          <Button
            component={Link}
            to={`/orders/${id}`}
            variant="contained"
            color="success"
          >
            Xem chi tiết đơn
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
