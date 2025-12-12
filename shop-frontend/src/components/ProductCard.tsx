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

type Props = {
  product: any;
  onClick: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  const { t, lang } = useI18n();
  const hasFlash = !!product.flashSaleEndAt && new Date(product.flashSaleEndAt).getTime() > Date.now() && product.discountPercent > 0;
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = hasDiscount ? Math.round(Number(product.price) * (100 - Number(product.discountPercent)) / 100) : Number(product.price);
  const ratingValue = typeof product.averageRating === "number" ? product.averageRating : undefined;
  const ratingCount = typeof product.ratingCount === "number" ? product.ratingCount : 0;
  const isNew = product.createdAt ? (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 : false;
  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const absImageUrl = (u: string) => (u && u.startsWith("/uploads/")) ? apiOrigin + u : u;
  const eta = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const dowVN = ["CN", "2", "3", "4", "5", "6", "7"][eta.getDay()];
  const dowEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][eta.getDay()];
  const etaLabel = lang === "en"
    ? `${t("product.deliveryPrefix")} ${dowEN}, ${String(eta.getMonth() + 1).padStart(2, "0")}/${String(eta.getDate()).padStart(2, "0")}`
    : `${t("product.deliveryPrefix")} thứ ${dowVN}, ${String(eta.getDate()).padStart(2, "0")}/${String(eta.getMonth() + 1).padStart(2, "0")}`;
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
          {product.imageUrl && (
            <CardMedia component="img" height="160" image={absImageUrl(product.imageUrl)} alt={product.name} />
          )}
          {hasFlash && (
            <Chip label={`Flash Sale -${product.discountPercent}%`} color="error" size="small" sx={{ position: "absolute", top: 8, left: 8 }} />
          )}
          {product.brand && (
            <Chip icon={<VerifiedIcon />} label={t("chip.authentic")} color="primary" size="small" sx={{ position: "absolute", top: 40, left: 8 }} />
          )}
          {isNew && (
            <Chip label={t("chip.new")} color="primary" size="small" sx={{ position: "absolute", top: 8, right: 8 }} />
          )}
        </Box>
        <CardContent>
          <Typography variant="subtitle1" noWrap>
            {product.name}
          </Typography>
          {ratingValue ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Rating value={Number(ratingValue)} precision={0.5} readOnly size="small" />
              <Typography variant="caption">({ratingCount})</Typography>
            </Box>
          ) : null}
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
            <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>{t("product.brandLabel")} {product.brand}</Typography>
          ) : null}
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>{etaLabel}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
