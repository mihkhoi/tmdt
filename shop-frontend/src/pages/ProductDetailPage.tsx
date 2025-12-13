import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productApi } from "../api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addToCart } from "../store/cartSlice";
import http from "../api/http";
import {
  Chip,
  Rating,
  Box,
  Button,
  Typography,
  Divider,
  LinearProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SellIcon from "@mui/icons-material/Sell";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ProductCard from "../components/ProductCard";
import { useI18n } from "../i18n";
import { getProductName } from "../utils/productUtils";
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../utils/currencyUtils";

import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SellIcon from "@mui/icons-material/Sell";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ProductCard from "../components/ProductCard";
<<<<<<< HEAD
import { useI18n } from "../i18n";
=======
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2

const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
const toAbs = (u: string) =>
  u && u.startsWith("/uploads/") ? apiOrigin + u : u;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { t, lang } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
=======
  const { t } = useI18n();
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [stats, setStats] = useState<any>(null);
  const auth = useSelector((s: RootState) => s.auth);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [onlyComment, setOnlyComment] = useState(false);
  const [onlyMedia, setOnlyMedia] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [related, setRelated] = useState<any[]>([]);
<<<<<<< HEAD
  const [tabValue, setTabValue] = useState(0);
=======
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      const res = await productApi.getOne(Number(id));
      setProduct(res.data);
    } catch (err: any) {
      setProduct(null);
      console.error("Load product failed", err?.message || err);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await http.get(`/products/${id}/reviews`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch {
      setReviews([]);
    }
  }, [id]);

  const fetchImages = useCallback(async () => {
    if (!id) return;
    try {
      const res = await http.get(`/products/${id}/images`);
      setImages(Array.isArray(res.data) ? res.data : []);
    } catch {
      setImages([]);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchImages();
    (async () => {
      if (!id) return;
      try {
        const res = await http.get(`/products/${id}/stats`);
        setStats(res.data);
      } catch {}
    })();
  }, [id, fetchProduct, fetchReviews, fetchImages]);

  useEffect(() => {
    if (product?.imageUrl) setMainImage(toAbs(product.imageUrl));
  }, [product]);

  useEffect(() => {
    (async () => {
      try {
        const cat = product?.category?.slug || product?.category?.name || "";
        if (!cat) return;
        const res = await productApi.getProductsPage({
          category: cat,
          page: 0,
          size: 8,
        });
        const list = Array.isArray(res?.content) ? res.content : [];
        setRelated(list.filter((p: any) => p.id !== product.id));
      } catch {
        setRelated([]);
      }
    })();
  }, [product]);

  useEffect(() => {
    if (!mainImage && images.length > 0) {
      const first = images[0]?.url;
      if (first) setMainImage(toAbs(first));
    }
  }, [images, mainImage]);

  if (!product)
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>
          {lang === "en"
            ? "Product not found or loading..."
            : "Không tìm thấy sản phẩm hoặc đang tải..."}
        </Typography>
      </Box>
    );

  const hasDiscount = Number(product?.discountPercent || 0) > 0;
  const finalPrice = hasDiscount
    ? Math.round(
        (Number(product.price) * (100 - Number(product.discountPercent))) / 100
      )
    : Number(product.price);
  const isFlash =
    !!product.flashSaleEndAt &&
    new Date(product.flashSaleEndAt).getTime() > Date.now() &&
    hasDiscount;
  const isNew =
    product.createdAt &&
    new Date(product.createdAt).getTime() >
      Date.now() - 30 * 24 * 60 * 60 * 1000;
  const avg = Number(stats?.averageRating ?? product.averageRating ?? 0);
  const rc = Number(stats?.ratingCount ?? product.ratingCount ?? 0);
  const sold = Number(stats?.soldCount ?? 0);
<<<<<<< HEAD
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: lang === "en" ? "Black" : "Đen", code: "#000" },
    { name: lang === "en" ? "White" : "Trắng", code: "#fff" },
    { name: lang === "en" ? "Blue" : "Xanh", code: "#1A94FF" },
    { name: lang === "en" ? "Red" : "Đỏ", code: "#FF424E" },
  ];
  const shippingTo =
    localStorage.getItem("deliveryLocation") ||
    (lang === "en" ? "Ho Chi Minh City" : "TP. Hồ Chí Minh");
