// src/pages/HomePage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi, Product } from "../api/productApi";
import http from "../api/http";
import {
  Box,
  Typography,
  Alert,
  Pagination,
  Paper,
  Skeleton,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState<string>(searchParams.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [suggestList, setSuggestList] = useState<any[]>([]);
  const [hot, setHot] = useState<any[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productApi.getProductsPage({
        q: keyword,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort || undefined,
        newOnly: newOnly || undefined,
        page: page - 1,
        size: 12,
      });
      const list = Array.isArray(res?.content) ? res.content : [];
      setProducts(list);
      setTotalPages(typeof res?.totalPages === "number" ? res.totalPages : 1);
      if (list.length === 0 && keyword) {
        try {
          const sug = await productApi.suggest(keyword);
          setSuggestList(Array.isArray(sug) ? sug : []);
        } catch {
          setSuggestList([]);
        }
      } else {
        setSuggestList([]);
      }
    } catch (e) {
      console.error(e);
      setError("Không tải được danh sách sản phẩm.");
    }
    setLoading(false);
  }, [keyword, category, minPrice, maxPrice, sort, newOnly, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setKeyword(q);
    const cat = searchParams.get("category") || "";
    setCategory(cat);
    const mi = searchParams.get("minPrice") || "";
    const ma = searchParams.get("maxPrice") || "";
    const so = searchParams.get("sort") || "";
    const ne = searchParams.get("newOnly") === "true";
    setMinPrice(mi);
    setMaxPrice(ma);
    setSort(so);
    setNewOnly(ne);
  }, [searchParams]);

  useEffect(() => {
    const loadHot = async () => {
      try {
        const res = await productApi.getProductsPage({
          sort: "rating_desc",
          page: 0,
          size: 20,
        });
        const list = Array.isArray(res?.content) ? res.content : [];
        const top = list
          .filter((p: any) => Number(p.ratingCount || 0) > 0)
          .slice(0, 8);
        const enriched = await Promise.all(
          top.map(async (p: any) => {
            try {
              const rv = await http.get(`/products/${p.id}/reviews`);
              const arr = Array.isArray(rv.data) ? rv.data : [];
              const five = arr.filter(
                (r: any) => Number(r.rating) === 5
              ).length;
              const four = arr.filter(
                (r: any) => Number(r.rating) === 4
              ).length;
              return {
                id: p.id,
                name: p.name,
                imageUrl: p.imageUrl,
                five,
                four,
                purchaseCount: Number(p.ratingCount || 0),
              };
            } catch {
              return {
                id: p.id,
                name: p.name,
                imageUrl: p.imageUrl,
                five: 0,
                four: 0,
                purchaseCount: Number(p.ratingCount || 0),
              };
            }
          })
        );
        setHot(enriched);
      } catch {
        setHot([]);
      }
    };
    loadHot();
  }, []);

  const clothingCategories = [
    { key: "ao-nam", label: "Áo Nam", icon: <ManIcon /> },
    { key: "ao-nu", label: "Áo Nữ", icon: <WomanIcon /> },
    { key: "quan-nam", label: "Quần Nam", icon: <ManIcon /> },
    { key: "quan-nu", label: "Quần Nữ", icon: <WomanIcon /> },
    { key: "phu-kien", label: "Phụ kiện", icon: <CheckroomIcon /> },
    { key: "ao-thun", label: "Áo thun", icon: <CheckroomIcon /> },
    { key: "ao-so-mi", label: "Áo sơ mi", icon: <CheckroomIcon /> },
    { key: "hoodie", label: "Hoodie", icon: <CheckroomIcon /> },
    { key: "quan-short", label: "Quần short", icon: <CheckroomIcon /> },
    { key: "quan-tay", label: "Quần tây", icon: <CheckroomIcon /> },
  ];

  const selectCategory = (key: string) => {
    setCategory(key);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (key) params.set("category", key);
    else params.delete("category");
    const search = params.toString();
    navigate({ pathname: "/", search: `?${search}` });
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Danh mục
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(5, 1fr)" },
            gap: 2,
          }}
        >
          {clothingCategories.map((c) => (
            <Box
              key={c.key}
              onClick={() => selectCategory(c.key)}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                border:
                  c.key === category ? "2px solid #009688" : "1px solid #eee",
                bgcolor: c.key === category ? "#e0f2f1" : "#fff",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1,
                }}
              >
                {c.icon}
              </Box>
              <Typography variant="body2">{c.label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Bộ lọc
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(6,1fr)" },
          }}
        >
          <TextField
            size="small"
            label="Giá từ"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <TextField
            size="small"
            label="Giá đến"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <TextField
            size="small"
            label="Sắp xếp"
            select
            value={sort}
            onChange={(e) => setSort(String(e.target.value))}
          >
            <MenuItem value="">Mặc định</MenuItem>
            <MenuItem value="price_asc">Giá tăng dần</MenuItem>
            <MenuItem value="price_desc">Giá giảm dần</MenuItem>
            <MenuItem value="rating_desc">Đánh giá cao</MenuItem>
            <MenuItem value="rating_asc">Đánh giá thấp</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={newOnly}
              onChange={(e) => setNewOnly(e.target.checked)}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Chỉ sản phẩm mới (30 ngày)
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (minPrice) params.set("minPrice", minPrice);
              else params.delete("minPrice");
              if (maxPrice) params.set("maxPrice", maxPrice);
              else params.delete("maxPrice");
              if (sort) params.set("sort", sort);
              else params.delete("sort");
              params.set("newOnly", String(newOnly));
              navigate({ pathname: "/", search: `?${params.toString()}` });
            }}
          >
            Áp dụng
          </Button>
        </Box>
      </Paper>
      <Typography variant="h4" mb={3}>
        Danh sách sản phẩm
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {suggestList.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Gợi ý gần giống
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {suggestList.map((s) => (
              <Box
                key={s.id}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={() => navigate(`/product/${s.id}`)}
              >
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    style={{
                      width: 64,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                ) : null}
                <Typography variant="body2">{s.name}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            },
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Box key={i}>
                  <Skeleton variant="rectangular" height={160} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              ))
            : products.map((p) => (
                <Box key={p.id}>
                  <ProductCard
                    product={p}
                    onClick={() => navigate(`/product/${p.id}`)}
                  />
                </Box>
              ))}
        </Box>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Sản phẩm hot
          </Typography>
          {(() => {
            const render = hot.slice(0, 8);
            if (render.length === 0)
              return <Typography variant="body2">Chưa có dữ liệu</Typography>;
            return (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "repeat(4,1fr)" },
                }}
              >
                {render.map((h) => (
                  <Paper key={h.id} sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {h.imageUrl ? (
                        <img
                          src={h.imageUrl}
                          alt={h.name}
                          style={{
                            width: 64,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : null}
                      <Box>
                        <Typography variant="subtitle2" noWrap>
                          {h.name}
                        </Typography>
                        <Typography variant="caption">
                          Mua: {h.purchaseCount || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block" }}>
                          5★: {h.five || 0} • 4★: {h.four || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            );
          })()}
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
