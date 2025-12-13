import React, { useMemo, useCallback } from "react";
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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { productApi } from "../api/productApi";
import ChatWidget from "./ChatWidget";
import { useI18n } from "../i18n";
import http from "../api/http";
import { useTheme } from "@mui/material/styles";

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
  const [searchLoading, setSearchLoading] = React.useState(false);
  const { lang, setLang, t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Convert relative image URLs to absolute
  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const [currency, setCurrency] = React.useState<string>(
    localStorage.getItem("currency") || "VND"
  );
  const [currencyAnchor, setCurrencyAnchor] =
    React.useState<null | HTMLElement>(null);
  const [locationAnchor, setLocationAnchor] =
    React.useState<null | HTMLElement>(null);
  const [location, setLocation] = React.useState<string>(
    localStorage.getItem("deliveryLocation") || t("location.hoChiMinh")
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const openLocationMenu = (e: React.MouseEvent<HTMLElement>) =>
    setLocationAnchor(e.currentTarget);
  const closeLocationMenu = () => setLocationAnchor(null);
  const selectLocation = (loc: string) => {
    setLocation(loc);
    localStorage.setItem("deliveryLocation", loc);
    closeLocationMenu();
  };

  const runSearch = useCallback(() => {
    const keyword = q.trim();
    if (keyword) {
      navigate(`/`, { replace: false });
      navigate({ pathname: "/", search: `?q=${encodeURIComponent(keyword)}` });
      setShowSuggest(false);
      setQ("");
    }
  }, [q, navigate]);

  React.useEffect(() => {
    const handle = setTimeout(async () => {
      const k = q.trim();
      if (k.length >= 2) {
        setSearchLoading(true);
        try {
          const res = await productApi.suggest(k);
          setSuggests(Array.isArray(res) ? res : []);
          setShowSuggest(true);
        } catch {
          setSuggests([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggests([]);
        setShowSuggest(false);
        setSearchLoading(false);
      }
    }, 300); // Slightly longer delay for better performance
    return () => clearTimeout(handle);
  }, [q]);

  const openLangMenu = (e: React.MouseEvent<HTMLElement>) =>
    setLangAnchor(e.currentTarget);
  const closeLangMenu = () => setLangAnchor(null);
  const selectLang = (l: "vi" | "en") => {
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
        sx={{
          background: "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
          boxShadow: "0 4px 12px rgba(26,148,255,0.2)",
        }}
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
                {t("brandName")}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", flex: 1, maxWidth: 700 }}>
              <TextField
                fullWidth
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchPlaceholder")}
                variant="outlined"
                size="small"
                sx={{
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                  borderRadius: "24px",
                  boxShadow: isDark
                    ? "0 2px 8px rgba(0,0,0,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "24px",
                    color: isDark ? "#fff" : "#333",
                    "& fieldset": {
                      borderColor: "transparent",
                      borderWidth: "2px",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(26,148,255,0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1A94FF",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: isDark ? "#fff" : "#333",
                    "&::placeholder": {
                      color: isDark ? "rgba(255,255,255,0.5)" : "#999",
                      opacity: 1,
                    },
                  },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: isDark
                      ? "0 4px 12px rgba(0,0,0,0.4)"
                      : "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
                onFocus={() => {
                  if (suggests.length > 0 || q.length >= 2) {
                    setShowSuggest(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runSearch();
                    setShowSuggest(false);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: isDark ? "rgba(255,255,255,0.7)" : "#666",
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: q.trim() && (
                    <InputAdornment position="end">
                      {searchLoading ? (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            border: "2px solid #1A94FF",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            "@keyframes spin": {
                              "0%": { transform: "rotate(0deg)" },
                              "100%": { transform: "rotate(360deg)" },
                            },
                          }}
                        />
                      ) : (
                        <IconButton
                          onClick={runSearch}
                          edge="end"
                          size="small"
                          sx={{
                            bgcolor: "#1A94FF",
                            color: "#fff",
                            width: 36,
                            height: 36,
                            "&:hover": {
                              bgcolor: "#0D7AE6",
                              transform: "scale(1.05)",
                            },
                            transition: "all 0.2s",
                            boxShadow: "0 2px 8px rgba(26,148,255,0.3)",
                          }}
                        >
                          <SearchIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              {showSuggest && (suggests.length > 0 || searchLoading) && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: 52,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: 400,
                    overflow: "auto",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    borderRadius: 3,
                    mt: 0.5,
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.08)",
                    bgcolor: isDark ? "#1e1e1e" : "#fff",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#E0E0E0",
                      borderRadius: "10px",
                      "&:hover": {
                        background: "#BDBDBD",
                      },
                    },
                  }}
                >
                  {searchLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "2px solid #1A94FF",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {lang === "en" ? "Searching..." : "Đang tìm kiếm..."}
                      </Typography>
                    </Box>
                  ) : (
                    suggests.map((s) => (
                      <Box
                        key={s.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          "&:last-child": {
                            borderBottom: "none",
                          },
                          "&:hover": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.05)"
                              : "#F8F9FA",
                            transform: "translateX(4px)",
                          },
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(`/product/${s.id}`);
                          setShowSuggest(false);
                          setQ("");
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            overflow: "hidden",
                            flexShrink: 0,
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.05)"
                              : "#f5f5f5",
                            border: isDark
                              ? "1px solid rgba(255,255,255,0.1)"
                              : "1px solid rgba(0,0,0,0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {s.imageUrl ? (
                            <Box
                              component="img"
                              src={toAbs(s.imageUrl)}
                              alt={s.name || s.nameEn || "Product"}
                              onError={(e: any) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : null}
                          <Box
                            sx={{
                              display: s.imageUrl ? "none" : "flex",
                              width: "100%",
                              height: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: isDark
                                ? "rgba(26,148,255,0.2)"
                                : "#E3F2FD",
                            }}
                          >
                            <ShoppingBagIcon
                              sx={{ color: "#1A94FF", fontSize: 24 }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: isDark ? "#fff" : "#333",
                            }}
                          >
                            {lang === "en" && s.nameEn ? s.nameEn : s.name}
                          </Typography>
                          {s.price && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#FF424E",
                                fontWeight: 600,
                                mt: 0.25,
                                display: "block",
                              }}
                            >
                              {(() => {
                                const currency =
                                  localStorage.getItem("currency") || "VND";
                                const rate = Number(
                                  process.env.REACT_APP_USD_RATE || 24000
                                );
                                if (currency === "USD") {
                                  const usd = (s.price || 0) / rate;
                                  return `$${usd.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}`;
                                }
                                return `${(s.price || 0).toLocaleString(
                                  "vi-VN"
                                )} ₫`;
                              })()}
                            </Typography>
                          )}
                        </Box>
                        <SearchIcon
                          sx={{
                            color: isDark ? "rgba(255,255,255,0.5)" : "#999",
                            fontSize: 18,
                            opacity: 0.5,
                          }}
                        />
                      </Box>
                    ))
                  )}
                </Paper>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
                onClick={openLocationMenu}
              >
                <LocationOnIcon sx={{ fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontSize: 12 }}>
                  {t("deliverTo")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                >
                  {location}
                </Typography>
                <ArrowDropDownIcon sx={{ fontSize: 16 }} />
              </Box>
              {auth.token && (
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/notifications"
                >
                  <NotificationsIcon />
                </IconButton>
              )}
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCartIcon />
              </IconButton>
              {cartCount > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: "error.main",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    ml: -2,
                    mt: -1,
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Typography>
              )}
              <Chip
                size="small"
                label={
                  lang === "vi" ? t("footer.vietnamese") : t("footer.english")
                }
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
              <Chip
                size="small"
                label={
                  (localStorage.getItem("theme_mode") || "light") === "dark"
                    ? "Dark"
                    : "Light"
                }
                onClick={() =>
                  window.dispatchEvent(new Event("app:toggle-theme"))
                }
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
              {auth.token && auth.role === "ADMIN" && (
                <Button color="inherit" component={Link} to="/admin">
                  {t("dashboard")}
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
                    {t("register")}
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    {t("login")}
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
              <MenuItem onClick={() => selectLang("vi")}>
                {t("footer.vietnamese")}
              </MenuItem>
              <MenuItem onClick={() => selectLang("en")}>
                {t("footer.english")}
              </MenuItem>
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
              anchorEl={locationAnchor}
              open={Boolean(locationAnchor)}
              onClose={closeLocationMenu}
              keepMounted
            >
              <MenuItem onClick={() => selectLocation(t("location.hoChiMinh"))}>
                {t("location.hoChiMinh")}
              </MenuItem>
              <MenuItem onClick={() => selectLocation(t("location.haNoi"))}>
                {t("location.haNoi")}
              </MenuItem>
              <MenuItem onClick={() => selectLocation(t("location.daNang"))}>
                {t("location.daNang")}
              </MenuItem>
              <MenuItem onClick={() => selectLocation(t("location.canTho"))}>
                {t("location.canTho")}
              </MenuItem>
              <MenuItem onClick={() => selectLocation(t("location.haiPhong"))}>
                {t("location.haiPhong")}
              </MenuItem>
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
                {t("myAccount")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/orders");
                }}
              >
                {t("orders")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  navigate("/notifications");
                }}
              >
                {t("notifications")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  closeProfileMenu();
                  handleLogout();
                }}
              >
                {t("logout")}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
          color: "#fff",
          mt: "auto",
          pt: 5,
          pb: 3,
          borderTop: "4px solid #1A94FF",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2,1fr)",
                md: "repeat(5,1fr)",
              },
              gap: 4,
              mb: 3,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  width: "fit-content",
                }}
              >
                <ShoppingBagIcon sx={{ fontSize: 36, color: "#1A94FF" }} />
                <Typography
                  sx={{
                    ml: 1.5,
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "#fff",
                  }}
                >
                  ShopEase
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6, maxWidth: 280 }}
              >
                {t("tagline")}
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <IconButton
                  color="inherit"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 44,
                    height: 44,
                    "&:hover": {
                      bgcolor: "#1A94FF",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 44,
                    height: 44,
                    "&:hover": {
                      bgcolor: "#E4405F",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    width: 44,
                    height: 44,
                    "&:hover": {
                      bgcolor: "#FF0000",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: "1.1rem",
                  color: "#1A94FF",
                }}
              >
                {t("support")}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("helpCenter")}
                </Box>
                <Box
                  component={Link}
                  to="/policy/return"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("returns")}
                </Box>
                <Box
                  component={Link}
                  to="/shipping"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("shipping")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.orderGuide")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.shippingMethods")}
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: "1.1rem",
                  color: "#1A94FF",
                }}
              >
                {t("footer.aboutUs")}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box
                  component={Link}
                  to="/about"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("about")}
                </Box>
                <Box
                  component={Link}
                  to="/careers"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("careers")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.privacyPolicy")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.termsOfUse")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.aboutShopEaseXu")}
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: "1.1rem",
                  color: "#1A94FF",
                }}
              >
                {t("footer.cooperation")}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.operationRules")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.sellWithUs")}
                </Box>
                <Box
                  component={Link}
                  to="/help"
                  sx={{
                    color: "#E8E8E8",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "#1A94FF",
                      paddingLeft: 1,
                    },
                  }}
                >
                  {t("footer.affiliateMarketing")}
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: "1.1rem",
                  color: "#1A94FF",
                }}
              >
                {t("footer.paymentMethods")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
                <Chip
                  label="COD"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.25)",
                      borderColor: "#1A94FF",
                    },
                    transition: "all 0.2s",
                  }}
                />
                <Chip
                  label="VNPay"
                  size="small"
                  sx={{
                    bgcolor: "rgba(26,148,255,0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "1px solid rgba(26,148,255,0.5)",
                    "&:hover": {
                      bgcolor: "rgba(26,148,255,0.5)",
                    },
                    transition: "all 0.2s",
                  }}
                />
                <Chip
                  label="MoMo"
                  size="small"
                  sx={{
                    bgcolor: "rgba(165,0,100,0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "1px solid rgba(165,0,100,0.5)",
                    "&:hover": {
                      bgcolor: "rgba(165,0,100,0.5)",
                    },
                    transition: "all 0.2s",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: "1.1rem",
                  color: "#1A94FF",
                }}
              >
                {t("footer.deliveryServices")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                <Chip
                  label={t("footer.fastShipping")}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,66,78,0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "1px solid rgba(255,66,78,0.5)",
                    "&:hover": {
                      bgcolor: "rgba(255,66,78,0.5)",
                    },
                    transition: "all 0.2s",
                  }}
                />
                <Chip
                  label={t("footer.saverShipping")}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.25)",
                      borderColor: "#1A94FF",
                    },
                    transition: "all 0.2s",
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Divider
            sx={{
              my: 4,
              borderColor: "rgba(255,255,255,0.2)",
              borderWidth: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 3,
              pt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#B0B0B0",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {t("footer.copyright").replace(
                "{year}",
                String(new Date().getFullYear())
              )}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#E8E8E8",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                <strong style={{ color: "#1A94FF" }}>{t("hotline")}:</strong>{" "}
                {t("footer.hotlineFull")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#B0B0B0",
                  fontSize: "0.85rem",
                }}
              >
                {t("footer.email")}: {t("footer.emailValue")} •{" "}
                {t("footer.securityReport")}: {t("footer.securityEmail")}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <ChatWidget />
    </Box>
  );
};

export default MainLayout;
