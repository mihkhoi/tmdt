import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ReturnPolicyPage() {
  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Chính sách đổi trả
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Đổi trả trong 7 ngày với hóa đơn.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sản phẩm phải còn nguyên tem mác.
        </Typography>
      </Paper>
    </Box>
  );
}
