import React from "react";
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

export default function AccountLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const is = (p: string) => loc.pathname === p;
  const [openGroup, setOpenGroup] = React.useState(
    loc.pathname.startsWith("/account")
  );
  React.useEffect(() => {
    setOpenGroup(loc.pathname.startsWith("/account"));
  }, [loc.pathname]);
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "240px 1fr" },
          gap: 2,
        }}
      >
        <Paper sx={{ p: 2 }}>
          <List>
            <ListItemButton component={Link} to="/notifications">
              <ListItemText primary="Thông Báo" />
            </ListItemButton>
            <ListItemButton onClick={() => setOpenGroup((v) => !v)}>
              <ListItemText primary="Tài Khoản Của Tôi" />
            </ListItemButton>
            <Collapse in={openGroup} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 2 }}>
                <List>
                  <ListItemButton
                    selected={is("/account") || is("/account/profile")}
                    component={Link}
                    to="/account"
                  >
                    <ListItemText primary="Hồ Sơ" />
                  </ListItemButton>
                  <ListItemButton
                    selected={is("/account/bank")}
                    component={Link}
                    to="/account/bank"
                  >
                    <ListItemText primary="Ngân Hàng" />
                  </ListItemButton>
                  <ListItemButton
                    selected={is("/account/addresses")}
                    component={Link}
                    to="/account/addresses"
                  >
                    <ListItemText primary="Địa Chỉ" />
                  </ListItemButton>
                  <ListItemButton
                    selected={is("/account/password")}
                    component={Link}
                    to="/account/password"
                  >
                    <ListItemText primary="Đổi Mật Khẩu" />
                  </ListItemButton>
                </List>
              </Box>
            </Collapse>
            <ListItemButton component={Link} to="/orders">
              <ListItemText primary="Đơn Mua" />
            </ListItemButton>
            <ListItemButton component={Link} to="/vouchers">
              <ListItemText primary="Kho Voucher" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              <ListItemText primary="Đăng Xuất" />
            </ListItemButton>
          </List>
        </Paper>
        <Outlet />
      </Box>
    </Box>
  );
}
