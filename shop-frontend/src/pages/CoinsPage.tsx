import { Box, Paper, Typography } from "@mui/material";
export default function CoinsPage() {
  return (
    <Box>
      <Typography variant="h5" mb={2}>Shopee Xu</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">0 Xu</Typography>
        <Typography variant="body2" color="text.secondary">Tích xu khi mua hàng để đổi ưu đãi.</Typography>
      </Paper>
    </Box>
  );
}
