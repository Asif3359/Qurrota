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
} from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

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
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;
  const { token, user } = useAuth();
  const { addToCart: addToCartContext, isInCart } = useCart();

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
          background: "#4CAF50",
          color: "#fff",
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
            background: "#f44336",
            color: "#fff",
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
            background: "#4CAF50",
            color: "#fff",
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
              background: "#f44336",
              color: "#fff",
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
            background: "#f44336",
            color: "#fff",
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
            background: "#4CAF50",
            color: "#fff",
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
            background: "#f44336",
            color: "#fff",
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
          background: "#f44336",
          color: "#fff",
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
        <Typography variant="h6" color="text.secondary">
          Loading product...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="error">
          {error || "Product not found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", backgroundColor: "background.paper" }}>
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          overflow: "hidden",
          height: "100%",
          pt: { xs: 3, md: 6 },
          px: { xs: 2, md: 4 },
          pb: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left: Images */}
          <Box
            sx={{
              flex: { xs: "none", md: "0 0 50%" },
              position: "relative",
              minHeight: { xs: 280, sm: 360, md: 520 },
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Main Image Container */}
            <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
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
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.02)" },
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
                  p: 3,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderTop: "1px solid rgba(255, 215, 0, 0.2)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: "#333",
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
                    gap: 1.5,
                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 1,
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain", // prevent scroll chaining to body
                    "&::-webkit-scrollbar": { height: 6 }, // or hide:
                    // "&::-webkit-scrollbar": { display: "none" },
                    "&::-webkit-scrollbar-track": {
                      background: "rgba(0, 0, 0, 0.1)",
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(255, 215, 0, 0.6)",
                      borderRadius: 3,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "rgba(255, 215, 0, 0.8)",
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
                        width: 90,
                        height: 90,
                        cursor: "pointer",
                        scrollSnapAlign: "start",
                        border:
                          selectedImageIndex === index
                            ? "3px solid #FFD700"
                            : "3px solid transparent",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        boxShadow:
                          selectedImageIndex === index
                            ? "0 4px 12px rgba(255, 215, 0, 0.4)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          borderColor:
                            selectedImageIndex === index
                              ? "#FFD700"
                              : "#9C27B0",
                          transform: "scale(1.08)",
                          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
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
              flex: { xs: "none", md: "0 0 50%" },
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              maxHeight: { md: "80vh" },
              minHeight: { xs: 300, sm: 380, md: 520 },
            }}
          >
            <Box sx={{ p: { xs: 3, md: 4 }, flex: 1 }}>
              {/* Category placeholder */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "1px",
                  color: "#666",
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
                  color: "#1a1a1a",
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
                  p: 2,
                  background: "rgba(255, 215, 0, 0.1)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                }}
              >
                <Rating
                  value={product.ratingAverage || product.ratingCount || 0}
                  readOnly
                  sx={{ mr: 2 }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#333", fontSize: "0.9rem" }}
                >
                  ({product.ratingCount || 0} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#FFD700",
                  mb: 3,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  textShadow: "0 2px 4px rgba(255, 215, 0, 0.3)",
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
                      color: "#333",
                      fontSize: "1.1rem",
                    }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#555", lineHeight: 1.6, fontSize: "1rem" }}
                  >
                    {product.description}
                  </Typography>
                </Box>
              )}

              {/* Details */}
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 2,
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: "#333",
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
                        background: "rgba(255, 215, 0, 0.05)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          minWidth: 80,
                          color: "#333",
                          fontSize: "0.9rem",
                        }}
                      >
                        Brand:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
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
                        background: "rgba(156, 39, 176, 0.05)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          minWidth: 80,
                          color: "#333",
                          fontSize: "0.9rem",
                        }}
                      >
                        SKU:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
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
                      background: "rgba(76, 175, 80, 0.05)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        minWidth: 80,
                        color: "#333",
                        fontSize: "0.9rem",
                      }}
                    >
                      Stock:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      {product.stock || 0} available
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3, borderColor: "rgba(255, 215, 0, 0.3)" }} />

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  mt: "auto",
                  pt: 2,
                  position: "sticky",
                  bottom: 0,
                  width: "100%",
                  zIndex: 1,
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
                    background: isInCart(product._id)
                      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                      : "linear-gradient(135deg, #FFD700 0%, #FFC000 100%)",
                    color: "#000",
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 4,
                    py: 2,
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: isInCart(product._id)
                      ? "0 4px 12px rgba(76, 175, 80, 0.3)"
                      : "0 4px 12px rgba(255, 215, 0, 0.3)",
                    "&:hover": {
                      background: isInCart(product._id)
                        ? "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)"
                        : "linear-gradient(135deg, #FFC000 0%, #FFB300 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: isInCart(product._id)
                        ? "0 6px 16px rgba(76, 175, 80, 0.4)"
                        : "0 6px 16px rgba(255, 215, 0, 0.4)",
                    },
                    "&:disabled": { opacity: 0.6, transform: "none" },
                    transition: "all 0.3s ease",
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
                      ? "#FFD700"
                      : "#9C27B0",
                    color: wishlistItems.has(product._id)
                      ? "#FFD700"
                      : "#9C27B0",
                    background: wishlistItems.has(product._id)
                      ? "rgba(255, 215, 0, 0.1)"
                      : "rgba(156, 39, 176, 0.05)",
                    fontWeight: 700,
                    borderRadius: 3,
                    px: 4,
                    py: 2,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#FFD700",
                      color: "#FFD700",
                      background: "rgba(255, 215, 0, 0.15)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(255, 215, 0, 0.2)",
                    },
                    "&:disabled": { opacity: 0.6, transform: "none" },
                    transition: "all 0.3s ease",
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
