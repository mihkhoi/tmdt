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
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ProductCard from "../components/ProductCard";
import BannerCarousel from "../components/BannerCarousel";
import FlashSaleSection from "../components/FlashSaleSection";
import ProductSection from "../components/ProductSection";
import ProductQuickView from "../components/ProductQuickView";
import RecentlyViewed from "../components/RecentlyViewed";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../utils/currencyUtils";

// Convert relative image URLs to absolute
const apiOrigin = (http.defaults.baseURL || "").replace(/\/api$/, "");
const toAbs = (u: string) =>
  u && u.startsWith("/uploads/") ? apiOrigin + u : u;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [ratingMin, setRatingMin] = useState<string>("");
  const [pricePreset, setPricePreset] = useState<string>("");
  const [quickViewProductId, setQuickViewProductId] = useState<number | null>(
    null
  );
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleQuickView = (productId: number) => {
    setQuickViewProductId(productId);
    setQuickViewOpen(true);
  };

  const handleProductClick = (productId: number) => {
    window.dispatchEvent(
      new CustomEvent("product-viewed", { detail: productId })
    );
    navigate(`/product/${productId}`);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Optimize: Only fetch brands if needed
      const shouldFetchBrands = !brandsList.length;

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

      // Fetch brands in parallel if needed
      if (shouldFetchBrands) {
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

      // Only fetch suggestions if no products found and has keyword
      if (list.length === 0 && keyword) {
        // Don't block on suggestions - fetch in background
        productApi
          .suggest(keyword)
          .then((sug) => {
            setSuggestList(Array.isArray(sug) ? sug : []);
          })
          .catch(() => {
            setSuggestList([]);
          });
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
    t,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    newOnly,
    brandsSelected,
    stockOnly,
    ratingMin,
    page,
  ]);

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

  const hotCategories: {
    key: string;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "hang-moi",
      label: t("hot.hang-moi"),
      icon: <NewReleasesIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "giam-gia-sau",
      label: t("hot.giam-gia-sau"),
      icon: <SellIcon sx={{ fontSize: 24 }} />,
    },
    {
      key: "bestseller",
      label: t("hot.bestseller"),
      icon: <WhatshotIcon sx={{ fontSize: 24 }} />,
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
      key: "phu-kien",
      label: t("category.phu-kien"),
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
    <Box sx={{ bgcolor: isDark ? "#121212" : "#F5F5F5", minHeight: "100vh" }}>
      <BannerCarousel />
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 } }}>
        <RecentlyViewed />
        <Paper
          sx={{
            p: 2.5,
            mb: 3,
            mt: 3,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: isDark ? "#1e1e1e" : "#fff",
            borderRadius: 2,
            border: isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid #E8E8E8",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Chip
            icon={<VerifiedIcon sx={{ fontSize: 18, color: "#1A94FF" }} />}
            label={t("chip.authentic")}
            sx={{
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              color: isDark ? "#fff" : "#333",
              fontWeight: 600,
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #E8E8E8",
              "&:hover": { borderColor: "#1A94FF" },
            }}
          />
          <Chip
            icon={<LocalShippingIcon sx={{ fontSize: 18, color: "#1A94FF" }} />}
            label={t("chip.freeship")}
            sx={{
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              color: isDark ? "#fff" : "#333",
              fontWeight: 600,
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #E8E8E8",
              "&:hover": { borderColor: "#1A94FF" },
            }}
          />
          <Chip
            icon={
              <MonetizationOnIcon sx={{ fontSize: 18, color: "#FF424E" }} />
            }
            label={t("chip.refund")}
            sx={{
              bgcolor: "#fff",
              color: "#333",
              fontWeight: 600,
              border: "1px solid #E8E8E8",
              "&:hover": { borderColor: "#FF424E" },
            }}
          />
          <Chip
            icon={<AutorenewIcon sx={{ fontSize: 18, color: "#1A94FF" }} />}
            label={t("chip.returns30")}
            sx={{
              bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              color: isDark ? "#fff" : "#333",
              fontWeight: 600,
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #E8E8E8",
              "&:hover": { borderColor: "#1A94FF" },
            }}
          />
          <Chip
            icon={<FlashOnIcon sx={{ fontSize: 18, color: "#FF424E" }} />}
            label={t("chip.delivery2h")}
            sx={{
              bgcolor: "#fff",
              color: "#333",
              fontWeight: 600,
              border: "1px solid #E8E8E8",
              "&:hover": { borderColor: "#FF424E" },
            }}
          />
          <Chip
            icon={<SellIcon sx={{ fontSize: 18, color: "#FF424E" }} />}
            label={t("chip.superCheap")}
            sx={{
              bgcolor: "#fff",
              color: "#333",
              fontWeight: 600,
              border: "1px solid #E8E8E8",
              "&:hover": { borderColor: "#FF424E" },
            }}
          />
        </Paper>

        <FlashSaleSection />

        <ProductSection
          title={t("section.featured.title")}
          subtitle={t("section.featured.subtitle")}
          queryParams={{ sort: "rating_desc" }}
          limit={8}
        />

        <ProductSection
          title={t("section.newArrivals.title")}
          subtitle={t("section.newArrivals.subtitle")}
          queryParams={{ newOnly: true, sort: "created_desc" }}
          limit={8}
        />

        <ProductSection
          title={t("section.bestseller.title")}
          subtitle={t("section.bestseller.subtitle")}
          queryParams={{ sort: "sold_desc" }}
          limit={8}
        />

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
              p: 2,
              display: { xs: "none", md: "block" },
              height: "100%",
              position: "sticky",
              top: 16,
              bgcolor: "#fff",
              border: "1px solid #E8E8E8",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#333",
                fontSize: "1.1rem",
              }}
            >
              {t("sidebar.categories")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {clothingCategories.map((c) => (
                <Box
                  key={c.key}
                  onClick={() => selectCategory(c.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    bgcolor: c.key === category ? "#E8F4FD" : "transparent",
                    border:
                      c.key === category
                        ? "1px solid #1A94FF"
                        : "1px solid transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: c.key === category ? "#E8F4FD" : "#F5F5F5",
                      borderColor: c.key === category ? "#1A94FF" : "#E8E8E8",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: c.key === category ? "#1A94FF" : "#666",
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: c.key === category ? 600 : 500,
                      color: c.key === category ? "#1A94FF" : "#333",
                    }}
                  >
                    {c.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "#FFF4E6",
                border: "1px solid #FFE0B2",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: "#FF424E",
                  fontSize: "1rem",
                }}
              >
                {t("sidebar.hot")}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {hotCategories.map((c) => (
                  <Box
                    key={c.key}
                    onClick={() => selectCategory(c.key)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "rgba(255,66,78,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FF424E",
                      }}
                    >
                      {c.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      {c.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
          <Box>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                bgcolor: "#fff",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  letterSpacing: "-0.01em",
                }}
              >
                {t("filter.title")}
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
                  label={t("filter.minPrice")}
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
                  label={t("filter.maxPrice")}
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
                  label={t("filter.sort")}
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
                  <MenuItem value="">{t("sort.default")}</MenuItem>
                  <MenuItem value="price_asc">{t("sort.priceAsc")}</MenuItem>
                  <MenuItem value="price_desc">{t("sort.priceDesc")}</MenuItem>
                  <MenuItem value="rating_desc">
                    {t("sort.ratingDesc")}
                  </MenuItem>
                  <MenuItem value="rating_asc">{t("sort.ratingAsc")}</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  label={t("filter.brands")}
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
                  label={t("filter.priceRange")}
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
                  <MenuItem value="">{t("sort.default")}</MenuItem>
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
                  label={t("filter.inStock")}
                  sx={{ gridColumn: { md: "span 2" }, ml: 0 }}
                />
                <TextField
                  size="small"
                  label={t("filter.ratingMin")}
                  select
                  value={ratingMin}
                  onChange={(e) => setRatingMin(String(e.target.value))}
                  fullWidth
                  sx={{ gridColumn: { md: "span 2" } }}
                >
                  <MenuItem value="">{t("sort.default")}</MenuItem>
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
                  label={t("filter.newOnly")}
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
                    navigate({
                      pathname: "/",
                      search: `?${params.toString()}`,
                    });
                  }}
                >
                  {t("filter.apply")}
                </Button>
              </Box>
            </Paper>

            <Typography
              variant="h4"
              mb={3}
              sx={{
                fontWeight: 700,
                color: "#333",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {t("products.title")}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {suggestList.length > 0 && (
              <Paper
                sx={{
                  p: 2.5,
                  mb: 3,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid #E8E8E8",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: "#333" }}
                >
                  {t("suggestions.title")}
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
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "#F5F5F5",
                          transform: "translateY(-2px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                      onClick={() => navigate(`/product/${s.id}`)}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          overflow: "hidden",
                          flexShrink: 0,
                          bgcolor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "#f5f5f5",
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "1px solid rgba(0,0,0,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {s.imageUrl ? (
                          <Box
                            component="img"
                            src={toAbs(s.imageUrl)}
                            alt={s.name || s.nameEn || "Product"}
                            onError={(e: any) => {
                              e.target.style.display = "none";
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                        <Box
                          sx={{
                            display: s.imageUrl ? "none" : "flex",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: isDark
                              ? "rgba(26,148,255,0.2)"
                              : "#E3F2FD",
                          }}
                        >
                          <ShoppingBagIcon
                            sx={{ color: "#1A94FF", fontSize: 32 }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: isDark ? "#fff" : "#333",
                          }}
                        >
                          {lang === "en" && s.nameEn ? s.nameEn : s.name}
                        </Typography>
                        {s.price && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#FF424E",
                              fontWeight: 600,
                              mt: 0.25,
                              display: "block",
                            }}
                          >
                            {formatCurrency(s.price)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}

            <Box sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gap: { xs: 2, md: 2.5 },
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(5, 1fr)",
                  },
                  bgcolor: "#fff",
                  p: { xs: 1.5, md: 2.5 },
                  borderRadius: 2,
                  border: "1px solid #E8E8E8",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {loading ? (
                  <LoadingSkeleton variant="product" count={8} />
                ) : (
                  products
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
                          onClick={() => handleProductClick(p.id)}
                          onQuickView={handleQuickView}
                        />
                      </Box>
                    ))
                )}
              </Box>
              <Box
                mt={4}
                display="flex"
                justifyContent="center"
                sx={{ bgcolor: "transparent", p: 2 }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, v) => {
                    setPage(v);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      "&.Mui-selected": {
                        bgcolor: "#1A94FF",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "#0D7AE6",
                        },
                      },
                      "&:hover": {
                        bgcolor: "rgba(26,148,255,0.1)",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ProductQuickView
        open={quickViewOpen}
        onClose={() => {
          setQuickViewOpen(false);
          setQuickViewProductId(null);
        }}
        productId={quickViewProductId}
      />
    </Box>
  );
};

export default HomePage;
