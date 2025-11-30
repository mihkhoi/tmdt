import { Box, Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
export default function NotificationsPage() {
  return (
    <Box>
      <Typography variant="h5" mb={2}>Thông Báo</Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          <ListItem>
            <ListItemText primary="Khuyến mãi 12.12 sắp diễn ra" secondary="Hôm nay" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Đơn #1234 đã giao thành công" secondary="Hôm qua" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
