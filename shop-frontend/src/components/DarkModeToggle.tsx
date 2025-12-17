import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material/styles";

const DarkModeToggle: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const toggleTheme = () => {
    window.dispatchEvent(new CustomEvent("app:toggle-theme"));
  };

  return (
    <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: "inherit",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "rotate(20deg) scale(1.1)",
          },
        }}
      >
        {isDark ? (
          <LightModeIcon sx={{ fontSize: 24 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 24 }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
