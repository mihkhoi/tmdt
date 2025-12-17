import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Product } from "../api/productApi";
import http from "../api/http";
import { formatCurrency } from "../utils/currencyUtils";
import WishlistButton from "./WishlistButton";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

interface ProductQuickViewProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  open,
  onClose,
  productId,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      http
        .get(`/products/${productId}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.error("Failed to load product:", err);
          setProduct(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setProduct(null);
      setLoading(false);
    }
  }, [open, productId]);

  const handleAddToCart = () => {
    if (product && product.stock && product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
      onClose();
    }
  };

  const handleViewDetails = () => {
    if (product) {
      navigate(`/product/${product.id}`);
      onClose();
    }
  };

  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Quick View
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box>
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Skeleton variant="text" width="60%" height={32} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          </Box>
        ) : product ? (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 300 } }}>
              <Box
                component="img"
                src={toAbs(product.imageUrl || "")}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  objectFit: "cover",
                  maxHeight: 400,
                }}
              />
            </Box>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
                  {product.name}
                </Typography>
                <WishlistButton productId={product.id} size="small" />
              </Box>

              {product.brand && (
                <Chip
                  label={product.brand}
                  size="small"
                  sx={{ mb: 2, width: "fit-content" }}
                />
              )}

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Rating
                  value={product.averageRating || 0}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.ratingCount || 0} reviews)
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#FF424E",
                    mb: 1,
                  }}
                >
                  {formatCurrency(product.price)}
                </Typography>
                {product.discountPercent && product.discountPercent > 0 && (
                  <Chip
                    label={`-${product.discountPercent}%`}
                    color="error"
                    size="small"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {product.description || "No description available"}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleViewDetails}
                  sx={{ borderRadius: 2 }}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCartIcon />}
                  disabled={!product.stock || product.stock <= 0}
                  sx={{
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>Product not found</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
