import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  hasMore,
  loading,
  onLoadMore,
  threshold = 200,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observerRef.current.observe(currentSentinel);
    }

    return () => {
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel);
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <>
      {children}
      <Box
        ref={sentinelRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
          minHeight: 100,
        }}
      >
        {loading && hasMore && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Loading more...
            </Typography>
          </Box>
        )}
        {!hasMore && !loading && (
          <Typography variant="body2" color="text.secondary">
            No more products to load
          </Typography>
        )}
      </Box>
    </>
  );
};

export default InfiniteScroll;
