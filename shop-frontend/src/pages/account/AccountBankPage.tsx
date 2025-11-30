import { Box, Paper, Typography, Button } from "@mui/material";
export default function AccountBankPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Ngân Hàng</Typography>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1">Thẻ Tín Dụng/Ghi Nợ</Typography>
            <Button variant="contained" disabled>+ Thêm Thẻ Mới</Button>
          </Box>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">Bạn chưa liên kết thẻ.</Typography>
          </Paper>
        </Box>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1">Tài Khoản Ngân Hàng Của Tôi</Typography>
            <Button variant="contained" color="secondary" disabled>+ Thêm Ngân Hàng Liên Kết</Button>
          </Box>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">Bạn chưa có tài khoản ngân hàng.</Typography>
          </Paper>
        </Box>
      </Box>
    </Paper>
  );
}
