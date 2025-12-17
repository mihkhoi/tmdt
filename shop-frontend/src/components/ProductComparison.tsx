import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../api/productApi";
import { productApi } from "../api/productApi";
import { formatCurrency } from "../utils/currencyUtils";
import http from "../api/http";
import { useI18n } from "../i18n";

interface ProductComparisonProps {
  open: boolean;
  onClose: () => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  open,
  onClose,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { lang } = useI18n();

  useEffect(() => {
    if (open) {
      const compared = JSON.parse(
        localStorage.getItem("comparedProducts") || "[]"
      ) as number[];
      if (compared.length > 0) {
        Promise.all(compared.map((id) => productApi.getOne(id)))
          .then((responses) => {
            setProducts(responses.map((res) => res.data));
          })
          .catch((err) => {
            console.error("Failed to load products:", err);
            setProducts([]);
          });
      }
    }
  }, [open]);

  const removeProduct = (productId: number) => {
    const compared = JSON.parse(
      localStorage.getItem("comparedProducts") || "[]"
    ) as number[];
    const updated = compared.filter((id) => id !== productId);
    localStorage.setItem("comparedProducts", JSON.stringify(updated));
    setProducts(products.filter((p) => p.id !== productId));
  };

  const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
  const toAbs = (u: string) =>
    u && u.startsWith("/uploads/") ? apiOrigin + u : u;

  if (products.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {lang === "en" ? "Product Comparison" : "So sánh sản phẩm"}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {lang === "en"
                ? "No products to compare. Add products from product pages."
                : "Chưa có sản phẩm để so sánh. Thêm sản phẩm từ trang chi tiết."}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const attributes = [
    { key: "name", label: lang === "en" ? "Product" : "Sản phẩm" },
    { key: "price", label: lang === "en" ? "Price" : "Giá" },
    { key: "brand", label: lang === "en" ? "Brand" : "Thương hiệu" },
    { key: "rating", label: lang === "en" ? "Rating" : "Đánh giá" },
    { key: "stock", label: lang === "en" ? "Stock" : "Tồn kho" },
    { key: "discount", label: lang === "en" ? "Discount" : "Giảm giá" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {lang === "en" ? "Product Comparison" : "So sánh sản phẩm"} (
            {products.length})
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                  {lang === "en" ? "Attribute" : "Thuộc tính"}
                </TableCell>
                {products.map((product) => (
                  <TableCell
                    key={product.id}
                    align="center"
                    sx={{ minWidth: 200 }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        src={toAbs(product.imageUrl || "")}
                        alt={product.name}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1,
                          mb: 1,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeProduct(product.id)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "error.main",
                          color: "#fff",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mt: 1 }}
                      >
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((attr) => (
                <TableRow key={attr.key}>
                  <TableCell sx={{ fontWeight: 600 }}>{attr.label}</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {attr.key === "name" && (
                        <Typography variant="body2">{product.name}</Typography>
                      )}
                      {attr.key === "price" && (
                        <Typography
                          variant="h6"
                          sx={{ color: "#FF424E", fontWeight: 700 }}
                        >
                          {formatCurrency(product.price)}
                        </Typography>
                      )}
                      {attr.key === "brand" && (
                        <Chip
                          label={product.brand || "-"}
                          size="small"
                          sx={{ bgcolor: "#E3F2FD", color: "#1A94FF" }}
                        />
                      )}
                      {attr.key === "rating" && (
                        <Box>
                          <Rating
                            value={product.averageRating || 0}
                            readOnly
                            precision={0.5}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({product.ratingCount || 0})
                          </Typography>
                        </Box>
                      )}
                      {attr.key === "stock" && (
                        <Chip
                          label={
                            (product.stock || 0) > 0
                              ? `${product.stock} ${
                                  lang === "en" ? "items" : "sản phẩm"
                                }`
                              : lang === "en"
                              ? "Out of stock"
                              : "Hết hàng"
                          }
                          size="small"
                          color={(product.stock || 0) > 0 ? "success" : "error"}
                        />
                      )}
                      {attr.key === "discount" && (
                        <Chip
                          label={
                            product.discountPercent &&
                            product.discountPercent > 0
                              ? `-${product.discountPercent}%`
                              : "-"
                          }
                          size="small"
                          color={
                            product.discountPercent &&
                            product.discountPercent > 0
                              ? "error"
                              : "default"
                          }
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparison;
