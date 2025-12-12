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
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

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
  const { t } = useI18n();
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
  const [onlyComment, setOnlyComment] = useState(false);
  const [onlyMedia, setOnlyMedia] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [related, setRelated] = useState<any[]>([]);

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
      <div style={{ padding: 30 }}>
        Không tìm thấy sản phẩm hoặc đang tải...
      </div>
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
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Đen", "Trắng", "Xanh", "Đỏ"];
  const shippingTo = "TP. Hồ Chí Minh";

  return (
    <div style={{ padding: 30 }}>
      <Box sx={{ display: "none" }} />

      <Box
        sx={{
          display: "grid",
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
                display: "flex",
                flexDirection: "column",
                gap: 1,
                overflowY: "auto",
              }}
            >
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
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 360,
              }}
            >
              {mainImage && (
                <img
                  src={mainImage}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    height: 360,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              )}
            </Box>
          </Box>
        </Paper>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <Rating value={avg} precision={0.5} readOnly />
            <Typography variant="body2">{avg.toFixed(1)} ★</Typography>
            <Typography variant="body2">{rc} Đánh giá</Typography>
            <Typography variant="body2">• Đã bán {sold}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {hasDiscount ? (
              <Box>
                <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>
                  {finalPrice.toLocaleString("vi-VN")} ₫
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  {Number(product.price).toLocaleString("vi-VN")} ₫
                </Typography>
                <Chip
                  label={`-${product.discountPercent}%`}
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            ) : (
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {Number(product.price).toLocaleString("vi-VN")} ₫
              </Typography>
            )}
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

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Thông tin sản phẩm
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "200px 1fr" },
            rowGap: 1,
            columnGap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Thương hiệu
          </Typography>
          <Typography variant="body2">{product.brand || ""}</Typography>
          <Typography variant="body2" color="text.secondary">
            Danh mục
          </Typography>
          <Typography variant="body2">
            {product.category?.name || product.category?.slug || ""}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tình trạng
          </Typography>
          <Typography variant="body2">{product.status || ""}</Typography>
          <Typography variant="body2" color="text.secondary">
            Tồn kho
          </Typography>
          <Typography variant="body2">{product.stock ?? 0}</Typography>
          <Typography variant="body2" color="text.secondary">
            Mã SP
          </Typography>
          <Typography variant="body2">{product.id}</Typography>
        </Box>
      </Paper>

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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
                gap: 3,
              }}
            >
              <Box>
                {stars.map((s, idx) => (
                  <Box
                    key={s}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant={filterRating === s ? "contained" : "text"}
                      onClick={() =>
                        setFilterRating(filterRating === s ? null : s)
                      }
                    >
                      {s}★
                    </Button>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={total ? (counts[idx] * 100) / total : 0}
                      />
                    </Box>
                    <Typography variant="caption">{counts[idx]}</Typography>
                  </Box>
                ))}
                <Button
                  size="small"
                  onClick={() => {
                    setFilterRating(null);
                    setOnlyComment(false);
                    setOnlyMedia(false);
                  }}
                >
                  Bỏ lọc
                </Button>
              </Box>
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} sao
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Bình luận"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={async () => {
                      await http.post(`/products/${id}/reviews`, null, {
                        params: { rating: newRating, comment: newComment },
                      });
                      setNewComment("");
                      await fetchReviews();
                    }}
                  >
                    Gửi
                  </Button>
                </Box>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {list.length === 0 ? (
                    <Typography variant="body2">Chưa có bình luận</Typography>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {list.map((rv) => (
                        <Paper key={rv.id} sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                background: "#eee",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ fontSize: 12 }}>
                                {(rv.user?.username || "")
                                  .slice(0, 1)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <Rating value={Number(rv.rating)} readOnly />
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {new Date(
                                rv.createdAt || Date.now()
                              ).toLocaleString()}
                            </Typography>
                          </Box>
                          {rv.comment ? (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {rv.comment}
                            </Typography>
                          ) : null}
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
                                    <img
                                      key={idx}
                                      src={toAbs(u)}
                                      alt="rv"
                                      style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                      }}
                                    />
                                  ))}
                                </Box>
                              );
                            }
                            return null;
                          })()}
                        </Paper>
                      ))}
                    </div>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })()}
      </Box>
    </div>
  );
};

export default ProductDetailPage;
