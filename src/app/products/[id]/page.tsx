"use client";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Chip,
  CardMedia,
  Rating,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  useTheme,
} from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { getRgbaColor, appGradients } from "@/theme/colors";

type Product = {
  _id: string;
  name?: string;
  brand?: string;
  price?: number;
  currency?: string;
  description?: string;
  images?: Array<{ url: string; alt?: string }>;
  ratingCount?: number;
  ratingAverage?: number;
  categories?: string;
  sku?: string;
  stock?: number;
};

export default function ProductDetailPage() {
  const theme = useTheme();
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;
  const { token, user } = useAuth();
  const { addToCart: addToCartContext, isInCart } = useCart();

  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const successMain = theme.palette.success.main;
  const errorMain = theme.palette.error.main;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const white = theme.palette.common.white;
  const black = theme.palette.common.black;
  const backgroundPaper = theme.palette.background.paper;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [wishlistItems, setWishlistItems] = React.useState<Set<string>>(
    new Set()
  );
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({});
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  const thumbsRef = React.useRef<HTMLDivElement | null>(null);
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const onThumbWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!thumbsRef.current) return;
    // Always consume wheel while over the gallery to avoid page scroll
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    thumbsRef.current.scrollLeft += delta;
    e.preventDefault();
    e.stopPropagation();
  };

  const onThumbTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const onThumbTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!thumbsRef.current || !touchStartRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    // If horizontal gesture dominates, scroll the gallery and prevent page scroll
    if (Math.abs(dx) > Math.abs(dy)) {
      thumbsRef.current.scrollLeft -= dx;
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const apiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBase}/api/products/${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct((data?.data as Product) ?? (data as Product));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, apiBase]);

  const handleImageSelect = (index: number) => setSelectedImageIndex(index);

  const addToCart = async (pid: string) => {
    setLoadingStates((prev) => ({ ...prev, [`cart-${pid}`]: true }));
    try {
      await addToCartContext(pid, 1, "");
      toast.success("Added to cart successfully!", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: successMain,
          color: white,
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    } catch (e) {
      toast.error(
        `Error: ${e instanceof Error ? e.message : "Failed to add to cart"}`,
        {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: errorMain,
            color: white,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`cart-${pid}`]: false }));
    }
  };

  const addToWishlist = async (pid: string) => {
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }
    let userId = user?.id;
    if (!userId && token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        userId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
      } catch {}
    }
    if (!userId) {
      try {
        const storedUser =
          localStorage.getItem("authUser") ||
          sessionStorage.getItem("authUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.id || parsedUser._id;
        }
      } catch {}
      if (!userId) {
        alert("User information is missing. Please login again.");
        return;
      }
    }

    setLoadingStates((prev) => ({ ...prev, [`wishlist-${pid}`]: true }));
    try {
      const response = await fetch("http://localhost:3000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: pid, notes: "", userId }),
      });
      if (response.ok) {
        setWishlistItems((prev) => new Set([...prev, pid]));
        toast.success("Added to wishlist!", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: successMain,
            color: white,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
      } else {
        const err = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        toast.error(
          `Error adding item to wishlist: ${err.message || "Unknown error"}`,
          {
            duration: 4000,
            position: "bottom-right",
            style: {
              background: errorMain,
              color: white,
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }
        );
      }
    } catch (e) {
      toast.error(
        `Network error: ${
          e instanceof Error ? e.message : "Failed to add to wishlist"
        }`,
        {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: errorMain,
            color: white,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`wishlist-${pid}`]: false }));
    }
  };

  const removeFromWishlist = async (pid: string) => {
    if (!token) return;
    setLoadingStates((prev) => ({ ...prev, [`wishlist-${pid}`]: true }));
    try {
      const response = await fetch(
        `http://localhost:3000/api/wishlist/remove/${pid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setWishlistItems((prev) => {
          const s = new Set(prev);
          s.delete(pid);
          return s;
        });
        toast.success("Removed from wishlist!", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: successMain,
            color: white,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to remove from wishlist", {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: errorMain,
            color: white,
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
      }
    } catch {
      toast.error("Failed to remove from wishlist", {
        duration: 4000,
        position: "bottom-right",
        style: {
          background: errorMain,
          color: white,
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`wishlist-${pid}`]: false }));
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color={theme.palette.text.secondary}>
          Loading product...
        </Typography>
      </Box>
    );
  } else if (error || !product) {
    return (
      <Box
        sx={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color={theme.palette.error.main}>
          {error || "Product not found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: backgroundPaper }}>
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 2, sm: 3, md: 4, lg: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "stretch", lg: "flex-start" },
            bgcolor: black,
          }}
        >
          {/* Left: Images */}
          <Box
            sx={{
              flex: { xs: "none", lg: "0 0 50%" },
              width: { xs: "100%", lg: "auto" },
              height: { xs: "90vh", lg: "90vh" },
              background: appGradients.background(),
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderLeft: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
              borderTop: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
              borderBottom: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
              boxShadow: `0 4px 20px ${getRgbaColor(black, 0.1)}, 0 0 0 1px ${getRgbaColor(primaryMain, 0.1)}`,
            }}
          >
            {/* Main Image Container */}
            <Box 
              sx={{ 
                flex: 1, 
                position: "relative", 
                overflow: "hidden",
                minHeight: { xs: 250, sm: 300, md: 350, lg: 400 },
                background: getRgbaColor(backgroundPaper, 0.3),
              }}
            >
              <CardMedia
                component="img"
                image={
                  product.images?.[selectedImageIndex]?.url ||
                  "/placeholder-image.jpg"
                }
                alt={product.name ?? "Product Image"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />

              {/* Badges */}
              <Box
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  display: "flex",
                  gap: 1,
                  flexDirection: "column",
                  zIndex: 2,
                }}
              >
                {/* Add badges when createdAt/ratingCount are available */}
              </Box>
            </Box>

            {/* Image Gallery */}
            {product.images && product.images.length > 1 && (
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  pt: { xs: 2.5, sm: 3 },
                  background: getRgbaColor(backgroundPaper, 0.98),
                  backdropFilter: "blur(10px)",
                  borderTop: `1px solid ${getRgbaColor(primaryMain, 0.15)}`,
                  boxShadow: `0 -2px 10px ${getRgbaColor(black, 0.05)}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: textPrimary,
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  All Images ({product.images.length})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 1.5 },
                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 1,
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                    scrollbarWidth: "thin",
                    scrollbarColor: `${getRgbaColor(primaryMain, 0.6)} ${getRgbaColor(black, 0.1)}`,
                    "&::-webkit-scrollbar": { 
                      height: { xs: 4, sm: 6 },
                    },
                    "&::-webkit-scrollbar-track": {
                      background: getRgbaColor(black, 0.05),
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: getRgbaColor(primaryMain, 0.5),
                      borderRadius: 3,
                      "&:hover": {
                        background: getRgbaColor(primaryMain, 0.7),
                      },
                    },
                  }}
                  ref={thumbsRef}
                  onWheel={onThumbWheel}
                  onTouchStart={onThumbTouchStart}
                  onTouchMove={onThumbTouchMove}
                >
                  {product.images.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      sx={{
                        flex: "0 0 auto",
                        width: { xs: 70, sm: 80, md: 90 },
                        height: { xs: 70, sm: 80, md: 90 },
                        cursor: "pointer",
                        scrollSnapAlign: "start",
                        border:
                          selectedImageIndex === index
                            ? `3px solid ${primaryMain}`
                            : `3px solid ${getRgbaColor(primaryMain, 0.1)}`,
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        boxShadow:
                          selectedImageIndex === index
                            ? `0 4px 12px ${getRgbaColor(primaryMain, 0.4)}`
                            : `0 2px 6px ${getRgbaColor(black, 0.08)}`,
                        "&:hover": {
                          borderColor: primaryMain,
                          transform: "scale(1.05)",
                          boxShadow: `0 4px 12px ${getRgbaColor(primaryMain, 0.3)}`,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image.url}
                        alt={`${product.name ?? "Product"} - Image ${
                          index + 1
                        }`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Right: Details */}
          <Box
            sx={{
              flex: { xs: "none", lg: "0 0 50%" },
              width: { xs: "100%", lg: "auto" },
              height: { xs: "90vh", lg: "90vh" },
              display: "flex",
              flexDirection: "column",
              background: appGradients.background(),
              boxShadow: `0 2px 10px ${getRgbaColor(black, 0.05)}`,
              overflow: "hidden",
            }}
          >
            <Box 
              sx={{ 
                p: { xs: 2.5, sm: 3, md: 4 }, 
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: { lg: "auto" },
                maxHeight: { lg: "100vh" },
              }}
            >
              {/* Category placeholder */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "1px",
                  color: textSecondary,
                }}
              >
                Product
              </Typography>

              {/* Name */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: textPrimary,
                  mt: 1,
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  lineHeight: 1.2,
                }}
              >
                {product.name ?? "Product"}
              </Typography>

              {/* Rating */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  p: { xs: 1.5, sm: 2 },
                  background: getRgbaColor(primaryMain, 0.08),
                  borderRadius: 2,
                  boxShadow: `0 2px 8px ${getRgbaColor(primaryMain, 0.1)}`,
                }}
              >
                <Rating
                  value={product.ratingAverage || product.ratingCount || 0}
                  readOnly
                  sx={{ mr: 2 }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: textPrimary, fontSize: "0.9rem" }}
                >
                  ({product.ratingCount || 0} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: primaryMain,
                  mb: 3,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  textShadow: `0 2px 4px ${getRgbaColor(primaryMain, 0.3)}`,
                }}
              >
                {product.price} {product.currency}
              </Typography>

              {/* Description */}
              {product.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: textPrimary,
                      fontSize: "1.1rem",
                    }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: textSecondary, lineHeight: 1.6, fontSize: "1rem" }}
                  >
                    {product.description}
                  </Typography>
                </Box>
              )}

              {/* Details */}
              <Box
                sx={{
                  mb: 4,
                  p: { xs: 2, sm: 2.5, md: 3 },
                  background: getRgbaColor(backgroundPaper, 0.6),
                  borderRadius: 2,
                  boxShadow: `0 2px 8px ${getRgbaColor(black, 0.05)}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: textPrimary,
                    fontSize: "1.1rem",
                  }}
                >
                  Product Details
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {product.brand && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        background: getRgbaColor(primaryMain, 0.05),
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          minWidth: 80,
                          color: textPrimary,
                          fontSize: "0.9rem",
                        }}
                      >
                        Brand:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: textSecondary,
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      >
                        {product.brand}
                      </Typography>
                    </Box>
                  )}
                  {product.sku && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        background: getRgbaColor(primaryMain, 0.05),
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          minWidth: 80,
                          color: textPrimary,
                          fontSize: "0.9rem",
                        }}
                      >
                        SKU:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: textSecondary,
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      >
                        {product.sku}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                      background: getRgbaColor(successMain, 0.05),
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        minWidth: 80,
                        color: textPrimary,
                        fontSize: "0.9rem",
                      }}
                    >
                      Stock:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: textSecondary,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      {product.stock || 0} available
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 1, borderColor: getRgbaColor(primaryMain, 0.3) }} />

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: 1.5, sm: 2 },
                  flexDirection: { xs: "column", sm: "row" },
                  mt: "auto",
                  pt: { xs: 2, sm: 3 },
                  pb: { xs: 1, sm: 0 },
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(product._id)}
                  disabled={
                    loadingStates[`cart-${product._id}`] ||
                    isInCart(product._id)
                  }
                  sx={{
                    background: appGradients.primary(theme),
                    color: theme.palette.primary.contrastText,
                    fontWeight: 700,
                    borderRadius: 3,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    textTransform: "none",
                    boxShadow: isInCart(product._id)
                      ? `0 4px 12px ${getRgbaColor(successMain, 0.3)}`
                      : `0 4px 12px ${getRgbaColor(primaryMain, 0.3)}`,
                    "&:hover": {
                      background: appGradients.primary(theme),
                      transform: "translateY(-2px)",
                      boxShadow: isInCart(product._id)
                        ? `0 6px 16px ${getRgbaColor(successMain, 0.4)}`
                        : `0 6px 16px ${getRgbaColor(primaryMain, 0.4)}`,
                    },
                    "&:disabled": { opacity: 0.6, transform: "none" },
                    transition: "all 0.3s ease",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {loadingStates[`cart-${product._id}`]
                    ? "Adding..."
                    : isInCart(product._id)
                    ? "In Cart"
                    : "Add to Cart"}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Favorite />}
                  onClick={() => {
                    if (wishlistItems.has(product._id)) {
                      removeFromWishlist(product._id);
                    } else {
                      addToWishlist(product._id);
                    }
                  }}
                  disabled={loadingStates[`wishlist-${product._id}`]}
                  sx={{
                    borderColor: wishlistItems.has(product._id)
                      ? primaryMain
                      : primaryDark,
                    color: wishlistItems.has(product._id)
                      ? primaryMain
                      : primaryDark,
                    background: wishlistItems.has(product._id)
                      ? getRgbaColor(primaryMain, 0.1)
                      : getRgbaColor(primaryMain, 0.05),
                    fontWeight: 700,
                    borderRadius: 3,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    textTransform: "none",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: primaryMain,
                      color: primaryMain,
                      background: getRgbaColor(primaryMain, 0.15),
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 16px ${getRgbaColor(primaryMain, 0.2)}`,
                    },
                    "&:disabled": { opacity: 0.6, transform: "none" },
                    transition: "all 0.3s ease",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {loadingStates[`wishlist-${product._id}`]
                    ? "Updating..."
                    : wishlistItems.has(product._id)
                    ? "In Wishlist"
                    : "Add to Wishlist"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
