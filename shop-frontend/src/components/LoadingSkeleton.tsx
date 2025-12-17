import React from "react";
import { Skeleton, Box, Card, CardContent } from "@mui/material";

interface LoadingSkeletonProps {
  variant?: "product" | "text" | "card" | "list";
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "product",
  count = 1,
}) => {
  if (variant === "product") {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <Card
            key={idx}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={240}
              animation="wave"
            />
            <CardContent
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="40%"
                height={20}
                sx={{ mt: 1 }}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="80%"
                height={32}
                sx={{ mt: 2 }}
                animation="wave"
              />
              <Box sx={{ mt: "auto", pt: 2 }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  animation="wave"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (variant === "card") {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <Card key={idx} sx={{ p: 2, mb: 2 }}>
            <Skeleton variant="text" width="40%" height={24} animation="wave" />
            <Skeleton
              variant="text"
              width="100%"
              height={20}
              sx={{ mt: 1 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{ mt: 1 }}
              animation="wave"
            />
          </Card>
        ))}
      </>
    );
  }

  if (variant === "list") {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={80}
              height={80}
              animation="wave"
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="40%"
                height={20}
                sx={{ mt: 1 }}
                animation="wave"
              />
            </Box>
          </Box>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} variant="text" width="100%" animation="wave" />
      ))}
    </>
  );
};

export default LoadingSkeleton;
