import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Rating,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import http from "../api/http";
import { useI18n } from "../i18n";
<<<<<<< HEAD
import { formatCurrency } from "../utils/currencyUtils";
import { useTheme } from "@mui/material/styles";
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

type Props = {
  product: any;
  onClick: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  const { t, lang } = useI18n();
<<<<<<< HEAD
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Lấy tên sản phẩm theo ngôn ngữ
  const getProductName = () => {
    if (lang === "en" && product.nameEn) {
      return product.nameEn;
    }
    return product.name;
  };

  const productName = getProductName();

  const hasFlash =
    !!product.flashSaleEndAt &&
    new Date(product.flashSaleEndAt).getTime() > Date.now() &&
    product.discountPercent > 0;
=======
  const hasFlash = !!product.flashSaleEndAt && new Date(product.flashSaleEndAt).getTime() > Date.now() && product.discountPercent > 0;
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = hasDiscount
    ? Math.round(
        (Number(product.price) * (100 - Number(product.discountPercent))) / 100
      )
    : Number(product.price);
  const ratingValue =
    typeof product.averageRating === "number"
      ? product.averageRating
      : undefined;
  const ratingCount =
    typeof product.ratingCount === "number" ? product.ratingCount : 0;
  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      30 * 24 * 60 * 60 * 1000
    : false;
  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
<<<<<<< HEAD
  const absImageUrl = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;
  const eta = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const dowVN = ["CN", "2", "3", "4", "5", "6", "7"][eta.getDay()];
  const dowEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][eta.getDay()];
  const etaLabel =
    lang === "en"
      ? `${t("product.deliveryPrefix")} ${dowEN}, ${String(
          eta.getMonth() + 1
        ).padStart(2, "0")}/${String(eta.getDate()).padStart(2, "0")}`
      : `${t("product.deliveryPrefix")} thứ ${dowVN}, ${String(
          eta.getDate()
        ).padStart(2, "0")}/${String(eta.getMonth() + 1).padStart(2, "0")}`;

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid #E8E8E8",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#1e1e1e" : "#fff",
        position: "relative",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderColor: "#1A94FF",
          "& .product-image": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "100%",
            overflow: "hidden",
          }}
        >
=======
  const absImageUrl = (u: string) => (u && u.startsWith("/uploads/")) ? apiOrigin + u : u;
  const eta = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const dowVN = ["CN", "2", "3", "4", "5", "6", "7"][eta.getDay()];
<<<<<<< HEAD
  const dowEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][eta.getDay()];
  const etaLabel = lang === "en"
    ? `${t("product.deliveryPrefix")} ${dowEN}, ${String(eta.getMonth() + 1).padStart(2, "0")}/${String(eta.getDate()).padStart(2, "0")}`
    : `${t("product.deliveryPrefix")} thứ ${dowVN}, ${String(eta.getDate()).padStart(2, "0")}/${String(eta.getMonth() + 1).padStart(2, "0")}`;
=======
  const etaLabel = `Giao thứ ${dowVN}, ${String(eta.getDate()).padStart(2, "0")}/${String(eta.getMonth() + 1).padStart(2, "0")}`;
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
  const fmtMoney = (n: number) => {
    const currency = localStorage.getItem("currency") || "VND";
    const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
    if (currency === "USD") return `$${(Number(n || 0) / rate).toLocaleString("en-US")}`;
    return `${Number(n || 0).toLocaleString("vi-VN")} ₫`;
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardActionArea onClick={onClick}>
        <Box sx={{ position: "relative" }}>
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
          {product.imageUrl && (
            <CardMedia
              component="img"
              image={absImageUrl(product.imageUrl)}
              alt={productName}
              className="product-image"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          )}
<<<<<<< HEAD
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              zIndex: 1,
            }}
          >
            {hasFlash && (
              <Chip
                label={`FLASH SALE`}
                size="small"
                sx={{
                  bgcolor: "#FF424E",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                  px: 0.5,
                  boxShadow: "0 2px 4px rgba(255,66,78,0.3)",
                }}
              />
            )}
            {hasDiscount && !hasFlash && (
              <Chip
                label={`-${product.discountPercent}%`}
                size="small"
                sx={{
                  bgcolor: "#FF424E",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                  px: 0.5,
                  boxShadow: "0 2px 4px rgba(255,66,78,0.3)",
                }}
              />
            )}
            {isNew && (
              <Chip
                label={lang === "en" ? "NEW" : "MỚI"}
                size="small"
                sx={{
                  bgcolor: "#1A94FF",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                  px: 0.5,
                  boxShadow: "0 2px 4px rgba(26,148,255,0.3)",
                }}
              />
            )}
          </Box>
          {product.brand && (
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 12 }} />}
              label={lang === "en" ? "AUTHENTIC" : "CHÍNH HÃNG"}
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                left: 8,
                bgcolor: "#1A94FF",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 20,
                boxShadow: "0 2px 4px rgba(26,148,255,0.3)",
                "& .MuiChip-icon": { color: "#fff" },
              }}
            />
=======
          {hasFlash && (
            <Chip label={`Flash Sale -${product.discountPercent}%`} color="error" size="small" sx={{ position: "absolute", top: 8, left: 8 }} />
          )}
          {product.brand && (
<<<<<<< HEAD
            <Chip icon={<VerifiedIcon />} label={t("chip.authentic")} color="primary" size="small" sx={{ position: "absolute", top: 40, left: 8 }} />
=======
            <Chip icon={<VerifiedIcon />} label="CHÍNH HÃNG" color="primary" size="small" sx={{ position: "absolute", top: 40, left: 8 }} />
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          )}
          {isNew && (
            <Chip label={t("chip.new")} color="primary" size="small" sx={{ position: "absolute", top: 8, right: 8 }} />
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
          )}
        </Box>
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1.5 }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 40,
            }}
          >
            {productName}
          </Typography>
          {ratingValue ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.75,
                mt: 0.5,
              }}
            >
              <Rating
                value={Number(ratingValue)}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  fontSize: "0.95rem",
                  "& .MuiRating-iconFilled": {
                    color: "#FFC120",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: "#666",
                  fontWeight: 500,
                }}
              >
                ({ratingCount})
              </Typography>
            </Box>
          ) : null}
<<<<<<< HEAD
          <Box sx={{ mt: "auto" }}>
            {hasDiscount ? (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    mb: 0.5,
                    color: "#FF424E",
                  }}
                >
                  {formatCurrency(finalPrice)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "#FF424E",
                      color: "#fff",
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                    }}
                  >
                    -{product.discountPercent}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: "line-through",
                      color: "#999",
                      fontSize: "0.8rem",
                    }}
                  >
                    {formatCurrency(Number(product.price))}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#FF424E",
                }}
              >
                {formatCurrency(Number(product.price))}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.75,
                color: "#1A94FF",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            >
              {etaLabel}
            </Typography>
          </Box>
=======
          {hasDiscount ? (
            <Box>
              <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700 }}>
                {fmtMoney(finalPrice)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="error">-{product.discountPercent}%</Typography>
                <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                  {fmtMoney(Number(product.price))}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="subtitle2" color="primary">
              {fmtMoney(Number(product.price))}
            </Typography>
          )}
          {product.brand ? (
<<<<<<< HEAD
            <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>{t("product.brandLabel")} {product.brand}</Typography>
=======
            <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>Thương hiệu {product.brand}</Typography>
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          ) : null}
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>{etaLabel}</Typography>
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