=======
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Đen", "Trắng", "Xanh", "Đỏ"];
  const shippingTo = "TP. Hồ Chí Minh";
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 1400,
        mx: "auto",
        bgcolor: isDark ? "#121212" : "transparent",
        minHeight: "100vh",
      }}
    >
      {/* Main Product Section - Tiki Style */}
      <Box
        sx={{
          display: "grid",
<<<<<<< HEAD
          gridTemplateColumns: { xs: "1fr", md: "500px 1fr 380px" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Image Gallery - Tiki Style */}
        <Card
          sx={{
            border: "1px solid #E8E8E8",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, p: 1 }}>
            {/* Thumbnail List */}
            <Box
              sx={{
                width: 80,
=======
          gridTemplateColumns: { xs: "1fr", md: "520px 1fr 320px" },
          gap: 2,
          mb: 2,
          alignItems: "start",
        }}
      >
        <Paper sx={{ p: 1, alignSelf: "start" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 64,
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
                display: "flex",
                flexDirection: "column",
                gap: 1,
                overflowY: "auto",
                maxHeight: 500,
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "#ccc",
                  borderRadius: 2,
                },
              }}
            >
<<<<<<< HEAD
              {images.length > 0
                ? images.map((im) => (
                    <Box
                      key={im.id}
                      onClick={() => setMainImage(toAbs(im.url))}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 1,
                        border:
                          mainImage === toAbs(im.url)
                            ? "2px solid #1A94FF"
                            : "1px solid #E8E8E8",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "#1A94FF",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={toAbs(im.url)}
                        alt="thumb"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))
                : product.imageUrl && (
                    <Box
                      onClick={() => setMainImage(toAbs(product.imageUrl))}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 1,
                        border:
                          mainImage === toAbs(product.imageUrl)
                            ? "2px solid #1A94FF"
                            : "1px solid #E8E8E8",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        component="img"
                        src={toAbs(product.imageUrl)}
                        alt="thumb"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
=======
              {images.map((im) => (
                <img
                  key={im.id}
                  src={toAbs(im.url)}
                  alt="thumb"
                  onClick={() => setMainImage(toAbs(im.url))}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 6,
                    cursor: "pointer",
                    border:
                      mainImage === toAbs(im.url)
                        ? "2px solid #1976d2"
                        : "1px solid #eee",
                  }}
                />
              ))}
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
            </Box>

            {/* Main Image */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
<<<<<<< HEAD
                minHeight: 500,
                bgcolor: "#F5F5F5",
                position: "relative",
=======
                minHeight: 360,
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
              }}
            >
              {mainImage && (
                <Box
                  component="img"
                  src={mainImage}
<<<<<<< HEAD
                  alt={getProductName(product, lang)}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 500,
                    objectFit: "contain",
                  }}
                />
              )}
              {isFlash && (
                <Chip
                  icon={<FlashOnIcon />}
                  label="FLASH SALE"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    bgcolor: "#FF424E",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.75rem",
=======
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    height: 360,
                    objectFit: "contain",
                    borderRadius: 8,
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
                  }}
                />
              )}
            </Box>
          </Box>
        </Card>

        {/* Product Info - Tiki Style */}
        <Box>
          {/* Product Name & Rating */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: "#333",
              fontSize: { xs: "1.5rem", md: "2rem" },
              lineHeight: 1.3,
            }}
          >
            {getProductName(product, lang)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            {avg > 0 && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Rating
                    value={avg}
                    precision={0.5}
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#FFC120",
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#FF424E", ml: 0.5 }}
                  >
                    {avg.toFixed(1)}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" color="text.secondary">
                  ({rc} {lang === "en" ? "reviews" : "đánh giá"})
                </Typography>
                {sold > 0 && (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body2" color="text.secondary">
                      {lang === "en" ? "Sold" : "Đã bán"}: {sold}
                    </Typography>
                  </>
                )}
              </>
            )}
          </Box>

          {/* Price Section - Tiki Style */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#FFF4E6",
              borderRadius: 2,
              border: "1px solid #FFE0B2",
              mb: 2,
            }}
          >
            {hasDiscount ? (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#FF424E",
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                    }}
                  >
                    {formatCurrency(finalPrice)}
                  </Typography>
                  <Chip
                    label={`-${product.discountPercent}%`}
                    sx={{
                      bgcolor: "#FF424E",
                      color: "#fff",
                      fontWeight: 700,
                      height: 28,
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: "line-through",
                    color: "#999",
                    fontSize: "1.1rem",
                  }}
                >
                  {formatCurrency(Number(product.price))}
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#FF424E",
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                {formatCurrency(Number(product.price))}
              </Typography>
            )}
