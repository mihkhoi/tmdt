import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import QRCode from "qrcode";
import { useI18n } from "../i18n";
import { formatCurrency } from "../utils/currencyUtils";

interface MoMoPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  orderId: number;
  payUrl?: string;
  loading?: boolean;
}

const MoMoPaymentDialog: React.FC<MoMoPaymentDialogProps> = ({
  open,
  onClose,
  onConfirm,
  amount,
  orderId,
  payUrl,
  loading = false,
}) => {
  const { t, lang } = useI18n();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    if (payUrl) {
      QRCode.toDataURL(payUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#A50064",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => {
          setQrCodeDataUrl(url);
        })
        .catch((err) => {
          console.error("QR code generation failed:", err);
        });
    }
  }, [payUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* MoMo Header Style */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #A50064 0%, #7B0038 100%)",
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
          <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 0.5, fontSize: "1.5rem" }}
          >
            {t("payment.momo.title")}
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
                bgcolor: "rgba(165, 0, 100, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#A50064",
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "#A50064", fontWeight: 500 }}
            >
              {t("payment.momo.creating")}
            </Typography>
          </Box>
        )}

        {/* Order Summary Card - MoMo Style */}
        <Card
          sx={{
            mb: 3,
            border: "2px solid #FCE4EC",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(165, 0, 100, 0.1)",
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
                  bgcolor: "#FCE4EC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockIcon sx={{ fontSize: 20, color: "#A50064" }} />
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
                sx={{ fontWeight: 600, color: "#A50064" }}
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
                sx={{ fontWeight: 700, color: "#A50064", fontSize: "1.25rem" }}
              >
                {formatCurrency(amount)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {payUrl && qrCodeDataUrl && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              my: 3,
              p: 3,
              bgcolor: "#FCE4EC",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(165, 0, 100, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{ width: 256, height: 256 }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", fontWeight: 500, color: "#7B0038" }}
            >
              {t("payment.momo.scanQR")}
            </Typography>
            <Typography
              variant="caption"
              sx={{ textAlign: "center", color: "#7B0038", opacity: 0.8 }}
            >
              {lang === "en"
                ? "Scan with MoMo app to complete payment"
                : "Quét mã QR bằng ứng dụng MoMo để hoàn tất thanh toán"}
            </Typography>
          </Box>
        )}

        <Alert
          icon={<SecurityIcon />}
          severity="info"
          sx={{
            bgcolor: "#FCE4EC",
            color: "#7B0038",
            border: "1px solid #F8BBD0",
            borderRadius: 2,
            "& .MuiAlert-icon": {
              color: "#A50064",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t("payment.momo.info")}
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
        {payUrl ? (
          <Button
            variant="contained"
            onClick={() => window.open(payUrl, "_blank")}
            disabled={loading}
            startIcon={<QrCodeIcon />}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              bgcolor: "#A50064",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(165, 0, 100, 0.3)",
              "&:hover": {
                bgcolor: "#7B0038",
                boxShadow: "0 6px 16px rgba(165, 0, 100, 0.4)",
              },
              "&:disabled": {
                bgcolor: "#E1BEE7",
              },
            }}
          >
            {lang === "en" ? "Open in Browser" : "Mở trong trình duyệt"}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              bgcolor: "#A50064",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(165, 0, 100, 0.3)",
              "&:hover": {
                bgcolor: "#7B0038",
                boxShadow: "0 6px 16px rgba(165, 0, 100, 0.4)",
              },
              "&:disabled": {
                bgcolor: "#E1BEE7",
              },
            }}
          >
            {t("payment.momo.create")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MoMoPaymentDialog;
