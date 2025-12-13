import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

interface PaymentStatusTrackerProps {
  orderId: number;
  paymentMethod: "VNPAY" | "MOMO";
  onSuccess?: () => void;
  onError?: () => void;
}

const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  orderId,
  paymentMethod,
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [status, setStatus] = useState<
    "pending" | "checking" | "paid" | "failed"
  >("pending");

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    const checkStatus = async () => {
      try {
        // Don't override terminal states
        setStatus((prev) => {
          if (prev === "paid" || prev === "failed") return prev;
          return "checking";
        });

        const res = await http.get(`/orders/${orderId}`);
        const orderData = res.data;
        const next = String(orderData?.status || "").toUpperCase();

        if (next === "PAID") {
          setStatus("paid");
          if (onSuccess) onSuccess();
          setTimeout(() => {
            if (!cancelled) navigate(`/order-success?id=${orderId}`);
          }, 2000);
          return;
        }

        if (next === "CANCELED") {
          setStatus("failed");
          if (onError) onError();
          return;
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
      }
    };

    // Check immediately
    checkStatus();

    // Poll every 3 seconds
    const interval = setInterval(checkStatus, 3000);

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      setStatus((prev) =>
        prev === "pending" || prev === "checking" ? "failed" : prev
      );
      clearInterval(interval);
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, onSuccess, onError, navigate]);

  const isVNPay = paymentMethod === "VNPAY";
  const primaryColor = isVNPay ? "#1E88E5" : "#A50064";
  const gradient = isVNPay
    ? "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)"
    : "linear-gradient(135deg, #A50064 0%, #7B0038 100%)";

  if (status === "paid") {
    return (
      <Card
        sx={{
          border: `2px solid ${primaryColor}`,
          borderRadius: 3,
          boxShadow: `0 8px 24px rgba(${
            isVNPay ? "30, 136, 229" : "165, 0, 100"
          }, 0.2)`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: gradient,
            color: "#fff",
            p: 2,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t("payment.status.success")}
          </Typography>
        </Box>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t("payment.status.redirecting")}
          </Typography>
          <CircularProgress
            size={24}
            sx={{ color: primaryColor }}
            thickness={4}
          />
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card
        sx={{
          border: "2px solid #F44336",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(244, 67, 54, 0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #F44336 0%, #D32F2F 100%)",
            color: "#fff",
            p: 2,
            textAlign: "center",
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t("payment.status.failed")}
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            {t("payment.status.tryAgain")}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(`/orders/${orderId}`)}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: "#F44336",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#D32F2F",
              },
            }}
          >
            {t("payment.status.viewOrder")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        border: `2px solid ${primaryColor}`,
        borderRadius: 3,
        boxShadow: `0 4px 16px rgba(${
          isVNPay ? "30, 136, 229" : "165, 0, 100"
        }, 0.15)`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: gradient,
          color: "#fff",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HourglassEmptyIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("payment.status.checking")}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {paymentMethod}
          </Typography>
        </Box>
        <CircularProgress size={32} sx={{ color: "#fff" }} thickness={4} />
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: `rgba(${isVNPay ? "30, 136, 229" : "165, 0, 100"}, 0.1)`,
              "& .MuiLinearProgress-bar": {
                bgcolor: primaryColor,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        <Alert
          severity="info"
          sx={{
            bgcolor: isVNPay ? "#E3F2FD" : "#FCE4EC",
            color: isVNPay ? "#1565C0" : "#7B0038",
            border: `1px solid ${isVNPay ? "#BBDEFB" : "#F8BBD0"}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t("payment.status.pleaseComplete").replace(
              "{method}",
              paymentMethod
            )}
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusTracker;
