import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import { useI18n } from "../i18n";
import { formatCurrency } from "../utils/currencyUtils";

interface VNPayPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (bankCode?: string) => void;
  amount: number;
  orderId: number;
  loading?: boolean;
}

const VNPayPaymentDialog: React.FC<VNPayPaymentDialogProps> = ({
  open,
  onClose,
  onConfirm,
  amount,
  orderId,
  loading = false,
}) => {
  const { t, lang } = useI18n();
  const [selectedBank, setSelectedBank] = useState<string>("");

  const banks = [
    { code: "", name: t("payment.vnpay.allBanks"), icon: "🏦" },
    { code: "NCB", name: "NCB", icon: "🏦" },
    { code: "VIETCOMBANK", name: "Vietcombank", icon: "🏦" },
    { code: "VIETINBANK", name: "VietinBank", icon: "🏦" },
    { code: "BIDV", name: "BIDV", icon: "🏦" },
    { code: "AGRIBANK", name: "Agribank", icon: "🏦" },
    { code: "SACOMBANK", name: "Sacombank", icon: "🏦" },
    { code: "TECHCOMBANK", name: "Techcombank", icon: "🏦" },
    { code: "ACB", name: "ACB", icon: "🏦" },
    { code: "TPBANK", name: "TPBank", icon: "🏦" },
    { code: "MBBANK", name: "MB Bank", icon: "🏦" },
    { code: "VPBANK", name: "VPBank", icon: "🏦" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* VNPay Header Style */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
          color: "#fff",
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "12px",
            bgcolor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccountBalanceIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 0.5, fontSize: "1.5rem" }}
          >
            {t("payment.vnpay.title")}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {lang === "en"
              ? "Secure payment gateway"
              : "Cổng thanh toán an toàn"}
          </Typography>
        </Box>
        <SecurityIcon sx={{ opacity: 0.8 }} />
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              sx={{
                height: 6,
                borderRadius: 3,
                mb: 2,
                bgcolor: "rgba(30, 136, 229, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#1E88E5",
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "#1E88E5", fontWeight: 500 }}
            >
              {t("payment.vnpay.redirecting")}
            </Typography>
          </Box>
        )}

        {/* Order Summary Card - VNPay Style */}
        <Card
          sx={{
            mb: 3,
            border: "2px solid #E3F2FD",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(30, 136, 229, 0.1)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  bgcolor: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockIcon sx={{ fontSize: 20, color: "#1E88E5" }} />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {lang === "en"
                  ? "Transaction Information"
                  : "Thông tin giao dịch"}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {lang === "en" ? "Order ID" : "Mã đơn hàng"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#1E88E5" }}
              >
                #{orderId}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {lang === "en" ? "Amount" : "Số tiền"}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1E88E5", fontSize: "1.25rem" }}
              >
                {formatCurrency(amount)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Bank Selection - VNPay Style */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 700, color: "#1565C0" }}
          >
            {t("payment.vnpay.selectBank")}
          </Typography>

          <RadioGroup
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {banks.map((bank) => (
                <FormControlLabel
                  key={bank.code}
                  value={bank.code}
                  control={
                    <Radio
                      sx={{
                        color: "#1E88E5",
                        "&.Mui-checked": {
                          color: "#1565C0",
                        },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{bank.icon}</span>
                      <span>{bank.name}</span>
                    </Box>
                  }
                  sx={{
                    border: "2px solid",
                    borderColor:
                      selectedBank === bank.code ? "#1E88E5" : "#E0E0E0",
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                    m: 0,
                    width: "100%",
                    bgcolor:
                      selectedBank === bank.code
                        ? "rgba(30, 136, 229, 0.05)"
                        : "#fff",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#1E88E5",
                      bgcolor: "rgba(30, 136, 229, 0.05)",
                    },
                  }}
                />
              ))}
            </Box>
          </RadioGroup>
        </Box>

        {/* Security Info - VNPay Style */}
        <Alert
          icon={<SecurityIcon />}
          severity="info"
          sx={{
            bgcolor: "#E3F2FD",
            color: "#1565C0",
            border: "1px solid #BBDEFB",
            borderRadius: 2,
            "& .MuiAlert-icon": {
              color: "#1E88E5",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t("payment.vnpay.info")}
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: "1px solid #E0E0E0",
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {lang === "en" ? "Cancel" : "Hủy"}
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(selectedBank || undefined)}
          disabled={loading}
          startIcon={<QrCodeIcon />}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            bgcolor: "#1E88E5",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(30, 136, 229, 0.3)",
            "&:hover": {
              bgcolor: "#1565C0",
              boxShadow: "0 6px 16px rgba(30, 136, 229, 0.4)",
            },
            "&:disabled": {
              bgcolor: "#90CAF9",
            },
          }}
        >
          {lang === "en" ? "Pay Now" : "Thanh toán ngay"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VNPayPaymentDialog;
