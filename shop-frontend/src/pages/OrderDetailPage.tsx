import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../api/http";
<<<<<<< HEAD
import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  IconButton,
  Alert,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useI18n } from "../i18n";
import { formatCurrency } from "../utils/currencyUtils";
import { useTheme } from "@mui/material/styles";
import { getProductName } from "../utils/productUtils";
=======
import { Chip, Button, Tooltip } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [order, setOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
=======
  const [status, setStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;

  const fetchOrder = useCallback(async () => {
    if (!id) return;
<<<<<<< HEAD
    try {
      const res = await http.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to load order:", error);
    }
  }, [id]);

  const fetchTimeline = useCallback(async () => {
    if (!id) return;
    try {
      const res = await http.get(`/orders/${id}/timeline`);
      setTimeline(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load timeline:", error);
    }
=======
    const res = await http.get(`/orders/${id}`);
    setStatus(String(res.data?.status || ""));
    setPaymentMethod(String(res.data?.paymentMethod || ""));
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrder(), fetchTimeline()]);
      setLoading(false);
    };
    loadData();
  }, [fetchOrder, fetchTimeline]);

  const getStatusColor = (status: string) => {
    const s = String(status).toUpperCase();
    if (s === "PENDING") return "#FFC120";
    if (s === "PAID") return "#4CAF50";
    if (s === "SHIPPING") return "#1A94FF";
    if (s === "DELIVERED") return "#4CAF50";
    if (s === "CANCELED") return "#FF424E";
    return "#999";
  };

  const getStatusLabel = (status: string) => {
    const s = String(status).toUpperCase();
    if (s === "PENDING")
      return lang === "en" ? "Pending Payment" : "Chờ thanh toán";
    if (s === "PAID") return lang === "en" ? "Paid" : "Đã thanh toán";
    if (s === "SHIPPING") return lang === "en" ? "Shipping" : "Đang giao hàng";
    if (s === "DELIVERED") return lang === "en" ? "Delivered" : "Đã giao hàng";
    if (s === "CANCELED") return lang === "en" ? "Canceled" : "Đã hủy";
    return status;
  };

  const getStatusIcon = (status: string) => {
    const s = String(status).toUpperCase();
    if (s === "PENDING") return <AccessTimeIcon />;
    if (s === "PAID" || s === "DELIVERED") return <CheckCircleIcon />;
    if (s === "SHIPPING") return <LocalShippingIcon />;
    if (s === "CANCELED") return <CancelIcon />;
    return <ReceiptIcon />;
  };

  const handleCancel = async () => {
    if (!id) return;
    if (
      !window.confirm(
        lang === "en" ? "Cancel this order?" : "Hủy đơn hàng này?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await http.put(`/orders/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchOrder();
      await fetchTimeline();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(
        lang === "en" ? "Failed to cancel order" : "Không thể hủy đơn hàng"
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>{lang === "en" ? "Loading..." : "Đang tải..."}</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {lang === "en" ? "Order not found" : "Không tìm thấy đơn hàng"}
        </Alert>
      </Box>
    );
  }

  const status = String(order.status || "").toUpperCase();
  const paymentMethod = String(order.paymentMethod || "").toUpperCase();
  const canCancel = status === "PENDING" && paymentMethod !== "MOMO";

  return (
<<<<<<< HEAD
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => navigate("/orders")}
            sx={{ color: "#1A94FF" }}
          >
            <ShoppingBagIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 0.5,
              }}
            >
              {lang === "en" ? "Order Details" : "Chi tiết đơn hàng"} #{id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString(
                    lang === "en" ? "en-US" : "vi-VN"
                  )
                : ""}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(status)}
            label={getStatusLabel(status)}
            sx={{
              bgcolor: getStatusColor(status),
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              px: 2,
              py: 2.5,
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Left Column - Order Items & Timeline */}
        <Box>
          {/* Order Items */}
          <Card sx={{ mb: 3, border: "1px solid #E8E8E8" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <ReceiptIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {lang === "en" ? "Order Items" : "Sản phẩm đơn hàng"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {order.items &&
              Array.isArray(order.items) &&
              order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
                  <Box key={idx}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {item.product?.imageUrl && (
                        <Box
                          component="img"
                          src={toAbs(item.product.imageUrl)}
                          alt={getProductName(item.product, lang)}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid #E8E8E8",
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {getProductName(item.product, lang)}
                        </Typography>
                        {item.product?.brand && (
                          <Chip
                            label={item.product.brand}
                            size="small"
                            sx={{
                              bgcolor: "#E8F4FD",
                              color: "#1A94FF",
                              mb: 1,
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {lang === "en" ? "Quantity" : "Số lượng"}:{" "}
                            {item.quantity}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "#FF424E" }}
                          >
                            {formatCurrency(item.subtotal || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {idx < order.items.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  {lang === "en" ? "No items" : "Không có sản phẩm"}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card sx={{ border: "1px solid #E8E8E8" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <LocalShippingIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {lang === "en" ? "Order Timeline" : "Lịch sử đơn hàng"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {timeline.length > 0 ? (
                <Stepper orientation="vertical">
                  {timeline.map((step: any, idx: number) => (
                    <Step
                      key={step.id || idx}
                      active={true}
                      completed={idx < timeline.length - 1}
                    >
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              bgcolor: getStatusColor(step.status),
                              width: 32,
                              height: 32,
                            }}
                          >
                            {getStatusIcon(step.status)}
                          </Avatar>
                        )}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {getStatusLabel(step.status)}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {new Date(step.createdAt).toLocaleString(
                            lang === "en" ? "en-US" : "vi-VN"
                          )}
                        </Typography>
                        {step.note && (
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {step.note}
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              ) : (
                <Typography color="text.secondary">
                  {lang === "en" ? "No timeline data" : "Chưa có lịch sử"}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Order Summary & Actions */}
        <Box>
          {/* Order Summary */}
          <Card sx={{ mb: 3, border: "1px solid #E8E8E8" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {lang === "en" ? "Order Summary" : "Tóm tắt đơn hàng"}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {lang === "en" ? "Subtotal" : "Tạm tính"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatCurrency(order.subtotal || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {lang === "en" ? "Shipping" : "Phí vận chuyển"}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {order.shippingFee
                    ? formatCurrency(order.shippingFee)
                    : lang === "en"
                    ? "Free"
                    : "Miễn phí"}
                </Typography>
              </Box>
              {order.discount && order.discount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {lang === "en" ? "Discount" : "Giảm giá"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#4CAF50" }}
                  >
                    -{formatCurrency(order.discount)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {lang === "en" ? "Total" : "Tổng cộng"}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#FF424E", fontSize: "1.5rem" }}
                >
                  {formatCurrency(order.totalAmount || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          {order.deliveryAddress && (
            <Card sx={{ mb: 3, border: "1px solid #E8E8E8" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <LocationOnIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {lang === "en" ? "Delivery Address" : "Địa chỉ giao hàng"}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                  {order.deliveryAddress}
                </Typography>
                {order.deliveryPhone && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 16, color: "#666" }} />
                    <Typography variant="body2" color="text.secondary">
                      {order.deliveryPhone}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card sx={{ mb: 3, border: "1px solid #E8E8E8" }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <PaymentIcon sx={{ color: "#1A94FF", fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {lang === "en" ? "Payment Method" : "Phương thức thanh toán"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {paymentMethod === "VNPAY" && (
                <Chip
                  icon={<QrCodeIcon />}
                  label="VNPay"
                  sx={{
                    bgcolor: "#1A94FF",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              )}
              {paymentMethod === "MOMO" && (
                <Chip
                  icon={<AccountBalanceWalletIcon />}
                  label="MoMo"
                  sx={{
                    bgcolor: "#A50064",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              )}
              {paymentMethod === "COD" && (
                <Chip
                  label="COD"
                  sx={{
                    bgcolor: "#666",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleCancel}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: "#FF424E",
                color: "#FF424E",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#E53935",
                  bgcolor: "rgba(255,66,78,0.1)",
                },
              }}
            >
              {lang === "en" ? "Cancel Order" : "Hủy đơn hàng"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
=======
    <div style={{ padding: 30 }}>
      <h2>Chi tiết đơn #{id}</h2>
      <div style={{ marginBottom: 12 }}>
        <Chip label={status} color={String(status).toUpperCase()==="PENDING"?"warning":"default" as any} size="small" />
        {(() => {
          const pm = String(paymentMethod).toUpperCase();
          if (pm === "VNPAY") return <Chip icon={<QrCodeIcon />} label="VNPAY" size="small" color="primary" style={{ marginLeft: 8 }} />;
          if (pm === "MOMO") return <Chip icon={<AccountBalanceWalletIcon />} label="MoMo" size="small" color="secondary" style={{ marginLeft: 8 }} />;
          if (pm === "COD") return <Chip label="COD" size="small" color="default" style={{ marginLeft: 8 }} />;
          return null;
        })()}
        <Tooltip
          title={(() => {
            const pm = String(paymentMethod).toUpperCase();
            const st = String(status).toUpperCase();
            if (pm === "MOMO") return "Không thể hủy với MoMo";
            if (st !== "PENDING") return "Chỉ hủy khi trạng thái PENDING";
            return "";
          })()}
        >
          <span>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={String(status).toUpperCase() !== "PENDING" || String(paymentMethod).toUpperCase() === "MOMO"}
              style={{ marginLeft: 8 }}
              onClick={async () => {
                const token = localStorage.getItem("token");
                await http.put(`/orders/${id}/cancel`, null, { headers: { Authorization: `Bearer ${token}` } });
                await fetchTimeline();
                await fetchOrder();
              }}
            >
              Hủy đơn
            </Button>
          </span>
        </Tooltip>
      </div>
      <ul>
        {timeline.map((it) => (
          <li key={it.id}>{new Date(it.createdAt).toLocaleString()} — {it.status} — {it.note}</li>
        ))}
      </ul>
    </div>
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
  );
};

export default OrderDetailPage;
