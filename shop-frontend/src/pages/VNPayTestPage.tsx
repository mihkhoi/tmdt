import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Stack,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import http from "../api/http";
import { useI18n } from "../i18n";

const VNPayTestPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [amount, setAmount] = useState<string>("100000");
  const [returnUrl, setReturnUrl] = useState<string>("");
  const [bankCode, setBankCode] = useState<string>("");
  const [txnRef, setTxnRef] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bankCodes = [
    { value: "", label: "Tất cả ngân hàng" },
    { value: "NCB", label: "Ngân hàng Quốc Dân (NCB)" },
    { value: "VIETCOMBANK", label: "Ngân hàng Ngoại Thương (Vietcombank)" },
    { value: "VIETINBANK", label: "Ngân hàng Công Thương (Vietinbank)" },
    { value: "BIDV", label: "Ngân hàng Đầu tư và Phát triển (BIDV)" },
    { value: "AGRIBANK", label: "Ngân hàng Nông nghiệp (Agribank)" },
    { value: "SACOMBANK", label: "Ngân hàng Sài Gòn Thương Tín (Sacombank)" },
    { value: "TECHCOMBANK", label: "Ngân hàng Kỹ Thương (Techcombank)" },
    { value: "ACB", label: "Ngân hàng Á Châu (ACB)" },
    { value: "VPBANK", label: "Ngân hàng Việt Nam Thịnh Vượng (VPBank)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const amountNum = parseInt(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError("Số tiền không hợp lệ");
        setLoading(false);
        return;
      }

      const params: any = {
        amount: amountNum,
      };
      if (returnUrl && returnUrl.trim()) {
        params.returnUrl = returnUrl.trim();
      }
      if (bankCode && bankCode.trim()) {
        params.bankCode = bankCode.trim();
      }
      if (txnRef && txnRef.trim()) {
        params.txnRef = txnRef.trim();
      }

      const response = await http.get("/orders/payment/vnpay/test", { params });
      const payUrl = response.data?.data?.paymentUrl || response.data?.payUrl;

      if (payUrl) {
        // Log payment URL for debugging
        console.log("VNPay Payment URL:", payUrl);

        // Redirect to VNPay payment page
        window.location.href = payUrl;
      } else {
        setError("Không thể tạo payment URL");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("VNPay test error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra khi tạo payment URL"
      );
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <PaymentIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {lang === "en" ? "VNPay Payment Test" : "Test Thanh Toán VNPay"}
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {lang === "en"
              ? "Enter payment details to test VNPay integration"
              : "Nhập thông tin thanh toán để test tích hợp VNPay"}
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                required
                label={lang === "en" ? "Amount (VND)" : "Số tiền (VND)"}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                helperText={
                  lang === "en"
                    ? "Enter amount in VND (e.g., 100000 = 100,000 VND)"
                    : "Nhập số tiền bằng VND (ví dụ: 100000 = 100.000 VND)"
                }
              />

              <TextField
                fullWidth
                label={
                  lang === "en"
                    ? "Return URL (Optional)"
                    : "Địa chỉ trả về (Tùy chọn)"
                }
                value={returnUrl}
                onChange={(e) => setReturnUrl(e.target.value)}
                helperText={
                  lang === "en"
                    ? "Leave empty to use default callback URL"
                    : "Để trống để dùng URL callback mặc định"
                }
                placeholder="http://localhost:3000/payment/vnpay/test/result"
              />

              <TextField
                fullWidth
                select
                label={
                  lang === "en"
                    ? "Bank Code (Optional)"
                    : "Mã ngân hàng (Tùy chọn)"
                }
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                helperText={
                  lang === "en"
                    ? "Select a specific bank or leave empty for all banks"
                    : "Chọn ngân hàng cụ thể hoặc để trống cho tất cả ngân hàng"
                }
              >
                {bankCodes.map((bank) => (
                  <MenuItem key={bank.value} value={bank.value}>
                    {bank.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label={
                  lang === "en"
                    ? "Transaction Reference / Token (Optional)"
                    : "Mã giao dịch / Token (Tùy chọn)"
                }
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                helperText={
                  lang === "en"
                    ? "Enter transaction reference or token. Leave empty to auto-generate"
                    : "Nhập mã giao dịch hoặc token. Để trống để tự động tạo"
                }
                placeholder="TEST123456"
              />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  {lang === "en" ? "Cancel" : "Hủy"}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<PaymentIcon />}
                  sx={{ minWidth: 200 }}
                >
                  {loading
                    ? lang === "en"
                      ? "Creating..."
                      : "Đang tạo..."
                    : lang === "en"
                    ? "Go to VNPay"
                    : "Đến VNPay"}
                </Button>
              </Box>
            </Stack>
          </form>

          <Box sx={{ mt: 4, p: 2, bgcolor: "info.light", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {lang === "en" ? "Test Card Information" : "Thông tin thẻ test"}
            </Typography>
            <Typography variant="body2" component="div">
              <strong>{lang === "en" ? "Bank:" : "Ngân hàng:"}</strong> NCB
              <br />
              <strong>{lang === "en" ? "Card Number:" : "Số thẻ:"}</strong>{" "}
              9704198526191432198
              <br />
              <strong>
                {lang === "en" ? "Cardholder:" : "Tên chủ thẻ:"}
              </strong>{" "}
              NGUYEN VAN A
              <br />
              <strong>
                {lang === "en" ? "Expiry Date:" : "Ngày phát hành:"}
              </strong>{" "}
              07/15
              <br />
              <strong>
                {lang === "en" ? "OTP Password:" : "Mật khẩu OTP:"}
              </strong>{" "}
              123456
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VNPayTestPage;
