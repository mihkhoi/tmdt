import React, { useState, useMemo, useEffect } from "react";
import { Box, IconButton, Dialog, DialogContent, Zoom } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface ProductImageGalleryProps {
  images: string[];
  mainImage: string | null;
  onImageChange?: (imageUrl: string) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  mainImage,
  onImageChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const allImages = useMemo(() => {
    if (mainImage) {
      const others = images.filter((img) => img !== mainImage);
      return [mainImage, ...others];
    }
    return images;
  }, [mainImage, images]);

  const currentImage = allImages[selectedIndex] || mainImage || "";

  useEffect(() => {
    if (allImages.length > 0) {
      if (selectedIndex >= allImages.length) {
        setSelectedIndex(0);
      }
    } else {
      setSelectedIndex(0);
    }
  }, [allImages.length, selectedIndex]);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    if (onImageChange && allImages[index]) {
      onImageChange(allImages[index]);
    }
  };

  const handleZoom = (imageUrl: string) => {
    setZoomImage(imageUrl);
    setZoomOpen(true);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => {
      if (allImages.length === 0) return 0;
      return prev > 0 ? prev - 1 : allImages.length - 1;
    });
  };

  const handleNext = () => {
    setSelectedIndex((prev) => {
      if (allImages.length === 0) return 0;
      return prev < allImages.length - 1 ? prev + 1 : 0;
    });
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {/* Main Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "100%",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#f5f5f5",
            mb: 2,
            cursor: "zoom-in",
            "&:hover .zoom-overlay": {
              opacity: 1,
            },
          }}
          onClick={() => handleZoom(currentImage)}
        >
          <Box
            component="img"
            src={currentImage}
            alt="Product"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
          <Box
            className="zoom-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <ZoomInIcon sx={{ color: "#fff", fontSize: 48 }} />
          </Box>
        </Box>

        {/* Navigation Buttons */}
        {allImages.length > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": { bgcolor: "#fff" },
                zIndex: 1,
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": { bgcolor: "#fff" },
                zIndex: 1,
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              pb: 1,
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#ccc",
                borderRadius: 3,
              },
            }}
          >
            {allImages.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                sx={{
                  minWidth: 80,
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  overflow: "hidden",
                  border:
                    selectedIndex === idx
                      ? "2px solid #1A94FF"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1A94FF",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Zoom Dialog */}
      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 1,
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          {zoomImage && (
            <Zoom in={zoomOpen} timeout={300}>
              <Box
                component="img"
                src={zoomImage}
                alt="Zoomed product"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            </Zoom>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageGallery;
