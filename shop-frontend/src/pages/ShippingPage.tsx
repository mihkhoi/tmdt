import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ShippingPage() {
  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Vận chuyển
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">Miễn phí đơn từ 500.000đ.</Typography>
        <Typography variant="body2" color="text.secondary">
          Thời gian giao 2–5 ngày.
        </Typography>
      </Paper>
    </Box>
  );
}
