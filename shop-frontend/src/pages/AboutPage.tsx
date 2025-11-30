import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function AboutPage() {
  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Về chúng tôi
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">Cửa hàng thời trang hiện đại.</Typography>
        <Typography variant="body2" color="text.secondary">
          Thành lập năm 2024.
        </Typography>
      </Paper>
    </Box>
  );
}
