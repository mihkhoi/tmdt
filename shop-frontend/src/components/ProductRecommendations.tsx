import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Product } from "../api/productApi";
import { productApi } from "../api/productApi";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import LoadingSkeleton from "./LoadingSkeleton";

interface ProductRecommendationsProps {
  productId: number;
  category?: string;
  brand?: string;
  limit?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId,
  category,
  brand,
  limit = 8,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Fetch products from same category or brand
        const params: any = {
          page: 1,
          size: limit + 1, // +1 to exclude current product
        };

        if (category) {
          params.category = category;
        }
        if (brand) {
          params.brand = brand;
        }

        const response = await productApi.getProductsPage(params);
        const allProducts =
          response.content || response.products || response || [];

        // Filter out current product and limit results
        const filtered = allProducts
          .filter((p: Product) => p.id !== productId)
          .slice(0, limit);

        setProducts(filtered);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId, category, brand, limit]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {lang === "en" ? "You May Also Like" : "Có thể bạn quan tâm"}
        </Typography>
        <LoadingSkeleton variant="product" count={4} />
      </Paper>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        {lang === "en" ? "You May Also Like" : "Có thể bạn quan tâm"}
      </Typography>
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
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("product-viewed", { detail: product.id })
              );
              navigate(`/product/${product.id}`);
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default ProductRecommendations;
