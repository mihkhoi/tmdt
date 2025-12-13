import { useEffect, useState, useCallback } from "react";
import http from "../api/http";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Chip,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
  Box,
  Tabs,
  Tab,
  Tooltip,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Alert,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { useI18n } from "../i18n";
import { formatCurrency } from "../utils/currencyUtils";
import { useTheme } from "@mui/material/styles";

const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
const toAbs = (u: string) =>
  u && u.startsWith("/uploads/") ? apiOrigin + u : u;

type OrderItem = {
  product: { id: number; name: string; nameEn?: string; imageUrl?: string };
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  status: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

const TABS = [
  { key: "", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "PROCESSING", label: "Chờ giao hàng" },
  { key: "SHIPPED", label: "Vận chuyển" },
  { key: "DELIVERED", label: "Hoàn thành" },
  { key: "CANCELED", label: "Đã hủy" },
];

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const df = dateFrom ? `${dateFrom}T00:00:00` : undefined;
      const dt = dateTo ? `${dateTo}T23:59:59` : undefined;
      const res = await http.get("/orders/my", {
        params: {
          status: statusFilter || undefined,
          keyword: keyword || searchId || undefined,
          dateFrom: df,
          dateTo: dt,
          page: page - 1,
          size: 10,
        },
      });
      const content = Array.isArray(res.data?.content) ? res.data.content : [];
      setOrders(content);
      setTotalPages(
        typeof res.data?.totalPages === "number" ? res.data.totalPages : 1
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, dateFrom, dateTo, keyword, searchId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (id: number) => {
    if (
      !window.confirm(
        lang === "en"
          ? "Cancel this order?"
          : "Bạn có chắc muốn hủy đơn hàng này?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await http.put(`/orders/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchOrders();
    } catch (e) {
      console.error(e);
      alert(
        lang === "en"
          ? "Cannot cancel order. Only PENDING orders can be canceled."
          : "Không thể hủy đơn. Chỉ hủy được khi trạng thái PENDING."
      );
    }
  };

  const getStatusColor = (s: string) => {
    const v = (s || "").toUpperCase();
    if (v === "PENDING") return "#FFC120";
    if (v === "PAID" || v === "CONFIRMED") return "#1A94FF";
    if (v === "SHIPPED") return "#1A94FF";
    if (v === "DELIVERED") return "#4CAF50";
    if (v === "CANCELED" || v === "CANCEL") return "#FF424E";
    return "#999";
  };

  const getStatusLabel = (s: string) => {
    const v = (s || "").toUpperCase();
    if (v === "PENDING")
      return lang === "en" ? "Pending Payment" : "Chờ thanh toán";
    if (v === "PAID" || v === "CONFIRMED")
      return lang === "en" ? "Confirmed" : "Đã xác nhận";
    if (v === "SHIPPED") return lang === "en" ? "Shipping" : "Đang giao hàng";
    if (v === "DELIVERED") return lang === "en" ? "Delivered" : "Đã giao hàng";
    if (v === "CANCELED") return lang === "en" ? "Canceled" : "Đã hủy";
    return s;
  };

  const cannotCancel = (o: Order) => {
    const st = String(o.status).toUpperCase();
    const pm = String(o.paymentMethod || "").toUpperCase();
    if (pm === "MOMO") return true;
    return st !== "PENDING";
  };

  // Backend already filters by statusFilter, so we only need to filter by searchId if provided
  const filteredOrders = orders.filter(
    (o) => !searchId || String(o.id) === searchId.trim()
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
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#333",
              mb: 0.5,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {lang === "en" ? "My Orders" : "Đơn hàng của tôi"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lang === "en"
              ? "View and manage your orders"
              : "Xem và quản lý đơn hàng của bạn"}
          </Typography>
        </Box>

        {/* Tabs - Tiki Style */}
        <Card
          sx={{
            mb: 3,
            border: "1px solid #E8E8E8",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#F5F5F5" }}
          >
            <Tabs
              value={TABS.findIndex((t) => t.key === statusFilter)}
              onChange={(_, i) => {
                setStatusFilter(TABS[i].key);
                setPage(1);
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  minHeight: 48,
                },
                "& .Mui-selected": {
                  color: "#1A94FF",
                },
                "& .MuiTabs-indicator": {
                  bgcolor: "#1A94FF",
                  height: 3,
                },
              }}
            >
              {TABS.map((t) => (
                <Tab key={t.key} label={t.label} />
              ))}
            </Tabs>
          </Box>

          {/* Filters - Tiki Style */}
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                label={lang === "en" ? "Order ID" : "Mã đơn"}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                sx={{ minWidth: 120 }}
              />
              <TextField
                size="small"
                type="date"
                label={lang === "en" ? "From" : "Từ ngày"}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />
              <TextField
                size="small"
                type="date"
                label={lang === "en" ? "To" : "Đến ngày"}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setPage(1);
                  fetchOrders();
                }}
                sx={{
                  bgcolor: "#1A94FF",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#0D7AE6",
                  },
                }}
              >
                {lang === "en" ? "Filter" : "Lọc"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const fmt = (d: Date) => d.toISOString().slice(0, 10);
                  const d = new Date();
                  const today = fmt(d);
                  setDateFrom(today);
                  setDateTo(today);
                  setPage(1);
                  fetchOrders();
                }}
                sx={{
                  textTransform: "none",
                  borderColor: "#1A94FF",
                  color: "#1A94FF",
                  "&:hover": {
                    borderColor: "#0D7AE6",
                    bgcolor: "rgba(26,148,255,0.1)",
                  },
                }}
              >
                {lang === "en" ? "Today" : "Hôm nay"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const fmt = (d: Date) => d.toISOString().slice(0, 10);
                  const d = new Date();
                  const last7 = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
                  setDateFrom(fmt(last7));
                  setDateTo(fmt(d));
                  setPage(1);
                  fetchOrders();
                }}
                sx={{
                  textTransform: "none",
                  borderColor: "#1A94FF",
                  color: "#1A94FF",
                  "&:hover": {
                    borderColor: "#0D7AE6",
                    bgcolor: "rgba(26,148,255,0.1)",
                  },
                }}
              >
                {lang === "en" ? "Last 7 days" : "7 ngày qua"}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setStatusFilter("");
                  setSearchId("");
                  setDateFrom("");
                  setDateTo("");
                  setKeyword("");
                  setPage(1);
                  fetchOrders();
                }}
                sx={{
                  textTransform: "none",
                  borderColor: "#999",
                  color: "#666",
                  "&:hover": {
                    borderColor: "#666",
                    bgcolor: "#F5F5F5",
                  },
                }}
              >
                {lang === "en" ? "Clear" : "Xóa bộ lọc"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Orders List - Tiki Style */}
        {loading ? (
          <Card
            sx={{
              border: "1px solid #E8E8E8",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Typography>
              {lang === "en" ? "Loading..." : "Đang tải..."}
            </Typography>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card
            sx={{
              border: "1px solid #E8E8E8",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <ReceiptIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: "#666" }}>
              {lang === "en" ? "No orders found" : "Chưa có đơn hàng"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {lang === "en"
                ? "You haven't placed any orders yet"
                : "Bạn chưa có đơn hàng nào"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#1A94FF",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {lang === "en" ? "Start Shopping" : "Bắt đầu mua sắm"}
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredOrders.map((o) => (
              <Card
                key={o.id}
                sx={{
                  border: "1px solid #E8E8E8",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  bgcolor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    borderColor: "#1A94FF",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Order Header */}
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: "#F5F5F5",
                    borderBottom: "1px solid #E8E8E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <ReceiptIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#333" }}
                      >
                        {lang === "en" ? "Order" : "Đơn hàng"} #{o.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(o.createdAt).toLocaleString(
                          lang === "en" ? "en-US" : "vi-VN"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Chip
                      label={getStatusLabel(o.status)}
                      sx={{
                        bgcolor: getStatusColor(o.status),
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    />
                    {(() => {
                      const pm = String(o.paymentMethod || "").toUpperCase();
                      if (pm === "VNPAY")
                        return (
                          <Chip
                            icon={<QrCodeIcon sx={{ fontSize: 14 }} />}
                            label="VNPay"
                            size="small"
                            sx={{
                              bgcolor: "#1A94FF",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        );
                      if (pm === "MOMO")
                        return (
                          <Chip
                            icon={
                              <AccountBalanceWalletIcon sx={{ fontSize: 14 }} />
                            }
                            label="MoMo"
                            size="small"
                            sx={{
                              bgcolor: "#A50064",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        );
                      if (pm === "COD")
                        return (
                          <Chip
                            label="COD"
                            size="small"
                            sx={{
                              bgcolor: "#666",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        );
                      return null;
                    })()}
                  </Box>
                </Box>

                {/* Order Items */}
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {o.items?.map((it, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          gap: 2,
                          pb: idx < o.items.length - 1 ? 2 : 0,
                          borderBottom:
                            idx < o.items.length - 1
                              ? "1px solid #E8E8E8"
                              : "none",
                        }}
                      >
                        {it.product?.imageUrl && (
                          <Box
                            component="img"
                            src={toAbs(it.product.imageUrl)}
                            alt={it.product.name || it.product.nameEn || ""}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid #E8E8E8",
                            }}
                          />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {lang === "en" && it.product?.nameEn
                              ? it.product.nameEn
                              : it.product?.name || ""}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lang === "en" ? "Quantity" : "Số lượng"}:{" "}
                            {it.quantity}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 700, color: "#FF424E" }}
                        >
                          {formatCurrency(it.subtotal)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Footer */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {lang === "en" ? "Total" : "Tổng cộng"}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#FF424E",
                          fontSize: "1.3rem",
                        }}
                      >
                        {formatCurrency(o.totalAmount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/orders/${o.id}`}
                        startIcon={<VisibilityIcon />}
                        sx={{
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
                        {lang === "en" ? "View Details" : "Xem chi tiết"}
                      </Button>
                      {!cannotCancel(o) && (
                        <Tooltip
                          title={
                            lang === "en" ? "Cancel order" : "Hủy đơn hàng"
                          }
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => cancelOrder(o.id)}
                            sx={{
                              textTransform: "none",
                              fontWeight: 600,
                              borderColor: "#FF424E",
                              color: "#FF424E",
                              "&:hover": {
                                borderColor: "#E53935",
                                bgcolor: "rgba(255,66,78,0.1)",
                              },
                            }}
                          >
                            {lang === "en" ? "Cancel" : "Hủy đơn"}
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              bgcolor: "#fff",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 600,
                  "&.Mui-selected": {
                    bgcolor: "#1A94FF",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "#0D7AE6",
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyOrdersPage;
