import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Skeleton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProductCard from "./ProductCard";
import { productApi, Product } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  queryParams?: {
    category?: string;
    sort?: string;
    newOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
  };
  limit?: number;
  showViewAll?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  queryParams = {},
  limit = 8,
  showViewAll = true,
}) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProductsPage({
          page: 0,
          size: limit,
          category: queryParams.category,
          sort: queryParams.sort,
          newOnly: queryParams.newOnly,
          minPrice: queryParams.minPrice,
          maxPrice: queryParams.maxPrice,
        });
        const list = Array.isArray(res?.content) ? res.content : [];
        setProducts(list);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    limit,
    queryParams.category,
    queryParams.sort,
    queryParams.newOnly,
    queryParams.minPrice,
    queryParams.maxPrice,
  ]);

  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (queryParams.category) params.set("category", queryParams.category);
    if (queryParams.sort) params.set("sort", queryParams.sort);
    if (queryParams.newOnly) params.set("newOnly", "true");
    navigate({ pathname: "/", search: params.toString() });
  };

  if (loading && products.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={280}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {showViewAll && (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={handleViewAll}
            sx={{ textTransform: "none" }}
          >
            {t("section.viewAll")}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {products.map((product) => (
          <Box key={product.id}>
            <ProductCard
              product={product}
              onClick={() => navigate(`/product/${product.id}`)}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ProductSection;
