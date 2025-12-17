import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useI18n } from "../i18n";

const VNPayTestResultPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const status = sp.get("status");
  const message = sp.get("message") || "";

  const isSuccess = status === "00";

  useEffect(() => {
    // Log all parameters for debugging
    const params: Record<string, string> = {};
    sp.forEach((value, key) => {
      params[key] = value;
    });
    console.log("VNPay Callback Parameters:", params);
  }, [sp]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: "auto" }}>
      <Card>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          {isSuccess ? (
            <>
              <CheckCircleIcon
                sx={{ fontSize: 80, color: "success.main", mb: 2 }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 2, color: "success.main" }}
              >
                {lang === "en"
                  ? "Payment Successful!"
                  : "Thanh toán thành công!"}
              </Typography>
            </>
          ) : (
            <>
              <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 2, color: "error.main" }}
              >
                {lang === "en" ? "Payment Failed" : "Thanh toán thất bại"}
              </Typography>
            </>
          )}

          {message && (
            <Alert
              severity={isSuccess ? "success" : "error"}
              sx={{ mb: 3, textAlign: "left" }}
            >
              {decodeURIComponent(message)}
            </Alert>
          )}

          <Box sx={{ mb: 3, textAlign: "left" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>
                {lang === "en" ? "Response Code:" : "Mã phản hồi:"}
              </strong>{" "}
              {status || "N/A"}
            </Typography>
            {sp.get("vnp_TransactionNo") && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>
                  {lang === "en" ? "Transaction No:" : "Mã giao dịch:"}
                </strong>{" "}
                {sp.get("vnp_TransactionNo")}
              </Typography>
            )}
            {sp.get("vnp_TxnRef") && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>
                  {lang === "en" ? "Transaction Ref:" : "Mã tham chiếu:"}
                </strong>{" "}
                {sp.get("vnp_TxnRef")}
              </Typography>
            )}
            {sp.get("vnp_Amount") && (
              <Typography variant="body2" color="text.secondary">
                <strong>{lang === "en" ? "Amount:" : "Số tiền:"}</strong>{" "}
                {parseInt(sp.get("vnp_Amount") || "0") / 100}{" "}
                {lang === "en" ? "VND" : "VNĐ"}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/payment/vnpay/test")}
            >
              {lang === "en" ? "Test Again" : "Test lại"}
            </Button>
            <Button variant="contained" onClick={() => navigate("/")}>
              {lang === "en" ? "Go Home" : "Về trang chủ"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VNPayTestResultPage;
