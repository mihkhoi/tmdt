import React, { useState, useEffect } from "react";
import { IconButton, Tooltip, Badge } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface WishlistButtonProps {
  productId: number;
  size?: "small" | "medium" | "large";
  showBadge?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  size = "medium",
  showBadge = false,
}) => {
  const auth = useSelector((s: RootState) => s.auth);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const updateWishlistState = () => {
      if (auth.token) {
        const wishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        ) as number[];
        setIsWishlisted(wishlist.includes(productId));
      }
    };

    updateWishlistState();

    // Listen for wishlist updates from other components
    window.addEventListener("wishlist-updated", updateWishlistState);
    return () => {
      window.removeEventListener("wishlist-updated", updateWishlistState);
    };
  }, [productId, auth.token]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!auth.token) {
      // Redirect to login or show message
      return;
    }

    const wishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    ) as number[];
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      setIsWishlisted(false);
    } else {
      wishlist.push(productId);
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  };

  const wishlistCount = auth.token
    ? (JSON.parse(localStorage.getItem("wishlist") || "[]") as number[]).length
    : 0;

  const button = (
    <IconButton
      onClick={toggleWishlist}
      size={size}
      sx={{
        color: isWishlisted ? "#FF424E" : "inherit",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.1)",
          color: "#FF424E",
        },
      }}
    >
      {isWishlisted ? (
        <FavoriteIcon sx={{ fontSize: size === "large" ? 32 : 24 }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: size === "large" ? 32 : 24 }} />
      )}
    </IconButton>
  );

  if (showBadge && auth.token) {
    return (
      <Tooltip
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Badge badgeContent={wishlistCount} color="error" showZero={false}>
          {button}
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
      {button}
    </Tooltip>
  );
};

export default WishlistButton;
