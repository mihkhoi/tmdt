import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from "@mui/material";
import { Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { productApi } from "../api/productApi";

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.auth);
  const cartCount = useSelector((s: RootState) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const [q, setQ] = React.useState("");
  const [suggests, setSuggests] = React.useState<any[]>([]);
  const [showSuggest, setShowSuggest] = React.useState(false);
  const [lang, setLang] = React.useState("vi");
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(
    null
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const runSearch = () => {
    const keyword = q.trim();
    if (keyword) {
      navigate(`/`, { replace: false });
      navigate({ pathname: "/", search: `?q=${encodeURIComponent(keyword)}` });
    }
  };

  React.useEffect(() => {
    const handle = setTimeout(async () => {
      const k = q.trim();
      if (k.length >= 2) {
        try {
          const res = await productApi.suggest(k);
          setSuggests(Array.isArray(res) ? res : []);
          setShowSuggest(true);
        } catch {
          setSuggests([]);
        }
      } else {
        setSuggests([]);
        setShowSuggest(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [q]);

  const openLangMenu = (e: React.MouseEvent<HTMLElement>) =>
    setLangAnchor(e.currentTarget);
  const closeLangMenu = () => setLangAnchor(null);
  const selectLang = (l: string) => {
    setLang(l);
    closeLangMenu();
  };

  const closeProfileMenu = () => setProfileAnchor(null);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(90deg,#009688,#26a69a)" }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 2,
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 36 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                ShopEase
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: 560 }}>
              <TextField
                fullWidth
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm sản phẩm..."
                variant="outlined"
                size="small"
                sx={{ bgcolor: "#fff", borderRadius: 1 }}
                onFocus={() => setShowSuggest(true)}
                onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runSearch();
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={runSearch} edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {showSuggest && suggests.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: 40,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    maxHeight: 280,
                    overflow: "auto",
                  }}
                >
                  {suggests.map((s) => (
                    <Box
                      key={s.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        cursor: "pointer",
                      }}
                      onMouseDown={() => {
                        navigate(`/product/${s.id}`);
                        setShowSuggest(false);
                      }}
                    >
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          style={{
                            width: 36,
                            height: 24,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : null}
                      <Typography variant="body2">{s.name}</Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCartIcon />
              </IconButton>
              <Typography variant="body2">{cartCount}</Typography>
              <Chip
                size="small"
                label={lang === "vi" ? "Tiếng Việt" : "English"}
                onClick={openLangMenu}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
              {auth.token && auth.role === "ADMIN" && (
                <Button color="inherit" component={Link} to="/admin">
                  Bảng điều khiển
                </Button>
              )}
              {auth.token ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  onMouseEnter={(e) =>
                    setProfileAnchor(e.currentTarget as HTMLElement)
                  }
                >
                  <IconButton
                    color="inherit"
                    onClick={() => navigate("/account")}
                  >
                    <Avatar sx={{ width: 28, height: 28 }}>
                      {String(auth.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/account")}
                    sx={{ textTransform: "none" }}
                  >
                    {auth.username}
                  </Button>
                  <IconButton color="inherit">
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/register">
                    Đăng ký
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Đăng nhập
                  </Button>
                </>
              )}
            </Box>
            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={closeLangMenu}
              keepMounted
            >
              <MenuItem onClick={() => selectLang("vi")}>Tiếng Việt</MenuItem>
              <MenuItem onClick={() => selectLang("en")}>English</MenuItem>
            </Menu>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={closeProfileMenu}
              MenuListProps={{ onMouseLeave: closeProfileMenu }}
              keepMounted
            >
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/account");
                }}
              >
                Tài Khoản Của Tôi
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/orders");
                }}
              >
                Đơn Mua
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/notifications");
                }}
              >
                Thông Báo
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  handleLogout();
                }}
              >
                Đăng Xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3, mb: 5, flex: 1 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          background: "linear-gradient(90deg,#00695c,#004d40)",
          color: "#fff",
          mt: 4,
          pt: 4,
          pb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4,1fr)" },
              gap: 4,
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ShoppingBagIcon sx={{ fontSize: 28 }} />
                <Typography sx={{ ml: 1, fontWeight: 700 }}>
                  ShopEase
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Mua sắm dễ dàng, giao hàng nhanh chóng, hỗ trợ tận tâm.
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Hỗ trợ khách hàng
              </Typography>
              <Box
                component={Link}
                to="/help"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Trung tâm trợ giúp
              </Box>
              <Box
                component={Link}
                to="/policy/return"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Chính sách đổi trả
              </Box>
              <Box
                component={Link}
                to="/shipping"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Vận chuyển
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Về ShopEase
              </Typography>
              <Box
                component={Link}
                to="/about"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Giới thiệu
              </Box>
              <Box
                component={Link}
                to="/careers"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Tuyển dụng
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Theo dõi chúng tôi
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton color="inherit">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="inherit">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="inherit">
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <Typography variant="body2">
              © {new Date().getFullYear()} ShopEase. All rights reserved.
            </Typography>
            <Typography variant="body2">
              Hotline: 1900 1234 • Email: support@shopease.local
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