<<<<<<< HEAD
            {isFlash && (
              <Box
                sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}
              >
                <FlashOnIcon sx={{ color: "#FF424E", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#FF424E", fontWeight: 600 }}
                >
                  {lang === "en" ? "Flash sale ends" : "Flash sale kết thúc"}:{" "}
                  {new Date(product.flashSaleEndAt).toLocaleString(
                    lang === "en" ? "en-US" : "vi-VN"
                  )}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Promotions - Tiki Style */}
          <Card
            sx={{
              mb: 2,
              border: "1px solid #E8E8E8",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1.5, color: "#1A94FF" }}
              >
                {lang === "en" ? "Promotions" : "Khuyến mãi"}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    bgcolor: "#F5F5F5",
                    borderRadius: 1,
                  }}
                >
                  <CardGiftcardIcon sx={{ color: "#FF424E", fontSize: 20 }} />
                  <Typography variant="body2">
                    {lang === "en"
                      ? "Discount 10k for orders over 500k"
                      : "Giảm 10k cho đơn từ 500k"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    bgcolor: "#F5F5F5",
                    borderRadius: 1,
                  }}
                >
                  <LocalShippingIcon sx={{ color: "#1A94FF", fontSize: 20 }} />
                  <Typography variant="body2">
                    {lang === "en"
                      ? "Free shipping for orders over 100k"
                      : "Freeship cho đơn từ 100k"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
=======
            {isFlash ? (
              <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                Flash sale đến:{" "}
                {new Date(product.flashSaleEndAt).toLocaleString()}
              </Typography>
            ) : null}
          </Box>
          <Paper sx={{ p: 1, mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip icon={<CardGiftcardIcon />} label="Giảm 10k" size="small" />
              <Chip icon={<CardGiftcardIcon />} label="Giảm 50k" size="small" />
              <Chip
                icon={<LocalOfferIcon />}
<<<<<<< HEAD
                label={t("chip.freeshipDomestic")}
=======
                label="Freeship nội địa"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                size="small"
              />
            </Box>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Chọn kích thước
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {sizes.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  clickable
                  color={selectedSize === s ? "primary" : "default"}
                  onClick={() => setSelectedSize(s)}
                />
              ))}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 1, mt: 2 }}
            >
              Chọn màu sắc
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {colors.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  clickable
                  color={selectedColor === c ? "primary" : "default"}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </Box>
          </Paper>
          <div style={{ marginTop: 8 }}>
            <Chip label={product.status} size="small" />
            {isNew && (
              <Chip
                label="New"
                color="success"
                size="small"
                style={{ marginLeft: 8 }}
              />
            )}
          </div>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Thông tin vận chuyển
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "160px 1fr" },
                rowGap: 1,
                columnGap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Giao đến
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{shippingTo}</Typography>
                <Button variant="text" size="small">
                  Đổi
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Freeship
              </Typography>
              <Typography variant="body2">
                Đơn từ 100k • Tiết kiệm 25k
              </Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 1, mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
<<<<<<< HEAD
              <Chip icon={<VerifiedIcon />} label={t("chip.authentic")} />
              <Chip icon={<LocalShippingIcon />} label={t("chip.deliveryFast")} />
              <Chip icon={<AutorenewIcon />} label={t("chip.returns30")} />
              <Chip icon={<SellIcon />} label={t("chip.goodPrice")} />
=======
              <Chip icon={<VerifiedIcon />} label="Hàng chính hãng" />
              <Chip icon={<LocalShippingIcon />} label="Giao nhanh" />
              <Chip icon={<AutorenewIcon />} label="Đổi trả 30 ngày" />
              <Chip icon={<SellIcon />} label="Giá tốt" />
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Chip
                icon={<StorefrontIcon />}
<<<<<<< HEAD
                label={`${t("product.brandLabel")}: ${product.brand || "ShopEase"}`}
              />
              <Chip icon={<LocationOnIcon />} label={t("chip.nationwide")} />
