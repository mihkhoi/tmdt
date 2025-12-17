import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useI18n } from "../i18n";

interface ShareProductProps {
  productId: number;
  productName: string;
  productImage?: string;
}

const ShareProduct: React.FC<ShareProductProps> = ({
  productId,
  productName,
  productImage,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { lang } = useI18n();
  const open = Boolean(anchorEl);

  const productUrl = `${window.location.origin}/product/${productId}`;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(productName);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "copy":
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        handleClose();
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      handleClose();
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <ShareIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleShare("facebook")}>
          <ListItemIcon>
            <FacebookIcon fontSize="small" sx={{ color: "#1877F2" }} />
          </ListItemIcon>
          <ListItemText>Facebook</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare("twitter")}>
          <ListItemIcon>
            <TwitterIcon fontSize="small" sx={{ color: "#1DA1F2" }} />
          </ListItemIcon>
          <ListItemText>Twitter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare("whatsapp")}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" sx={{ color: "#25D366" }} />
          </ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare("copy")}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {lang === "en" ? "Copy Link" : "Sao chép liên kết"}
          </ListItemText>
        </MenuItem>
      </Menu>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">
          {lang === "en" ? "Link copied!" : "Đã sao chép liên kết!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareProduct;
