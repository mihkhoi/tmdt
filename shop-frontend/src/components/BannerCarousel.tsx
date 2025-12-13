import React, { useState, useEffect } from "react";
import { Box, Paper, IconButton, Typography, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  gradient?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

const BannerCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: Banner[] = [
    {
      id: "1",
      title: t("home.hero.title"),
      subtitle: t("home.hero.subtitle"),
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      ctaText: t("home.hero.cta"),
      ctaAction: () => navigate("/?category=giam-gia-sau"),
    },
    {
      id: "2",
      title: t("banner.freeship.title"),
      subtitle: t("banner.freeship.subtitle"),
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      ctaText: t("banner.freeship.cta"),
      ctaAction: () => navigate("/?minPrice=100000"),
    },
    {
      id: "3",
      title: t("banner.newArrivals.title"),
      subtitle: t("banner.newArrivals.subtitle"),
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      ctaText: t("banner.newArrivals.cta"),
      ctaAction: () => navigate("/?newOnly=true"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <Box sx={{ position: "relative", mb: 3 }}>
      <Paper
        sx={{
          height: { xs: 200, md: 300 },
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          background: currentBanner.gradient,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 6 },
          }}
        >
          <Box sx={{ flex: 1, zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: "1.5rem", md: "2.5rem" },
              }}
            >
              {currentBanner.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.95,
                mb: 3,
                fontSize: { xs: "0.9rem", md: "1.25rem" },
              }}
            >
              {currentBanner.subtitle}
            </Typography>
            {currentBanner.ctaText && (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={currentBanner.ctaAction}
                sx={{
                  bgcolor: "#fff",
                  color: "primary.main",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                {currentBanner.ctaText}
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 300,
              height: 200,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          />
        </Box>

        <IconButton
          onClick={goToPrevious}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            zIndex: 2,
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={goToNext}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.2)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            zIndex: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 2,
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex === index ? 32 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor:
                  currentIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default BannerCarousel;
