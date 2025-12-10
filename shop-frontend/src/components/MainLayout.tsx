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
import ChatWidget from "./ChatWidget";

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
  const [currency, setCurrency] = React.useState<string>(
    localStorage.getItem("currency") || "VND"
  );
  const [currencyAnchor, setCurrencyAnchor] =
    React.useState<null | HTMLElement>(null);

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
  const openCurrencyMenu = (e: React.MouseEvent<HTMLElement>) =>
    setCurrencyAnchor(e.currentTarget);
  const closeCurrencyMenu = () => setCurrencyAnchor(null);
  const selectCurrency = (c: string) => {
    setCurrency(c);
    localStorage.setItem("currency", c);
    closeCurrencyMenu();
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
                {dict[lang].brandName}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: 560 }}>
              <TextField
                fullWidth
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={dict[lang].searchPlaceholder}
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
              <Chip
                size="small"
                label={currency}
                onClick={openCurrencyMenu}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
              {auth.token && auth.role === "ADMIN" && (
                <Button color="inherit" component={Link} to="/admin">
                  {dict[lang].dashboard}
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
                    {dict[lang].register}
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    {dict[lang].login}
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
              anchorEl={currencyAnchor}
              open={Boolean(currencyAnchor)}
              onClose={closeCurrencyMenu}
              keepMounted
            >
              <MenuItem onClick={() => selectCurrency("VND")}>VND</MenuItem>
              <MenuItem onClick={() => selectCurrency("USD")}>USD</MenuItem>
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
                {dict[lang].myAccount}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/orders");
                }}
              >
                {dict[lang].orders}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/notifications");
                }}
              >
                {dict[lang].notifications}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  handleLogout();
                }}
              >
                {dict[lang].logout}
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
                {dict[lang].tagline}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                {dict[lang].support}
              </Typography>
              <Box
                component={Link}
                to="/help"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {dict[lang].helpCenter}
              </Box>
              <Box
                component={Link}
                to="/policy/return"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {dict[lang].returns}
              </Box>
              <Box
                component={Link}
                to="/shipping"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {dict[lang].shipping}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                {dict[lang].about}
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
                {dict[lang].careers}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                {dict[lang].followUs}
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
              {dict[lang].hotline}: 1900 1234 • Email: support@shopease.local
            </Typography>
          </Box>
        </Container>
      </Box>
      <ChatWidget />
    </Box>
  );
};

export default MainLayout;
const dict: Record<string, any> = {
  vi: {
    brandName: "ShopEase",
    searchPlaceholder: "Tìm sản phẩm...",
    register: "Đăng ký",
    login: "Đăng nhập",
    dashboard: "Bảng điều khiển",
    myAccount: "Tài Khoản Của Tôi",
    orders: "Đơn Mua",
    notifications: "Thông Báo",
    logout: "Đăng Xuất",
    tagline: "Mua sắm dễ dàng, giao hàng nhanh chóng, hỗ trợ tận tâm.",
    support: "Hỗ trợ khách hàng",
    helpCenter: "Trung tâm trợ giúp",
    returns: "Chính sách đổi trả",
    shipping: "Vận chuyển",
    about: "Giới thiệu",
    careers: "Tuyển dụng",
    followUs: "Theo dõi chúng tôi",
    hotline: "Hotline",
  },
  en: {
    brandName: "ShopEase",
    searchPlaceholder: "Search products...",
    register: "Register",
    login: "Login",
    dashboard: "Admin",
    myAccount: "My Account",
    orders: "Orders",
    notifications: "Notifications",
    logout: "Logout",
    tagline: "Shop with ease, fast delivery, caring support.",
    support: "Customer Support",
    helpCenter: "Help Center",
    returns: "Return Policy",
    shipping: "Shipping",
    about: "About",
    careers: "Careers",
    followUs: "Follow us",
    hotline: "Hotline",
  },
};
