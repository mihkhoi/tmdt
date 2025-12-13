import React from "react";
import {
  Box,
  Typography,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";

const VNPayErrorHandler: React.FC = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const errorCode = sp.get("code");
  const orderId = sp.get("vnp_TxnRef") || sp.get("id");

  const getErrorMessage = (code: string | null): string => {
    if (!code) return lang === "en" ? "Unknown error" : "Lỗi không xác định";

    const errorMap: Record<string, string> = {
      "72":
        lang === "en"
          ? "Website not found. Please check your VNPay merchant configuration."
          : "Không tìm thấy website. Vui lòng kiểm tra cấu hình merchant VNPay.",
      "07": lang === "en" ? "Trashed transaction" : "Giao dịch bị hủy",
      "09":
        lang === "en"
          ? "Card/Account not registered for Internet Banking"
          : "Thẻ/Tài khoản chưa đăng ký Internet Banking",
      "10":
        lang === "en"
          ? "Incorrect authentication information"
          : "Xác thực thông tin không đúng",
      "11": lang === "en" ? "Payment timeout" : "Hết thời gian thanh toán",
      "12": lang === "en" ? "Card/Account is locked" : "Thẻ/Tài khoản bị khóa",
      "51": lang === "en" ? "Insufficient balance" : "Số dư không đủ",
      "65":
        lang === "en"
          ? "Exceeded transaction limit"
          : "Vượt quá hạn mức giao dịch",
      "75": lang === "en" ? "Bank maintenance" : "Ngân hàng đang bảo trì",
    };

    return (
      errorMap[code] ||
      (lang === "en" ? `Error code: ${code}` : `Mã lỗi: ${code}`)
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 700,
        mx: "auto",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          border: "2px solid #F44336",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(244, 67, 54, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Error Header - VNPay Style */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #F44336 0%, #D32F2F 100%)",
            color: "#fff",
            p: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "16px",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <ErrorIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {lang === "en" ? "Payment Error" : "Lỗi thanh toán"}
          </Typography>
          {errorCode && (
            <Chip
              label={`${lang === "en" ? "Error Code" : "Mã lỗi"}: ${errorCode}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                fontSize: 28,
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {getErrorMessage(errorCode)}
            </Typography>
          </Alert>

          {orderId && (
            <Alert
              severity="info"
              icon={<ReceiptIcon />}
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lang === "en" ? "Order ID" : "Mã đơn hàng"}:{" "}
                <strong>#{orderId}</strong>
              </Typography>
            </Alert>
          )}

          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">
              {lang === "en"
                ? "If this error persists, please contact support or try a different payment method."
                : "Nếu lỗi này tiếp tục xảy ra, vui lòng liên hệ hỗ trợ hoặc thử phương thức thanh toán khác."}
            </Typography>
          </Alert>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              startIcon={<HomeIcon />}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#1E88E5",
                color: "#1E88E5",
                "&:hover": {
                  borderColor: "#1565C0",
                  bgcolor: "rgba(30, 136, 229, 0.05)",
                },
              }}
            >
              {lang === "en" ? "Back to Home" : "Về trang chủ"}
            </Button>
            {orderId && (
              <Button
                variant="contained"
                onClick={() => navigate(`/orders/${orderId}`)}
                startIcon={<ReceiptIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#1E88E5",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(30, 136, 229, 0.3)",
                  "&:hover": {
                    bgcolor: "#1565C0",
                    boxShadow: "0 6px 16px rgba(30, 136, 229, 0.4)",
                  },
                }}
              >
                {lang === "en" ? "View Order" : "Xem đơn hàng"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VNPayErrorHandler;
