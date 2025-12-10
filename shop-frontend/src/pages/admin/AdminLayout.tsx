import React from "react";
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { RootState } from "../../store/store";
import ChatWidget from "../../components/ChatWidget";

const NavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => {
  const loc = useLocation();
  const selected = loc.pathname === to || loc.pathname.startsWith(to + "/");
  return (
    <ListItemButton component={Link} to={to} selected={selected}>
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((s: RootState) => s.auth);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb" }}>
      <AppBar position="static" sx={{ bgcolor: "#0f172a" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <AdminPanelSettingsIcon />
            <Typography variant="h6">Ecommerce Admin</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 28, height: 28 }}>
              {String(auth.username || "A")
                .charAt(0)
                .toUpperCase()}
            </Avatar>
            <Typography variant="body2">{auth.username || "Admin"}</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "grid", gridTemplateColumns: { md: "240px 1fr" } }}>
        <Box sx={{ p: 2 }}>
          <Paper sx={{ p: 1, position: "sticky", top: 16 }}>
            <List>
              <NavItem to="/admin" icon={<DashboardIcon />} label="Dashboard" />
              <NavItem
                to="/admin/users"
                icon={<PeopleIcon />}
                label="Người dùng"
              />
              <NavItem
                to="/admin/products"
                icon={<Inventory2Icon />}
                label="Sản phẩm"
              />
              <NavItem
                to="/admin/orders"
                icon={<AssignmentIcon />}
                label="Đơn hàng"
              />
              <NavItem
                to="/admin/vouchers"
                icon={<LocalOfferIcon />}
                label="Voucher"
              />
            </List>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Trang quản trị
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
      <ChatWidget />
    </Box>
  );
}
