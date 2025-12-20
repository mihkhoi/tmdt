import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  orderId: number | null;
  amountText?: string; // ✅ NEW
};

export default function VietQrPaymentDialog({
  open,
  onClose,
  imageUrl,
  orderId,
  amountText,
}: Props) {
  const copy = async () => {
    try {
      if (!imageUrl) return;
      await navigator.clipboard.writeText(imageUrl);
    } catch {
      // ignore
    }
  };

  const safeOrderId = orderId ?? 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Thanh toán VietQR
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Quét mã để chuyển khoản{" "}
          {amountText ? (
            <>
              số tiền <b>{amountText}</b>
            </>
          ) : null}
          . Nội dung gợi ý: <b>ORDER{safeOrderId}</b>
        </Typography>

        {!imageUrl ? (
          <Alert severity="error">Không tạo được QR. Vui lòng thử lại.</Alert>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
              border: "1px solid #eee",
              borderRadius: 2,
              bgcolor: "#fff",
            }}
          >
            <img
              src={imageUrl}
              alt="VietQR"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={copy} disabled={!imageUrl}>
            Copy link QR
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (imageUrl) window.open(imageUrl, "_blank");
            }}
            disabled={!imageUrl}
          >
            Mở ảnh QR
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
