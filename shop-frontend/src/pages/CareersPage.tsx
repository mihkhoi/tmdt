import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function CareersPage() {
  return (
    <Box>
      <Typography variant="h4" mb={2}>Tuyển dụng</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">Gửi CV về hr@shop.local.</Typography>
        <Typography variant="body2" color="text.secondary">Chúng tôi luôn tìm kiếm tài năng.</Typography>
      </Paper>
    </Box>
  );
}
