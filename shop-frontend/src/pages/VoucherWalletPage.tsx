import { Box, Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
export default function VoucherWalletPage() {
  return (
    <Box>
      <Typography variant="h5" mb={2}>Kho Voucher</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" mb={1}>Bạn chưa có voucher nào.</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Mã FREESHIP" secondary="Hết hạn: —" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
