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

const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
const toAbs = (u: string) =>
  u && u.startsWith("/uploads/") ? apiOrigin + u : u;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  return (
    <div style={{ padding: 30 }}>
      <Box sx={{ display: "none" }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "520px 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Paper sx={{ p: 1 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: 76,
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
                    width: 76,
                    height: 76,
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
              }}
            >
              {mainImage && (
                <img
                  src={mainImage}
                  alt={product.name}
                  style={{ maxWidth: "100%", maxHeight: 500, borderRadius: 8 }}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              style={{
                width: 80,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={Number(product.stock ?? 0) <= 0}
              onClick={() => {
                for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
                setSnackOpen(true);
              }}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={Number(product.stock ?? 0) <= 0}
              onClick={() => {
                if (auth.token) {
                  for (let i = 0; i < quantity; i++)
                    dispatch(addToCart(product));
                  navigate("/cart");
                } else {
                  navigate(`/guest-checkout?pid=${product.id}&qty=${quantity}`);
                }
              }}
            >
              Mua ngay
            </Button>
          </Box>
        </Box>
      </Box>

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
          return (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#fff6f4",
                border: "1px solid #fde1d9",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "220px 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    color="error"
                    sx={{ fontWeight: 700 }}
                  >
                    {avgR.toFixed(1)} trên 5
                  </Typography>
                  <Rating value={avgR} precision={0.5} readOnly />
                </Box>
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
              </Box>
            </Paper>
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
