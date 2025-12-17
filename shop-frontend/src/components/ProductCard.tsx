import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Rating,
  IconButton,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import http from "../api/http";
import { useI18n } from "../i18n";
import { formatCurrency } from "../utils/currencyUtils";
import { useTheme } from "@mui/material/styles";
import WishlistButton from "./WishlistButton";

type Props = {
  product: any;
  onClick: () => void;
  onQuickView?: (productId: number) => void;
};

const ProductCard: React.FC<Props> = ({ product, onClick, onQuickView }) => {
  const { t, lang } = useI18n();
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
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
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
          )}
          {/* Action Buttons Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 2,
              "&:hover": { opacity: 1 },
              ".MuiCard:hover &": { opacity: 1 },
            }}
          >
            <WishlistButton productId={product.id} size="small" />
            {onQuickView && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product.id);
                }}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    bgcolor: "#fff",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <VisibilityIcon sx={{ fontSize: 18, color: "#1A94FF" }} />
              </IconButton>
            )}
          </Box>
        </Box>
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1.5 }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.9375rem",
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 44,
              lineHeight: 1.5,
              color: isDark ? "#e0e0e0" : "#1a1a1a",
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
