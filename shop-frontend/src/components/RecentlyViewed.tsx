import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Product, productApi } from "../api/productApi";
import ProductCard from "./ProductCard";
import CloseIcon from "@mui/icons-material/Close";
import { useI18n } from "../i18n";

const RecentlyViewed: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    ) as number[];

    if (viewed.length > 0) {
      // Load products from IDs
      Promise.all(
        viewed.slice(0, 6).map((id) =>
          productApi
            .getOne(id)
            .then((res) => res.data)
            .catch(() => null)
        )
      ).then((results) => {
        setProducts(results.filter((p) => p !== null) as Product[]);
      });
    }

    // Listen for product views
    const handleProductView = (e: CustomEvent<number>) => {
      const productId = e.detail;
      const viewed = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      ) as number[];
      const updated = [
        productId,
        ...viewed.filter((id) => id !== productId),
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    };

    window.addEventListener(
      "product-viewed",
      handleProductView as EventListener
    );
    return () => {
      window.removeEventListener(
        "product-viewed",
        handleProductView as EventListener
      );
    };
  }, []);

  if (!show || products.length === 0) return null;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("recentlyViewed.title") || "Recently Viewed"}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setShow(false)}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(6, 1fr)",
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

export default RecentlyViewed;
