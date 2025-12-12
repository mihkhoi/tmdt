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
  Chip,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DiamondIcon from "@mui/icons-material/Diamond";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HotelIcon from "@mui/icons-material/Hotel";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SortIcon from "@mui/icons-material/Sort";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SellIcon from "@mui/icons-material/Sell";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState<string>(searchParams.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("");
  const [brandsSelected, setBrandsSelected] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [suggestList, setSuggestList] = useState<any[]>([]);
<<<<<<< HEAD
=======
  const [hot, setHot] = useState<any[]>([]);
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [ratingMin, setRatingMin] = useState<string>("");
  const [pricePreset, setPricePreset] = useState<string>("");

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
      if (!brandsList.length) {
        try {
          const bRes = await http.get("/brands");
          const arr = Array.isArray(bRes.data) ? bRes.data : [];
          setBrandsList(arr);
        } catch {
          const derived = Array.from(
            new Set<string>(
              list
                .map((p: any) => String(p.brand || ""))
                .filter((v: string) => Boolean(v))
            )
          ) as string[];
          setBrandsList(derived);
        }
      }
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
      setError(t("error.productsLoadFailed"));
    }
    setLoading(false);
  }, [
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    newOnly,
    page,
    brandsList.length,
<<<<<<< HEAD
    t,
=======
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setKeyword(q);
    const cat = searchParams.get("category") || "";
    setCategory(cat);
    const brs = (searchParams.get("brands") || "").split(",").filter(Boolean);
    setBrandsSelected(brs);
    const mi = searchParams.get("minPrice") || "";
    const ma = searchParams.get("maxPrice") || "";
    const so = searchParams.get("sort") || "";
    const ne = searchParams.get("newOnly") === "true";
    const st = searchParams.get("stockOnly") === "true";
    const rt = searchParams.get("ratingMin") || "";
    const pp = searchParams.get("pricePreset") || "";
    setMinPrice(mi);
    setMaxPrice(ma);
    setSort(so);
    setNewOnly(ne);
    setStockOnly(st);
    setRatingMin(rt);
    setPricePreset(pp);
  }, [searchParams]);

  const clothingCategories: {
    key: string;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "ao-nam",
      label: t("category.ao-nam"),
      icon: <ManIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-nu",
      label: t("category.ao-nu"),
      icon: <WomanIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-thun",
      label: t("category.ao-thun"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-so-mi",
      label: t("category.ao-so-mi"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "hoodie",
      label: t("category.hoodie"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-khoac",
      label: t("category.ao-khoac"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-jean",
      label: t("category.quan-jean"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-tay",
      label: t("category.quan-tay"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-short",
      label: t("category.quan-short"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "vay-dam",
      label: t("category.vay-dam"),
      icon: <WomanIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "do-the-thao",
      label: t("category.do-the-thao"),
      icon: <FitnessCenterIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "do-ngu",
      label: t("category.do-ngu"),
      icon: <HotelIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "do-lot",
      label: t("category.do-lot"),
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "phu-kien",
      label: t("category.phu-kien"),
      icon: <DiamondIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "giay-dep",
      label: t("category.giay-dep"),
      icon: <DirectionsRunIcon sx={{ fontSize: 24 }} />,
    },
  ];

<<<<<<< HEAD
=======
  const clothingCategories: {
    key: string;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: "ao-nam", label: "Áo Nam", icon: <ManIcon sx={{ fontSize: 24 }} /> },
    { key: "ao-nu", label: "Áo Nữ", icon: <WomanIcon sx={{ fontSize: 24 }} /> },
    {
      key: "ao-thun",
      label: "Áo thun",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-so-mi",
      label: "Áo sơ mi",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "hoodie",
      label: "Hoodie",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-khoac",
      label: "Áo khoác",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-jean",
      label: "Quần jean",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-tay",
      label: "Quần tây",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-short",
      label: "Quần short",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "vay-dam",
      label: "Váy đầm",
      icon: <WomanIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "do-the-thao",
      label: "Đồ thể thao",
      icon: <FitnessCenterIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "do-ngu",
      label: "Đồ ngủ",
      icon: <HotelIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "do-lot",
      label: "Đồ lót",
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "phu-kien",
      label: "Phụ kiện",
      icon: <DiamondIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "giay-dep",
      label: "Giày dép",
      icon: <DirectionsRunIcon sx={{ fontSize: 24 }} />,
    },
  ];

>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
  const hotCategories: {
    key: string;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "hang-moi",
<<<<<<< HEAD
      label: t("hot.hang-moi"),
=======
      label: "Hàng mới về",
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      icon: <NewReleasesIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "giam-gia-sau",
<<<<<<< HEAD
      label: t("hot.giam-gia-sau"),
=======
      label: "Giảm giá sâu",
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      icon: <SellIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "bestseller",
<<<<<<< HEAD
      label: t("hot.bestseller"),
=======
      label: "Bán chạy",
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      icon: <WhatshotIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "ao-khoac",
<<<<<<< HEAD
      label: t("category.ao-khoac"),
=======
      label: "Áo khoác",
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "quan-jean",
<<<<<<< HEAD
      label: t("category.quan-jean"),
=======
      label: "Quần jean",
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      icon: <CheckroomIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "phu-kien",
<<<<<<< HEAD
      label: t("category.phu-kien"),
=======
      label: "Phụ kiện",
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
      icon: <DiamondIcon sx={{ fontSize: 24 }} />,
    },
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
      <Paper
        sx={{
<<<<<<< HEAD
          p: { xs: 2, md: 4 },
          mb: 2,
          borderRadius: 2,
          color: "#fff",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg,#263238,#37474f)"
              : "linear-gradient(90deg,#26a69a,#00bcd4)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "2fr 1fr" },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {t("home.hero.title")}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
              {t("home.hero.subtitle")}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => selectCategory("giam-gia-sau")}
            >
              {t("home.hero.cta")}
            </Button>
          </Box>
          <Box
            sx={{ display: { xs: "none", md: "block" }, justifySelf: "end" }}
          >
            <Box
              sx={{
                width: 280,
                height: 140,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(2px)",
              }}
            />
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          p: 1,
          mb: 2,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Chip icon={<VerifiedIcon />} label={t("chip.authentic")} />
        <Chip icon={<LocalShippingIcon />} label={t("chip.freeship")} />
        <Chip icon={<MonetizationOnIcon />} label={t("chip.refund")} />
        <Chip icon={<AutorenewIcon />} label={t("chip.returns30")} />
        <Chip icon={<FlashOnIcon />} label={t("chip.delivery2h")} />
        <Chip icon={<SellIcon />} label={t("chip.superCheap")} />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {t("home.featured.title")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2">
              Giảm 30K cho đơn từ 300K
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mã: SAVE30 • HSD: 31/12
            </Typography>
            <Button
              sx={{ mt: 1 }}
              variant="outlined"
              onClick={() => setPricePreset("100k-300k")}
            >
              Áp dụng
            </Button>
          </Box>
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2">Freeship đơn từ 100K</Typography>
            <Typography variant="caption" color="text.secondary">
              Mã: FREESHIP • HSD: 31/12
            </Typography>
            <Button
              sx={{ mt: 1 }}
              variant="outlined"
              onClick={() => setMinPrice("100000")}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "240px 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 1,
            display: { xs: "none", md: "block" },
            height: "100%",
            position: "sticky",
            top: 16,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            {t("sidebar.categories")}
=======
          p: 1,
          mb: 2,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Chip icon={<VerifiedIcon />} label="100% hàng thật" />
        <Chip icon={<LocalShippingIcon />} label="Freeship mỗi đơn" />
        <Chip icon={<MonetizationOnIcon />} label="Hoàn 200% nếu hàng giả" />
        <Chip icon={<AutorenewIcon />} label="30 ngày đổi trả" />
        <Chip icon={<FlashOnIcon />} label="Giao nhanh 2h" />
        <Chip icon={<SellIcon />} label="Giá siêu rẻ" />
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "240px 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 1,
            display: { xs: "none", md: "block" },
            height: "100%",
            position: "sticky",
            top: 16,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Danh mục
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {clothingCategories.map((c) => (
              <Box
                key={c.key}
                onClick={() => selectCategory(c.key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: c.key === category ? "#e3f2fd" : "transparent",
                  "&:hover": {
                    bgcolor: c.key === category ? "#e3f2fd" : "#f5f5f5",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {c.icon}
                </Box>
                <Typography variant="body2">{c.label}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2, p: 1, borderRadius: 1, bgcolor: "#f0f6ff" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
<<<<<<< HEAD
              {t("sidebar.hot")}
=======
              NỔI BẬT
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {hotCategories.map((c) => (
                <Box
                  key={c.key}
                  onClick={() => selectCategory(c.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#eaf2ff" },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Typography variant="body2">{c.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
        <Box>
          <Paper
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
<<<<<<< HEAD
              {t("filter.title")}
=======
              Tìm kiếm
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "repeat(12,1fr)" },
              }}
            >
              <TextField
                size="small"
<<<<<<< HEAD
                label={t("filter.minPrice")}
=======
                label="Giá từ"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
                sx={{ gridColumn: { md: "span 2" } }}
              />
              <TextField
                size="small"
<<<<<<< HEAD
                label={t("filter.maxPrice")}
=======
                label="Giá đến"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                }}
                sx={{ gridColumn: { md: "span 2" } }}
              />
              <TextField
                size="small"
<<<<<<< HEAD
                label={t("filter.sort")}
=======
                label="Sắp xếp"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                select
                value={sort}
                onChange={(e) => setSort(String(e.target.value))}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ gridColumn: { md: "span 2" } }}
              >
<<<<<<< HEAD
                <MenuItem value="">{t("sort.default")}</MenuItem>
                <MenuItem value="price_asc">{t("sort.priceAsc")}</MenuItem>
                <MenuItem value="price_desc">{t("sort.priceDesc")}</MenuItem>
                <MenuItem value="rating_desc">{t("sort.ratingDesc")}</MenuItem>
                <MenuItem value="rating_asc">{t("sort.ratingAsc")}</MenuItem>
              </TextField>
              <TextField
                size="small"
                label={t("filter.brands")}
=======
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="price_asc">Giá tăng dần</MenuItem>
                <MenuItem value="price_desc">Giá giảm dần</MenuItem>
                <MenuItem value="rating_desc">Đánh giá cao</MenuItem>
                <MenuItem value="rating_asc">Đánh giá thấp</MenuItem>
              </TextField>
              <TextField
                size="small"
                label="Thương hiệu"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                select
                value={brandsSelected}
                onChange={(e) => {
                  const val = e.target.value as any;
                  const v = Array.isArray(val)
                    ? val
                    : String(val || "")
                        .split(",")
                        .filter(Boolean);
                  setBrandsSelected(v as string[]);
                }}
                fullWidth
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((v) => (
                        <Chip key={v} label={v} size="small" />
                      ))}
                    </Box>
                  ),
                }}
                sx={{ gridColumn: { md: "span 3" } }}
              >
                {brandsList.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
<<<<<<< HEAD
                label={t("filter.priceRange")}
=======
                label="Khoảng giá"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                select
                value={pricePreset}
                onChange={(e) => {
                  const v = String(e.target.value);
                  setPricePreset(v);
                  if (v === "") {
                    setMinPrice("");
                    setMaxPrice("");
                  } else if (v === "0-100k") {
                    setMinPrice("0");
                    setMaxPrice("100000");
                  } else if (v === "100k-300k") {
                    setMinPrice("100000");
                    setMaxPrice("300000");
                  } else if (v === "300k-700k") {
                    setMinPrice("300000");
                    setMaxPrice("700000");
                  } else if (v === "700k-1.5m") {
                    setMinPrice("700000");
                    setMaxPrice("1500000");
                  }
                }}
                fullWidth
                sx={{ gridColumn: { md: "span 2" } }}
              >
<<<<<<< HEAD
                <MenuItem value="">{t("sort.default")}</MenuItem>
=======
                <MenuItem value="">Tất cả</MenuItem>
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                <MenuItem value="0-100k">0-100k</MenuItem>
                <MenuItem value="100k-300k">100k-300k</MenuItem>
                <MenuItem value="300k-700k">300k-700k</MenuItem>
                <MenuItem value="700k-1.5m">700k-1.5m</MenuItem>
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stockOnly}
                    onChange={(e) => setStockOnly(e.target.checked)}
                  />
                }
<<<<<<< HEAD
                label={t("filter.inStock")}
=======
                label="Còn hàng"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                sx={{ gridColumn: { md: "span 2" }, ml: 0 }}
              />
              <TextField
                size="small"
<<<<<<< HEAD
                label={t("filter.ratingMin")}
=======
                label="Đánh giá từ"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                select
                value={ratingMin}
                onChange={(e) => setRatingMin(String(e.target.value))}
                fullWidth
                sx={{ gridColumn: { md: "span 2" } }}
              >
<<<<<<< HEAD
                <MenuItem value="">{t("sort.default")}</MenuItem>
=======
                <MenuItem value="">Tất cả</MenuItem>
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                {[1, 2, 3, 4, 5].map((n) => (
                  <MenuItem key={n} value={String(n)}>
                    {n}★
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newOnly}
                    onChange={(e) => setNewOnly(e.target.checked)}
                  />
                }
<<<<<<< HEAD
                label={t("filter.newOnly")}
=======
                label="Chỉ sản phẩm mới (30 ngày)"
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
                sx={{ gridColumn: { md: "span 3" }, ml: 0 }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ gridColumn: { md: "span 2" }, alignSelf: "stretch" }}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (minPrice) params.set("minPrice", minPrice);
                  else params.delete("minPrice");
                  if (maxPrice) params.set("maxPrice", maxPrice);
                  else params.delete("maxPrice");
                  if (sort) params.set("sort", sort);
                  else params.delete("sort");
                  if (brandsSelected.length)
                    params.set("brands", brandsSelected.join(","));
                  else params.delete("brands");
                  params.set("newOnly", String(newOnly));
                  params.set("stockOnly", String(stockOnly));
                  if (pricePreset) params.set("pricePreset", pricePreset);
                  else params.delete("pricePreset");
                  if (ratingMin) params.set("ratingMin", ratingMin);
                  else params.delete("ratingMin");
                  navigate({ pathname: "/", search: `?${params.toString()}` });
                }}
              >
<<<<<<< HEAD
                {t("filter.apply")}
=======
                Áp dụng
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
              </Button>
            </Box>
          </Paper>

          <Typography variant="h4" mb={3}>
<<<<<<< HEAD
            {t("products.title")}
=======
            Danh sách sản phẩm
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {suggestList.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
<<<<<<< HEAD
                {t("suggestions.title")}
=======
                Gợi ý gần giống
>>>>>>> cc0f24db141ed277a59e268a9503fd901a9cb0c2
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
                      <Skeleton
                        variant="rectangular"
                        height={160}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  ))
                : products
                    .filter((p: any) => {
                      if (
                        brandsSelected.length &&
                        !brandsSelected.includes(String(p.brand || ""))
                      )
                        return false;
                      if (stockOnly && !(Number(p.stock || 0) > 0))
                        return false;
                      if (
                        ratingMin &&
                        !(Number(p.averageRating || 0) >= Number(ratingMin))
                      )
                        return false;
                      return true;
                    })
                    .map((p) => (
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
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
