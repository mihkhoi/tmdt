import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function HelpPage() {
  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Trợ giúp
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Liên hệ hỗ trợ: support@shop.local
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hotline: 1900-xxxx
        </Typography>
      </Paper>
    </Box>
  );
}
