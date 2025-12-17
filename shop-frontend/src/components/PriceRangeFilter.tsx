import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useI18n } from "../i18n";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  currentMin?: number;
  currentMax?: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  currentMin,
  currentMax,
}) => {
  const { t, lang } = useI18n();
  const [localMin, setLocalMin] = useState(currentMin || minPrice);
  const [localMax, setLocalMax] = useState(currentMax || maxPrice);

  useEffect(() => {
    setLocalMin(currentMin || minPrice);
    setLocalMax(currentMax || maxPrice);
  }, [currentMin, currentMax, minPrice, maxPrice]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setLocalMin(min);
    setLocalMax(max);
  };

  const handleApply = () => {
    onPriceChange(localMin, localMax);
  };

  const handleReset = () => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
    onPriceChange(minPrice, maxPrice);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        {lang === "en" ? "Price Range" : "Khoảng giá"}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Slider
          value={[localMin, localMax]}
          onChange={handleSliderChange}
          min={minPrice}
          max={maxPrice}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value.toLocaleString()} ₫`}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label={lang === "en" ? "Min" : "Tối thiểu"}
            type="number"
            value={localMin}
            onChange={(e) => {
              const val = Math.max(
                minPrice,
                Math.min(maxPrice, Number(e.target.value))
              );
              setLocalMin(val);
            }}
            size="small"
            inputProps={{ min: minPrice, max: maxPrice }}
            sx={{ flex: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
          <TextField
            label={lang === "en" ? "Max" : "Tối đa"}
            type="number"
            value={localMax}
            onChange={(e) => {
              const val = Math.max(
                minPrice,
                Math.min(maxPrice, Number(e.target.value))
              );
              setLocalMax(val);
            }}
            size="small"
            inputProps={{ min: minPrice, max: maxPrice }}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleApply}
          fullWidth
        >
          {lang === "en" ? "Apply" : "Áp dụng"}
        </Button>
        <Button variant="outlined" size="small" onClick={handleReset} fullWidth>
          {lang === "en" ? "Reset" : "Đặt lại"}
        </Button>
      </Box>
    </Paper>
  );
};

export default PriceRangeFilter;