=======
                label={`Bán bởi: ${product.brand || "ShopEase"}`}
              />
              <Chip icon={<LocationOnIcon />} label="Giao hàng toàn quốc" />
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
            </Box>
          </Paper>
        </Box>
        <Paper sx={{ p: 2, position: "sticky", top: 16, alignSelf: "start" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {hasDiscount
                ? finalPrice.toLocaleString("vi-VN")
                : Number(product.price).toLocaleString("vi-VN")}{" "}
              ₫
            </Typography>
            {hasDiscount && (
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                {Number(product.price).toLocaleString("vi-VN")} ₫
              </Typography>
            )}
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", mb: 0.5 }}
          >
            Tạm tính
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              style={{
                width: 70,
                padding: 6,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </Box>
          <Button
            fullWidth
            sx={{ mb: 0.75, bgcolor: "#f94144" }}
            variant="contained"
            disabled={Number(product.stock ?? 0) <= 0}
            onClick={() => {
              if (auth.token) {
                for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
                navigate("/cart");
              } else {
                navigate(`/guest-checkout?pid=${product.id}&qty=${quantity}`);
              }
            }}
          >
            Mua ngay
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 0.75 }}
            disabled={Number(product.stock ?? 0) <= 0}
            onClick={() => {
              for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
              setSnackOpen(true);
            }}
          >
            Thêm vào giỏ
          </Button>
          <Button fullWidth variant="outlined">
            Mua trước trả sau
          </Button>
        </Paper>
      </Box>

      {related.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Sản phẩm tương tự
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            }}
          >
            {related.map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => navigate(`/product/${p.id}`)}
              />
            ))}
          </Box>
        </Paper>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          Đã thêm vào giỏ hàng
        </Alert>
      </Snackbar>
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551

          {/* Size & Color Selection - Tiki Style */}
          <Card
            sx={{
              mb: 2,
              border:
                !selectedSize || !selectedColor
                  ? "2px solid #FF9800"
                  : "1px solid #E8E8E8",
              borderRadius: 2,
              bgcolor:
                !selectedSize || !selectedColor
                  ? "rgba(255,152,0,0.05)"
                  : "#fff",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#333" }}
                >
                  {lang === "en" ? "Size" : "Kích thước"}
                </Typography>
                {!selectedSize && (
                  <Chip
                    label={lang === "en" ? "Required" : "Bắt buộc"}
                    size="small"
                    sx={{
                      bgcolor: "#FF9800",
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {sizes.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    clickable
                    onClick={() => setSelectedSize(s)}
                    sx={{
                      bgcolor: selectedSize === s ? "#1A94FF" : "#F5F5F5",
                      color: selectedSize === s ? "#fff" : "#333",
                      fontWeight: 600,
                      border: selectedSize === s ? "none" : "1px solid #E8E8E8",
                      "&:hover": {
                        bgcolor: selectedSize === s ? "#0D7AE6" : "#E8E8E8",
                      },
                    }}
                  />
                ))}
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#333" }}
                >
                  {lang === "en" ? "Color" : "Màu sắc"}
                </Typography>
                {!selectedColor && (
                  <Chip
                    label={lang === "en" ? "Required" : "Bắt buộc"}
                    size="small"
                    sx={{
                      bgcolor: "#FF9800",
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {colors.map((c) => (
                  <Chip
                    key={c.name}
                    label={c.name}
                    clickable
                    onClick={() => setSelectedColor(c.name)}
                    sx={{
                      bgcolor: selectedColor === c.name ? "#1A94FF" : "#F5F5F5",
                      color: selectedColor === c.name ? "#fff" : "#333",
                      fontWeight: 600,
                      border:
                        selectedColor === c.name ? "none" : "1px solid #E8E8E8",
                      "&:hover": {
                        bgcolor:
                          selectedColor === c.name ? "#0D7AE6" : "#E8E8E8",
                      },
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

<<<<<<< HEAD
          {/* Shipping Info - Tiki Style */}
          <Card
            sx={{
              mb: 2,
              border: "1px solid #E8E8E8",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <LocationOnIcon sx={{ color: "#1A94FF", fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#333" }}
                >
                  {lang === "en" ? "Delivery" : "Vận chuyển"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "120px 1fr" },
                  gap: 1.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {lang === "en" ? "Deliver to" : "Giao đến"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {shippingTo}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      color: "#1A94FF",
                      textTransform: "none",
                      minWidth: "auto",
                      px: 1,
                    }}
                  >
                    {lang === "en" ? "Change" : "Đổi"}
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {lang === "en" ? "Shipping fee" : "Phí vận chuyển"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#4CAF50", fontWeight: 500 }}
                >
                  {lang === "en"
                    ? "Free for orders over 100k"
                    : "Miễn phí cho đơn từ 100k"}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Trust Badges - Tiki Style */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              p: 2,
              bgcolor: "#F5F5F5",
              borderRadius: 2,
            }}
          >
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 16, color: "#1A94FF" }} />}
              label={t("chip.authentic")}
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E8E8E8",
                fontWeight: 600,
              }}
            />
            <Chip
              icon={
                <LocalShippingIcon sx={{ fontSize: 16, color: "#1A94FF" }} />
              }
              label={t("chip.deliveryFast")}
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E8E8E8",
                fontWeight: 600,
              }}
            />
            <Chip
              icon={<AutorenewIcon sx={{ fontSize: 16, color: "#1A94FF" }} />}
              label={t("chip.returns30")}
              sx={{
                bgcolor: "#fff",
                border: "1px solid #E8E8E8",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Buy Box - Tiki Style */}
        <Card
          sx={{
            border: "1px solid #E8E8E8",
            borderRadius: 2,
            position: "sticky",
            top: 16,
            alignSelf: "start",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Price in Buy Box */}
            <Box sx={{ mb: 2 }}>
              {hasDiscount ? (
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#FF424E",
                      mb: 0.5,
                      fontSize: "2rem",
                    }}
                  >
                    {formatCurrency(finalPrice)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "#999",
                      }}
                    >
                      {formatCurrency(Number(product.price))}
                    </Typography>
                    <Chip
                      label={`-${product.discountPercent}%`}
                      size="small"
                      sx={{
                        bgcolor: "#FF424E",
                        color: "#fff",
                        fontWeight: 700,
                        height: 22,
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#FF424E",
                    fontSize: "2rem",
                  }}
                >
                  {formatCurrency(Number(product.price))}
                </Typography>
              )}
            </Box>

            {/* Quantity Selector */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: "#333" }}
              >
                {lang === "en" ? "Quantity" : "Số lượng"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  sx={{
                    border: "1px solid #E8E8E8",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      borderColor: "#1A94FF",
                      bgcolor: "rgba(26,148,255,0.1)",
                    },
                  }}
                >
                  -
                </IconButton>
                <Box
                  sx={{
                    width: 60,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #E8E8E8",
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  {quantity}
                </Box>
                <IconButton
                  onClick={() => setQuantity(quantity + 1)}
                  sx={{
                    border: "1px solid #E8E8E8",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      borderColor: "#1A94FF",
                      bgcolor: "rgba(26,148,255,0.1)",
                    },
                  }}
                >
                  +
                </IconButton>
              </Box>
            </Box>

            {/* Stock Status */}
            {Number(product.stock ?? 0) > 0 ? (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  bgcolor: "#E8F5E9",
                  color: "#2E7D32",
                  border: "1px solid #A5D6A7",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {lang === "en"
                    ? `In stock (${product.stock} items)`
                    : `Còn hàng (${product.stock} sản phẩm)`}
                </Typography>
              </Alert>
            ) : (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                }}
              >
                {lang === "en" ? "Out of stock" : "Hết hàng"}
              </Alert>
            )}

            {/* Validation Messages */}
            {(!selectedSize || !selectedColor) && (
              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  bgcolor: "#FFF4E6",
                  border: "1px solid #FFE0B2",
                  "& .MuiAlert-icon": {
                    color: "#FF9800",
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {lang === "en"
                    ? "Please select size and color before adding to cart"
                    : "Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ"}
                </Typography>
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                fullWidth
                variant="contained"
                disabled={
                  Number(product.stock ?? 0) <= 0 ||
                  !selectedSize ||
                  !selectedColor
                }
                onClick={() => {
                  if (!selectedSize || !selectedColor) {
                    setSnackMessage(
                      lang === "en"
                        ? "Please select size and color"
                        : "Vui lòng chọn kích thước và màu sắc"
                    );
                    setSnackSeverity("warning");
                    setSnackOpen(true);
                    return;
                  }
                  if (auth.token) {
                    for (let i = 0; i < quantity; i++)
                      dispatch(
                        addToCart({
                          ...product,
                          selectedSize,
                          selectedColor,
                        })
                      );
                    setSnackMessage(
                      lang === "en" ? "Added to cart" : "Đã thêm vào giỏ hàng"
                    );
                    setSnackSeverity("success");
                    setSnackOpen(true);
                    // Navigate to checkout after a brief delay to show notification
                    setTimeout(() => {
                      navigate("/checkout");
                    }, 500);
                  } else {
                    navigate(
                      `/guest-checkout?pid=${product.id}&qty=${quantity}&size=${selectedSize}&color=${selectedColor}`
                    );
                  }
                }}
                sx={{
                  py: 1.5,
                  bgcolor: "#FF424E",
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(255,66,78,0.3)",
                  "&:hover": {
                    bgcolor: "#E53935",
                    boxShadow: "0 6px 16px rgba(255,66,78,0.4)",
                  },
                  "&:disabled": {
                    bgcolor: "#FFB3B3",
                  },
                }}
              >
                {lang === "en" ? "Buy Now" : "Mua ngay"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                disabled={
                  Number(product.stock ?? 0) <= 0 ||
                  !selectedSize ||
                  !selectedColor
                }
                onClick={() => {
                  if (!selectedSize || !selectedColor) {
                    setSnackMessage(
                      lang === "en"
                        ? "Please select size and color"
                        : "Vui lòng chọn kích thước và màu sắc"
                    );
                    setSnackSeverity("warning");
                    setSnackOpen(true);
                    return;
                  }
                  for (let i = 0; i < quantity; i++)
                    dispatch(
                      addToCart({
                        ...product,
                        selectedSize,
                        selectedColor,
                      })
                    );
                  setSnackMessage(
                    lang === "en" ? "Added to cart" : "Đã thêm vào giỏ hàng"
                  );
                  setSnackSeverity("success");
                  setSnackOpen(true);
                }}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  py: 1.5,
                  borderColor: "#1A94FF",
                  color: "#1A94FF",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#0D7AE6",
                    bgcolor: "rgba(26,148,255,0.1)",
                  },
                  "&:disabled": {
                    borderColor: "#E8E8E8",
                    color: "#999",
                  },
                }}
              >
                {lang === "en" ? "Add to Cart" : "Thêm vào giỏ"}
              </Button>
            </Box>

            {/* Contact Seller */}
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid #E8E8E8",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <StorefrontIcon sx={{ color: "#1A94FF", fontSize: 20 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {lang === "en" ? "Sold by" : "Bán bởi"}:{" "}
                  {product.brand || "ShopEase"}
                </Typography>
                {product.brand && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 12 }} />}
                    label={t("chip.authentic")}
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor: "#1A94FF",
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Product Details Tabs - Tiki Style */}
      <Card sx={{ mb: 4, border: "1px solid #E8E8E8", borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              },
              "& .Mui-selected": {
                color: "#1A94FF",
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#1A94FF",
                height: 3,
              },
            }}
          >
            <Tab
              label={
                lang === "en" ? "Product Information" : "Thông tin sản phẩm"
              }
            />
            <Tab label={lang === "en" ? "Description" : "Mô tả"} />
            <Tab label={lang === "en" ? "Reviews" : "Đánh giá"} />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {tabValue === 0 && (
=======
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Mô tả sản phẩm
        </Typography>
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
        >
          {product.description || ""}
        </Typography>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Đánh giá
        </Typography>
        {(() => {
          const total = reviews.length;
          const avgR = Number(product.averageRating || 0);
          const stars = [5, 4, 3, 2, 1];
          const counts = stars.map(
            (s) => reviews.filter((r) => Number(r.rating) === s).length
          );
          const commentCount = reviews.filter(
            (r) => (r.comment || "").trim().length > 0
          ).length;
          const mediaCount = reviews.filter(
            (r) =>
              (Array.isArray((r as any).images) &&
                (r as any).images.length > 0) ||
              (Array.isArray((r as any).mediaUrls) &&
                (r as any).mediaUrls.length > 0)
          ).length;
          const neg = counts[3] + counts[4];
          return (
            <>
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#f8fbff",
                  border: "1px solid #e5efff",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "240px 1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {avgR.toFixed(1)}
                    </Typography>
                    <Rating value={avgR} precision={0.5} readOnly />
                    <Typography variant="caption">
                      ({total} đánh giá)
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {stars.map((s, idx) => (
                        <Box
                          key={s}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="caption">{s}★</Typography>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={total ? (counts[idx] * 100) / total : 0}
                            />
                          </Box>
                          <Typography variant="caption">
                            {counts[idx]}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Tổng hợp từ đánh giá mới nhất
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="body2">
                          Chất lượng tốt, form chuẩn
                        </Typography>
                        <Typography variant="body2">
                          Giao nhanh, đóng gói cẩn thận
                        </Typography>
                        <Typography variant="body2">Giá hợp lý</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          Một số size cần thử kỹ
                        </Typography>
                        <Typography variant="body2">
                          Màu sắc khác nhẹ giữa ảnh và thực tế
                        </Typography>
                        <Typography variant="body2">
                          {neg > 0
                            ? `${neg} đánh giá tiêu cực`
                            : "Ít đánh giá tiêu cực"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2">
                    Tất cả hình ảnh ({mediaCount})
                  </Typography>
                  {(() => {
                    const imgs = reviews.flatMap((rv: any) => {
                      const arr = (rv.images || rv.mediaUrls || []) as string[];
                      return Array.isArray(arr) ? arr : [];
                    });
                    const show = imgs.slice(0, 8);
                    return (
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {show.map((u, i) => (
                          <img
                            key={i}
                            src={toAbs(u)}
                            alt="media"
                            style={{
                              width: 56,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        ))}
                        {imgs.length > show.length && (
                          <Chip
                            label={`+${imgs.length - show.length}`}
                            size="small"
                          />
                        )}
                      </Box>
                    );
                  })()}
                </Box>
              </Paper>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label={`Tất cả (${total})`}
                  color={
                    !filterRating && !onlyComment && !onlyMedia
                      ? "primary"
                      : "default"
                  }
                  onClick={() => {
                    setFilterRating(null);
                    setOnlyComment(false);
                    setOnlyMedia(false);
                  }}
                />
                {stars.map((s, idx) => (
                  <Chip
                    key={s}
                    label={`${s} Sao (${counts[idx]})`}
                    color={filterRating === s ? "primary" : "default"}
                    onClick={() => {
                      setFilterRating(s);
                      setOnlyComment(false);
                      setOnlyMedia(false);
                    }}
                  />
                ))}
                <Chip
                  label={`Có Bình Luận (${commentCount})`}
                  color={onlyComment ? "primary" : "default"}
                  onClick={() => {
                    setOnlyComment((v) => !v);
                    setFilterRating(null);
                  }}
                />
                <Chip
                  label={`Có Hình Ảnh/Video (${mediaCount})`}
                  color={onlyMedia ? "primary" : "default"}
                  onClick={() => {
                    setOnlyMedia((v) => !v);
                    setFilterRating(null);
                  }}
                />
              </Box>
            </>
          );
        })()}
        {(() => {
          const total = reviews.length;
          const stars = [5, 4, 3, 2, 1];
          const counts = stars.map(
            (s) => reviews.filter((r) => Number(r.rating) === s).length
          );
          const filtered = reviews.filter((rv) => {
            if (filterRating && Number(rv.rating) !== filterRating)
              return false;
            if (onlyComment && !(rv.comment || "").trim()) return false;
            const hasMedia =
              (Array.isArray((rv as any).images) &&
                (rv as any).images.length > 0) ||
              (Array.isArray((rv as any).mediaUrls) &&
                (rv as any).mediaUrls.length > 0);
            if (onlyMedia && !hasMedia) return false;
            return true;
          });
          const list = filtered;
          return (
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "200px 1fr" },
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {lang === "en" ? "Brand" : "Thương hiệu"}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.brand || "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lang === "en" ? "Category" : "Danh mục"}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.category?.name || product.category?.slug || "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lang === "en" ? "Status" : "Tình trạng"}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.status || "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lang === "en" ? "Stock" : "Tồn kho"}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.stock ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lang === "en" ? "Product ID" : "Mã SP"}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                #{product.id}
              </Typography>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {product.description ? (
                <Box
                  sx={{
                    "& p": {
                      mb: 2,
                      lineHeight: 1.8,
                      color: "#666",
                      fontSize: "0.95rem",
                    },
                    "& ul, & ol": {
                      pl: 3,
                      mb: 2,
                      "& li": {
                        mb: 1,
                        lineHeight: 1.8,
                        color: "#666",
                        fontSize: "0.95rem",
                      },
                    },
                    "& h1, & h2, & h3, & h4": {
                      fontWeight: 700,
                      mb: 1.5,
                      mt: 3,
                      color: "#333",
                      "&:first-of-type": {
                        mt: 0,
                      },
                    },
                    "& h1": { fontSize: "1.5rem" },
                    "& h2": { fontSize: "1.3rem" },
                    "& h3": { fontSize: "1.1rem" },
                    "& img": {
                      maxWidth: "100%",
                      borderRadius: 1,
                      mb: 2,
                      mt: 1,
                    },
                    "& strong": {
                      fontWeight: 700,
                      color: "#333",
                    },
                    "& a": {
                      color: "#1A94FF",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    },
                    "& blockquote": {
                      borderLeft: "3px solid #1A94FF",
                      pl: 2,
                      ml: 0,
                      fontStyle: "italic",
                      color: "#666",
                      mb: 2,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: product.description
                      .replace(/\n\n/g, "</p><p>")
                      .replace(/\n/g, "<br />")
                      .replace(/^/, "<p>")
                      .replace(/$/, "</p>"),
                  }}
                />
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: "#F5F5F5",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {lang === "en" ? "No description" : "Chưa có mô tả"}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              {/* Reviews Summary - Always show */}
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#F8FBFF",
                  borderRadius: 2,
                  border: "1px solid #E5EFFF",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "200px 1fr" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: "#1A94FF",
                        mb: 0.5,
                      }}
                    >
                      {avg > 0 ? avg.toFixed(1) : "0.0"}
                    </Typography>
                    <Rating
                      value={avg}
                      precision={0.5}
                      readOnly
                      sx={{
                        mb: 0.5,
                        "& .MuiRating-iconFilled": {
                          color: "#FFC120",
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({rc} {lang === "en" ? "reviews" : "đánh giá"})
                    </Typography>
                  </Box>
                  <Box>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(
                        (r) => Number(r.rating) === star
                      ).length;
                      const percent = rc > 0 ? (count / rc) * 100 : 0;
                      return (
                        <Box
                          key={star}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {star}★
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percent}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "#E0E0E0",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: "#FFC120",
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {count}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>

              {/* Write Review Form */}
              {auth.token && (
                <Card
                  sx={{
                    mb: 3,
                    border: "1px solid #E8E8E8",
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 2, color: "#333" }}
                    >
                      {lang === "en" ? "Write a Review" : "Viết đánh giá"}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 600, color: "#666" }}
                      >
                        {lang === "en" ? "Rating" : "Đánh giá"}
                      </Typography>
                      <Rating
                        value={newRating}
                        onChange={(_, v) => v && setNewRating(v)}
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: "#FFC120",
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: 600, color: "#666" }}
                      >
                        {lang === "en" ? "Comment" : "Nhận xét"}
                      </Typography>
                      <Box
                        component="textarea"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={
                          lang === "en"
                            ? "Share your experience with this product..."
                            : "Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        }
                        sx={{
                          width: "100%",
                          minHeight: 100,
                          p: 1.5,
                          border: "1px solid #E8E8E8",
                          borderRadius: 1,
                          fontFamily: "inherit",
                          fontSize: "0.875rem",
                          resize: "vertical",
                          "&:focus": {
                            outline: "none",
                            borderColor: "#1A94FF",
                          },
                        }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        try {
                          await http.post(`/products/${id}/reviews`, {
                            rating: newRating,
                            comment: newComment,
                          });
                          setNewRating(5);
                          setNewComment("");
                          fetchReviews();
                          setSnackOpen(true);
                        } catch (err: any) {
                          console.error("Failed to submit review", err);
                        }
                      }}
                      disabled={!newComment.trim()}
                      sx={{
                        bgcolor: "#1A94FF",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#0D7AE6",
                        },
                      }}
                    >
                      {lang === "en" ? "Submit Review" : "Gửi đánh giá"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Review Filters */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                <Chip
                  label={`${lang === "en" ? "All" : "Tất cả"} (${
                    reviews.length
                  })`}
                  onClick={() => {
                    setFilterRating(null);
                    setOnlyComment(false);
                    setOnlyMedia(false);
                  }}
                  sx={{
                    bgcolor:
                      !filterRating && !onlyComment && !onlyMedia
                        ? "#1A94FF"
                        : "#F5F5F5",
                    color:
                      !filterRating && !onlyComment && !onlyMedia
                        ? "#fff"
                        : "#333",
                    fontWeight: 600,
                  }}
                />
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(
                    (r) => Number(r.rating) === star
                  ).length;
                  return (
                    <Chip
                      key={star}
                      label={`${star}★ (${count})`}
                      onClick={() => {
                        setFilterRating(filterRating === star ? null : star);
                        setOnlyComment(false);
                        setOnlyMedia(false);
                      }}
                      sx={{
                        bgcolor: filterRating === star ? "#1A94FF" : "#F5F5F5",
                        color: filterRating === star ? "#fff" : "#333",
                        fontWeight: 600,
                      }}
                    />
                  );
                })}
              </Box>

              {/* Review List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {reviews
                  .filter((rv) => {
                    if (filterRating && Number(rv.rating) !== filterRating)
                      return false;
                    if (onlyComment && !(rv.comment || "").trim()) return false;
                    const hasMedia =
                      (Array.isArray((rv as any).images) &&
                        (rv as any).images.length > 0) ||
                      (Array.isArray((rv as any).mediaUrls) &&
                        (rv as any).mediaUrls.length > 0);
                    if (onlyMedia && !hasMedia) return false;
                    return true;
                  })
                  .map((rv) => (
                    <Card
                      key={rv.id}
                      sx={{
                        border: "1px solid #E8E8E8",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#1A94FF",
                              width: 40,
                              height: 40,
                            }}
                          >
                            {(rv.user?.username || "U")
                              .slice(0, 1)
                              .toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {rv.user?.username || lang === "en"
                                ? "User"
                                : "Người dùng"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Rating
                                value={Number(rv.rating)}
                                readOnly
                                size="small"
                                sx={{
                                  "& .MuiRating-iconFilled": {
                                    color: "#FFC120",
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  rv.createdAt || Date.now()
                                ).toLocaleDateString(
                                  lang === "en" ? "en-US" : "vi-VN"
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {rv.comment && (
                          <Typography
                            variant="body2"
                            sx={{ mb: 1.5, lineHeight: 1.6, color: "#666" }}
                          >
                            {rv.comment}
                          </Typography>
                        )}
                        {(() => {
                          const imgs: string[] =
                            (rv as any).images || (rv as any).mediaUrls || [];
                          if (Array.isArray(imgs) && imgs.length > 0) {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  flexWrap: "wrap",
                                }}
                              >
                                {imgs.slice(0, 4).map((u, idx) => (
                                  <Box
                                    key={idx}
                                    component="img"
                                    src={toAbs(u)}
                                    alt="review"
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                      border: "1px solid #E8E8E8",
                                    }}
                                  />
                                ))}
                              </Box>
                            );
                          }
                          return null;
                        })()}
                      </CardContent>
                    </Card>
                  ))}
                {reviews.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    {lang === "en" ? "No reviews yet" : "Chưa có đánh giá"}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Related Products - Tiki Style */}
      {related.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#333",
              fontSize: { xs: "1.3rem", md: "1.5rem" },
            }}
          >
            {lang === "en" ? "Related Products" : "Sản phẩm tương tự"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
            }}
          >
            {related.map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => navigate(`/product/${p.id}`)}
              />
            ))}
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackSeverity}
          onClose={() => setSnackOpen(false)}
          sx={{
            bgcolor:
              snackSeverity === "success"
                ? "#4CAF50"
                : snackSeverity === "warning"
                ? "#FF9800"
                : "#F44336",
            color: "#fff",
            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }}
        >
          {snackMessage ||
            (lang === "en" ? "Added to cart" : "Đã thêm vào giỏ hàng")}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;
