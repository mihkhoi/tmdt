import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProductCard from "./ProductCard";
import { productApi, Product } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

const FlashSaleSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProductsPage({
          page: 0,
          size: 8,
        });
        const allProducts = Array.isArray(res?.content) ? res.content : [];
        const flashProducts = allProducts.filter((p: Product) => {
          if (!p.flashSaleEndAt || !p.discountPercent) return false;
          const endTime = new Date(p.flashSaleEndAt).getTime();
          return endTime > Date.now() && p.discountPercent > 0;
        });
        setProducts(flashProducts.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch flash sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();

    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FlashOnIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {t("flashSale.title")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t("flashSale.subtitle")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(255,255,255,0.2)",
            px: 2,
            py: 1,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              minWidth: 50,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {String(timeLeft.hours).padStart(2, "0")}
            </Typography>
            <Typography variant="caption">{t("flashSale.hours")}</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            :
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              minWidth: 50,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {String(timeLeft.minutes).padStart(2, "0")}
            </Typography>
            <Typography variant="caption">{t("flashSale.minutes")}</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            :
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              minWidth: 50,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {String(timeLeft.seconds).padStart(2, "0")}
            </Typography>
            <Typography variant="caption">{t("flashSale.seconds")}</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/?category=giam-gia-sau")}
          sx={{
            bgcolor: "#fff",
            color: "error.main",
            fontWeight: 700,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          {t("flashSale.viewAll")}
        </Button>
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

export default FlashSaleSection;
