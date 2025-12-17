import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useI18n } from "../i18n";

interface CompareButtonProps {
  productId: number;
  size?: "small" | "medium" | "large";
}

const CompareButton: React.FC<CompareButtonProps> = ({
  productId,
  size = "medium",
}) => {
  const { lang } = useI18n();
  const [isCompared, setIsCompared] = React.useState(false);

  React.useEffect(() => {
    const compared = JSON.parse(
      localStorage.getItem("comparedProducts") || "[]"
    ) as number[];
    setIsCompared(compared.includes(productId));
  }, [productId]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const compared = JSON.parse(
      localStorage.getItem("comparedProducts") || "[]"
    ) as number[];
    const index = compared.indexOf(productId);

    if (index > -1) {
      compared.splice(index, 1);
      setIsCompared(false);
    } else {
      if (compared.length >= 4) {
        alert(
          lang === "en"
            ? "You can compare up to 4 products"
            : "Bạn chỉ có thể so sánh tối đa 4 sản phẩm"
        );
        return;
      }
      compared.push(productId);
      setIsCompared(true);
    }

    localStorage.setItem("comparedProducts", JSON.stringify(compared));
    window.dispatchEvent(new CustomEvent("compare-updated"));
  };

  return (
    <Tooltip
      title={
        isCompared
          ? lang === "en"
            ? "Remove from comparison"
            : "Xóa khỏi so sánh"
          : lang === "en"
          ? "Add to comparison"
          : "Thêm vào so sánh"
      }
    >
      <IconButton
        onClick={toggleCompare}
        size={size}
        sx={{
          color: isCompared ? "#1A94FF" : "inherit",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            color: "#1A94FF",
          },
        }}
      >
        <CompareArrowsIcon sx={{ fontSize: size === "large" ? 32 : 24 }} />
      </IconButton>
    </Tooltip>
  );
};

export default CompareButton;
