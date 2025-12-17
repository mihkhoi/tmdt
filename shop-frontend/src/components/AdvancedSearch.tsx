import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HistoryIcon from "@mui/icons-material/History";
import ClearIcon from "@mui/icons-material/Clear";
import { productApi } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

interface AdvancedSearchProps {
  onClose?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load search history
    const savedHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    ) as string[];
    setHistory(savedHistory.slice(0, 5));

    // Load trending searches (mock data - có thể lấy từ API)
    setTrending([
      "iPhone 15",
      "Laptop gaming",
      "Áo thun",
      "Giày thể thao",
      "Tai nghe",
    ]);

    // Focus input
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length >= 2) {
      setLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const results = await productApi.suggest(query);
          setSuggestions(Array.isArray(results) ? results.slice(0, 8) : []);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setLoading(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to history
    const newHistory = [
      searchQuery,
      ...history.filter((h) => h !== searchQuery),
    ].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // Navigate
    navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    if (onClose) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query);
    } else if (e.key === "Escape") {
      if (onClose) onClose();
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        mt: 1,
        maxHeight: "70vh",
        overflow: "auto",
        zIndex: 1300,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            lang === "en" ? "Search products..." : "Tìm kiếm sản phẩm..."
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setQuery("")}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {lang === "en" ? "Searching..." : "Đang tìm kiếm..."}
            </Typography>
          </Box>
        )}

        {!loading && suggestions.length > 0 && (
          <>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
            >
              {lang === "en" ? "Suggestions" : "Gợi ý"}
            </Typography>
            <List dense>
              {suggestions.map((item, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton
                    onClick={() => handleSearch(item.name || item)}
                  >
                    <SearchIcon
                      sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                    />
                    <ListItemText
                      primary={item.name || item}
                      secondary={
                        item.brand ? `Brand: ${item.brand}` : undefined
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {history.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "text.secondary" }}
              >
                <HistoryIcon
                  sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                />
                {lang === "en" ? "Recent Searches" : "Tìm kiếm gần đây"}
              </Typography>
              <IconButton size="small" onClick={clearHistory}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {history.map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  size="small"
                  onClick={() => handleSearch(item)}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {trending.length > 0 && (
          <>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
            >
              <TrendingUpIcon
                sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
              />
              {lang === "en" ? "Trending Searches" : "Tìm kiếm phổ biến"}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {trending.map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  size="small"
                  onClick={() => handleSearch(item)}
                  color="primary"
                  variant="outlined"
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
          </>
        )}

        {!loading &&
          suggestions.length === 0 &&
          history.length === 0 &&
          query.length < 2 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SearchIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {lang === "en"
                  ? "Start typing to search..."
                  : "Bắt đầu nhập để tìm kiếm..."}
              </Typography>
            </Box>
          )}
      </Box>
    </Paper>
  );
};

export default AdvancedSearch;
