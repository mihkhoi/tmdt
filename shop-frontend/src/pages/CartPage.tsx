import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  removeFromCart,
  incItem,
  decItem,
  toggleSelect,
  selectAll,
  removeSelected,
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider, Chip } from "@mui/material";
import http from "../api/http";

const CartPage = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Giỏ hàng
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="checkbox"
            checked={items.every((i) => i.selected)}
            onChange={(e) => dispatch(selectAll(e.target.checked))}
          />
          <Typography variant="body2">Chọn tất cả ({items.length})</Typography>
          <Button
            size="small"
            color="error"
            onClick={() => dispatch(removeSelected())}
          >
            Xóa
          </Button>
        </Box>
      </Paper>

      {items.map((item) => (
        <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "40px 100px 1fr 140px 160px 120px",
              },
              alignItems: "center",
              gap: 2,
            }}
          >
            <input
              type="checkbox"
              checked={!!item.selected}
              onChange={() => dispatch(toggleSelect(item.id))}
            />
            {item.imageUrl ? (
              <img
                src={toAbs(item.imageUrl)}
                alt={item.name}
                style={{
                  width: 100,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              <div />
            )}
            <Box>
              <Typography variant="subtitle2">{item.name}</Typography>
              {item.discountPercent > 0 && (
                <Chip
                  label={`-${item.discountPercent}%`}
                  color="error"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
            <Typography variant="body2">
              {Number(item.price).toLocaleString("vi-VN")} ₫
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => dispatch(decItem(item.id))}
              >
                -
              </Button>
              <span>{item.quantity}</span>
              <Button
                variant="outlined"
                onClick={() => dispatch(incItem(item.id))}
              >
                +
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">
                {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
              </Typography>
              <Button
                color="error"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}

      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 320px" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" mb={1}>
              Voucher
            </Typography>
            <input
              placeholder="Nhập mã voucher"
              style={{ width: "100%", padding: 8 }}
            />
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "text.secondary" }}
            >
              Xem thêm voucher ở Kho Voucher
            </Typography>
          </Box>
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                Tổng cộng (
                {items.reduce((n, i) => n + (i.selected ? i.quantity : 0), 0)}{" "}
                sản phẩm):
              </Typography>
              <Typography variant="subtitle1">
                {items
                  .filter((i) => i.selected)
                  .reduce((sum, i) => sum + i.price * i.quantity, 0)
                  .toLocaleString("vi-VN")}{" "}
                ₫
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate("/checkout")}
            >
              Mua hàng
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CartPage;
