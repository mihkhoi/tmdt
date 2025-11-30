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
import http from "../api/http";

type Props = {
  product: any;
  onClick: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onClick }) => {
  const hasFlash = !!product.flashSaleEndAt && new Date(product.flashSaleEndAt).getTime() > Date.now() && product.discountPercent > 0;
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = hasDiscount ? Math.round(Number(product.price) * (100 - Number(product.discountPercent)) / 100) : Number(product.price);
  const ratingValue = typeof product.averageRating === "number" ? product.averageRating : undefined;
  const ratingCount = typeof product.ratingCount === "number" ? product.ratingCount : 0;
  const isNew = product.createdAt ? (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 : false;
  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const absImageUrl = (u: string) => (u && u.startsWith("/uploads/")) ? apiOrigin + u : u;

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <Box sx={{ position: "relative" }}>
          {product.imageUrl && (
            <CardMedia component="img" height="160" image={absImageUrl(product.imageUrl)} alt={product.name} />
          )}
          {hasFlash && (
            <Chip label={`Flash Sale -${product.discountPercent}%`} color="error" size="small" sx={{ position: "absolute", top: 8, left: 8 }} />
          )}
          {isNew && (
            <Chip label="New" color="primary" size="small" sx={{ position: "absolute", top: 8, right: 8 }} />
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
                {finalPrice} ₫
              </Typography>
              <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                {product.price} ₫
              </Typography>
            </Box>
          ) : (
            <Typography variant="subtitle2" color="primary">
              {product.price} ₫
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
