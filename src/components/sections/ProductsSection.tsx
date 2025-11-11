"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Modal,
  IconButton,
  Divider,
  Rating,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Favorite,
  Star,
  Close,
  Visibility,
} from "@mui/icons-material";
import { getRgbaColor, appGradients } from "@/theme/colors";
import { normalizeCsvInput } from "../utils/displayCsv";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  slug?: string;
  brand?: string;
  price: number;
  stock?: number;
  isPublished?: boolean;
  updatedAt?: string;
  createdAt?: string;
  currency?: string;
  sku?: string;
  images: Array<{
    url: string;
    alt: string;
    publicId?: string;
    isPrimary?: boolean;
  }>;
  ratingCount: number;
  ratingAverage?: number;
  description?: string;
  categories?: string;
  tags?: string;
  compareAtPrice?: number;
  variants?: Array<{
    name?: string;
    sku?: string;
    price?: number;
    stock?: number;
    isActive?: boolean;
  }>;
};

const ProductsSection: React.FC<{ isHomePage?: boolean }> = ({
  isHomePage = false,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { token, user } = useAuth();
  const { addToCart: addToCartContext, isInCart } = useCart();

  // Theme color constants
  const primaryMain = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const successMain = theme.palette.success.main;
  const errorMain = theme.palette.error.main;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const backgroundPaper = theme.palette.background.paper;
  const white = theme.palette.common.white;
  const black = theme.palette.common.black;

  // Debug user data on component mount
  React.useEffect(() => {
    console.log("ProductsSection: User data debug:", {
      user: user,
      user_id: user?.id,
      token: token ? "present" : "missing",
      isAuthenticated: !!user,
      userKeys: user ? Object.keys(user) : "no user",
    });
  }, [user, token]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [wishlistItems, setWishlistItems] = React.useState<Set<string>>(
    new Set()
  );
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [showCartConfirmation, setShowCartConfirmation] = React.useState(false);
  const [pendingCartProduct, setPendingCartProduct] =
    React.useState<Product | null>(null);
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  const apiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/published`;

  // Check if user has seen cart confirmation modal before
  const hasSeenCartConfirmation = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cartConfirmationSeen") === "true";
    }
    return false;
  };

  // Mark cart confirmation as seen
  const markCartConfirmationAsSeen = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartConfirmationSeen", "true");
    }
  };

  const getProducts = React.useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const [pubRes] = await Promise.all([
        fetch(`${apiBase}`, { cache: "no-store" }),
      ]);
      if (!pubRes.ok) throw new Error("Failed to load products");
      const pubData = await pubRes.json();
      // console.log(pubData.data)
      setProducts(pubData.data ?? []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0); // Reset to first image when opening modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Wishlist API functions
  const addToWishlist = async (productId: string) => {
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }

    // Try to get user ID from multiple sources
    let userId = user?.id;

    // Fallback: try to get user ID from token payload (if it's a JWT)
    if (!userId && token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        userId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
        console.log("Extracted user ID from token for wishlist:", userId);
      } catch (error) {
        console.error(
          "Failed to extract user ID from token for wishlist:",
          error
        );
      }
    }

    if (!userId) {
      console.error("User ID is missing for wishlist:", {
        user,
        token: token ? "present" : "missing",
      });

      // Try to get user ID from localStorage/sessionStorage as last resort
      try {
        const storedUser =
          localStorage.getItem("authUser") ||
          sessionStorage.getItem("authUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.id || parsedUser._id;
          console.log("Found user ID in storage for wishlist:", userId);
        }
      } catch (error) {
        console.error("Failed to get user from storage for wishlist:", error);
      }

      if (!userId) {
        alert("User information is missing. Please login again.");
        return;
      }
    }

    setLoadingStates((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));

    try {
      console.log("Adding to wishlist:", {
        productId,
        token: token ? "present" : "missing",
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          notes: "",
          userId: userId,
        }),
      });

      console.log(
        "Wishlist API response:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Wishlist API success:", result);
        setWishlistItems((prev) => new Set([...prev, productId]));
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
        const error = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Wishlist API error:", error);
        toast.error(
          `Error adding item to wishlist: ${error.message || "Unknown error"}`,
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
    } catch (error) {
      console.error("Wishlist network error:", error);
      toast.error(
        `Network error: ${
          error instanceof Error ? error.message : "Failed to add to wishlist"
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
      setLoadingStates((prev) => ({
        ...prev,
        [`wishlist-${productId}`]: false,
      }));
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!token) return;

    setLoadingStates((prev) => ({ ...prev, [`wishlist-${productId}`]: true }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
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
        const error = await response.json();
        toast.error(error.message || "Failed to remove from wishlist", {
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
    } catch (error) {
      console.error("Wishlist error:", error);
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
      setLoadingStates((prev) => ({
        ...prev,
        [`wishlist-${productId}`]: false,
      }));
    }
  };

  const checkWishlistStatus = React.useCallback(
    async (productId: string) => {
      if (!token) return false;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wishlist/check/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          return data.inWishlist || false;
        }
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
      return false;
    },
    [token]
  );

  // Cart function using context
  const addToCart = async (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    // Check if user has seen the confirmation modal before
    if (!hasSeenCartConfirmation()) {
      setPendingCartProduct(product);
      setShowCartConfirmation(true);
      return;
    }

    // If user has seen the modal before, add directly to cart
    await confirmAddToCart(productId);
  };

  // Confirm add to cart function
  const confirmAddToCart = async (productId: string) => {
    setLoadingStates((prev) => ({ ...prev, [`cart-${productId}`]: true }));

    try {
      await addToCartContext(productId, 1, "");
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
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(
        `Error: ${
          error instanceof Error ? error.message : "Failed to add to cart"
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
      setLoadingStates((prev) => ({ ...prev, [`cart-${productId}`]: false }));
      setShowCartConfirmation(false);
      setPendingCartProduct(null);
      setDontShowAgain(false);
    }
  };

  // Cancel add to cart
  const cancelAddToCart = () => {
    setShowCartConfirmation(false);
    setPendingCartProduct(null);
    setDontShowAgain(false);
  };

  // Check wishlist status for all products
  React.useEffect(() => {
    if (products.length > 0 && token) {
      const checkAllWishlistStatuses = async () => {
        const wishlistPromises = products.map((product) =>
          checkWishlistStatus(product._id)
        );
        const wishlistResults = await Promise.all(wishlistPromises);

        const wishlistSet = new Set<string>();
        products.forEach((product, index) => {
          if (wishlistResults[index]) wishlistSet.add(product._id);
        });

        setWishlistItems(wishlistSet);
      };

      checkAllWishlistStatuses();
    }
  }, [products, token, checkWishlistStatus]);

  return (
    <Box
      sx={{
        pt: 6,
        pb: 6,
        // background: 'rgba(255, 255, 255, 0.8)',
        background: theme.palette.background.default,
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {
            isHomePage && (
              <Typography
                variant="h6"
                component="h2"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: { xs: 1, sm: 2 },
                  fontSize: { xs: "1.75rem", sm: "2.125rem", md: "3rem" },
                }}
              >
                Featured Products
              </Typography>
            )
          }

          {
            !isHomePage && (
              <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: { xs: 1, sm: 2 },
                  fontSize: { xs: "1.75rem", sm: "2.125rem", md: "3rem" },
                }}
              >
               Featured Products
              </Typography>
            )
          }
 

          <Typography
            variant={isSmallMobile ? "body1" : "h6"}
            align="center"
            color="text.secondary"
            sx={{
              mb: { xs: 4, sm: 5, md: 6 },
              maxWidth: 600,
              mx: "auto",
              px: { xs: 1, sm: 2 },
              fontSize: { xs: "0.875rem", sm: "1.25rem" },
            }}
          >
            Discover our carefully curated collection of premium products for
            kids and new mothers
          </Typography>
        </motion.div>

        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading products...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        )}



        {!loading && !error && products.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3, md: 3 },
            }}
          >
            {products.map((product, index) => (
              <Box key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: isMobile ? 0 : -10 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      background: getRgbaColor(backgroundPaper, 0.9),
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
                      borderRadius: { xs: 2, sm: 3 },
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: primaryMain,
                        background: getRgbaColor(backgroundPaper, 0.95),
                      },
                    }}
                    onClick={() => {
                      router.push(`/products/${product._id}`);
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        image={
                          product.images?.[0]?.url || "/placeholder-image.jpg"
                        }
                        alt={product.name}
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          height: { xs: "180px", sm: "200px", md: "220px" },
                        }}
                      />

                      {/* Badges */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: { xs: 8, sm: 12 },
                          left: { xs: 8, sm: 12 },
                          display: "flex",
                          gap: { xs: 0.5, sm: 1 },
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        {/* Show "New" badge for recently created products (within last 30 days) */}
                        {product.createdAt &&
                          new Date(product.createdAt) >
                            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                            <Chip
                              label="New"
                              size={isSmallMobile ? "small" : "small"}
                              sx={{
                                background: secondaryMain,
                                color: black,
                                fontWeight: 600,
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                height: { xs: 20, sm: 24 },
                              }}
                            />
                          )}
                        {/* Show "Popular" badge for products with high rating count */}
                        {product.ratingCount && product.ratingCount >= 5 && (
                          <Chip
                            label="Popular"
                            size={isSmallMobile ? "small" : "small"}
                            sx={{
                              background: primaryMain,
                              color: white,
                              fontWeight: 600,
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              height: { xs: 20, sm: 24 },
                            }}
                          />
                        )}
                      </Box>

                      {/* Favorite/Wishlist Button */}
                      {/* <Button
                      onClick={() => {
                        if (wishlistItems.has(product._id)) {
                          removeFromWishlist(product._id);
                        } else {
                          addToWishlist(product._id);
                        }
                      }}
                      disabled={loadingStates[`wishlist-${product._id}`]}
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 12 },
                        right: { xs: 8, sm: 12 },
                        minWidth: 'auto',
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        borderRadius: '50%',
                        background: wishlistItems.has(product._id) 
                          ? 'rgba(255, 215, 0, 0.9)' 
                          : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: wishlistItems.has(product._id) 
                            ? 'rgba(255, 215, 0, 1)' 
                            : 'rgba(255, 255, 255, 1)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                        },
                      }}
                    >
                      <Favorite sx={{ 
                        fontSize: { xs: 16, sm: 20 }, 
                        color: wishlistItems.has(product._id) ? '#000' : '#FFD700',
                        fill: wishlistItems.has(product._id) ? '#000' : 'none'
                      }} />
                    </Button> */}

                      {/* Quick View Button - Bottom Right */}
                      <Button
                        sx={{
                          position: "absolute",
                          bottom: { xs: 8, sm: 12 },
                          right: { xs: 8, sm: 12 },
                          minWidth: "auto",
                          width: { xs: 32, sm: 40 },
                          height: { xs: 32, sm: 40 },
                          borderRadius: "50%",
                          background: getRgbaColor(primaryMain, 0.9),
                          backdropFilter: "blur(10px)",
                          "&:hover": {
                            background: primaryMain,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(product);
                        }}
                      >
                        <Visibility
                          sx={{
                            fontSize: { xs: 16, sm: 20 },
                            color: "#fff",
                          }}
                        />
                      </Button>
                    </Box>

                    <CardContent
                      sx={{
                        p: { xs: 2, sm: 2.5, md: 3 },
                        "&:last-child": { pb: { xs: 2, sm: 2.5, md: 3 } },
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          textTransform: "uppercase",
                          fontWeight: 600,
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        }}
                      >
                        {normalizeCsvInput(product.categories ?? "")}
                      </Typography>

                      <Typography
                        variant={isSmallMobile ? "subtitle1" : "h6"}
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: textPrimary,
                          mt: 1,
                          fontSize: { xs: "0.875rem", sm: "1.25rem" },
                          lineHeight: { xs: 1.3, sm: 1.4 },
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mr: 1 }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              sx={{
                                fontSize: { xs: 14, sm: 16 },
                                color:
                                  i <
                                  Math.floor(
                                    product.ratingAverage ||
                                      product.ratingCount ||
                                      0
                                  )
                                    ? "#FFD700"
                                    : "#ddd",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          ({product.ratingCount || 0})
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <Typography
                          variant={isSmallMobile ? "subtitle1" : "h6"}
                          sx={{
                            fontWeight: 700,
                            color: primaryMain,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                          }}
                        >
                          {product.price} {product.currency}
                        </Typography>

                        <Button
                          variant="contained"
                          size={isSmallMobile ? "small" : "small"}
                          startIcon={
                            <ShoppingCart
                              sx={{ fontSize: { xs: 16, sm: 18 } }}
                            />
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id);
                          }}
                          disabled={
                            loadingStates[`cart-${product._id}`] ||
                            isInCart(product._id)
                          }
                          sx={{
                            background: isInCart(product._id)
                              ? successMain
                              : appGradients.primary(theme),
                            color: isInCart(product._id)
                              ? white
                              : theme.palette.primary.contrastText,
                            fontWeight: 600,
                            borderRadius: 2,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 0.5, sm: 0.75 },
                            "&:hover": {
                              background: isInCart(product._id)
                                ? successMain
                                : appGradients.primary(theme),
                            },
                            "&:disabled": {
                              opacity: 0.6,
                            },
                          }}
                        >
                          {loadingStates[`cart-${product._id}`]
                            ? "Adding..."
                            : isInCart(product._id)
                            ? "In Cart"
                            : isSmallMobile
                            ? "Add"
                            : "Add to Cart"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        )}

        {isHomePage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center", mt: { xs: 4, sm: 5, md: 6 } }}>
              <Button
                variant="outlined"
                size={isSmallMobile ? "medium" : "large"}
                href="/products"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1.1rem" },
                  borderRadius: 3,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                    background: getRgbaColor(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                View All Products
              </Button>
            </Box>
          </motion.div>
        )}
      </Container>

      {/* Product Quick View Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="product-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "98%", sm: "95%", md: "90%", lg: "85%" },
            maxWidth: 1000,
            maxHeight: { xs: "98vh", sm: "95vh", md: "90vh" },
            bgcolor: "background.paper",
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: `0 25px 50px -12px ${getRgbaColor(black, 0.25)}`,
            overflow: "auto",
            outline: "none",
            border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: errorMain,
              color: white,
              width: 40,
              height: 40,
              boxShadow: `0 4px 12px ${getRgbaColor(errorMain, 0.3)}`,
              "&:hover": {
                bgcolor: errorMain,
                transform: "scale(1.05)",
                boxShadow: `0 6px 16px ${getRgbaColor(errorMain, 0.4)}`,
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>

          {selectedProduct && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Product Images */}
              <Box
                sx={{
                  flex: { xs: "none", md: "0 0 50%" },
                  position: "relative",
                  height: { xs: 300, sm: 350, md: "auto" },
                  minHeight: { xs: 300, sm: 350, md: 500 },
                  maxHeight: { xs: 350, sm: 400, md: "70vh" },
                  background: appGradients.background(),
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Main Image Container */}
                <Box
                  sx={{
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      selectedProduct.images?.[selectedImageIndex]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={selectedProduct.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
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
                    {selectedProduct.createdAt &&
                      new Date(selectedProduct.createdAt) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            background: secondaryMain,
                            color: black,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            height: 28,
                            boxShadow: `0 2px 8px ${getRgbaColor(secondaryMain, 0.3)}`,
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      )}
                    {selectedProduct.ratingCount &&
                      selectedProduct.ratingCount >= 5 && (
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{
                            background: primaryMain,
                            color: white,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            height: 28,
                            boxShadow: `0 2px 8px ${getRgbaColor(primaryMain, 0.3)}`,
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      )}
                  </Box>
                </Box>

                {/* Image Gallery */}
                {selectedProduct.images &&
                  selectedProduct.images.length > 1 && (
                    <Box
                      sx={{
                        p: 3,
                        background: getRgbaColor(backgroundPaper, 0.95),
                        backdropFilter: "blur(10px)",
                        borderTop: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
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
                        All Images ({selectedProduct.images.length})
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          overflowX: "auto",
                          pb: 1,
                          "&::-webkit-scrollbar": {
                            height: 6,
                          },
                          "&::-webkit-scrollbar-track": {
                            background: getRgbaColor(black, 0.1),
                            borderRadius: 3,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: getRgbaColor(primaryMain, 0.6),
                            borderRadius: 3,
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            background: getRgbaColor(primaryMain, 0.8),
                          },
                        }}
                      >
                        {selectedProduct.images.map((image, index) => (
                          <Box
                            key={index}
                            onClick={() => handleImageSelect(index)}
                            sx={{
                              flex: "0 0 auto",
                              width: 90,
                              height: 90,
                              cursor: "pointer",
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
                                  : `0 2px 8px ${getRgbaColor(black, 0.1)}`,
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
                              alt={`${selectedProduct.name} - Image ${
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

              {/* Product Details */}
              <Box
                sx={{
                  flex: { xs: "none", md: "0 0 50%" },
                  display: "flex",
                  flexDirection: "column",
                  background: appGradients.background(),
                  overflow: "auto",
                  maxHeight: { xs: "50vh", sm: "60vh", md: "80vh" },
                  minHeight: { xs: 300, sm: 400, md: 500 },
                }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                  }}
                >
                  {/* Categories */}
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
                    {normalizeCsvInput(selectedProduct.categories ?? "")}
                  </Typography>

                  {/* Product Name */}
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
                    {selectedProduct.name}
                  </Typography>

                  {/* Rating */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      p: 2,
                      background: getRgbaColor(primaryMain, 0.1),
                      borderRadius: 2,
                      border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
                    }}
                  >
                    <Rating
                      value={
                        selectedProduct.ratingAverage ||
                        selectedProduct.ratingCount ||
                        0
                      }
                      readOnly
                      sx={{
                        mr: 2,
                        "& .MuiRating-iconFilled": {
                          color: "#FFD700",
                        },
                        "& .MuiRating-iconEmpty": {
                          color: "#ddd",
                        },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: textPrimary,
                        fontSize: "0.9rem",
                      }}
                    >
                      ({selectedProduct.ratingCount || 0} reviews)
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
                    {selectedProduct.price} {selectedProduct.currency}
                  </Typography>

                  {/* Description */}
                  {selectedProduct.description && (
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
                        sx={{
                          color: textSecondary,
                          lineHeight: 1.6,
                          fontSize: "1rem",
                        }}
                      >
                        {selectedProduct.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Product Details */}
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      background: getRgbaColor(backgroundPaper, 0.8),
                      borderRadius: 2,
                      border: `1px solid ${getRgbaColor(black, 0.05)}`,
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
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {selectedProduct.brand && (
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
                            {selectedProduct.brand}
                          </Typography>
                        </Box>
                      )}
                      {selectedProduct.sku && (
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
                            {selectedProduct.sku}
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
                          {selectedProduct.stock || 0} available
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider
                    sx={{ my: 3, borderColor: getRgbaColor(primaryMain, 0.3) }}
                  />

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                      mt: "auto",
                      pt: 2,
                      position: "sticky",
                      bottom: 0,
                      background: appGradients.background(),
                      zIndex: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={() => addToCart(selectedProduct._id)}
                      disabled={
                        loadingStates[`cart-${selectedProduct._id}`] ||
                        isInCart(selectedProduct._id)
                      }
                      sx={{
                        background: isInCart(selectedProduct._id)
                          ? successMain
                          : appGradients.primary(theme),
                        color: isInCart(selectedProduct._id)
                          ? white
                          : theme.palette.primary.contrastText,
                        fontWeight: 700,
                        borderRadius: 3,
                        px: 4,
                        py: 2,
                        fontSize: "1rem",
                        textTransform: "none",
                        boxShadow: isInCart(selectedProduct._id)
                          ? `0 4px 12px ${getRgbaColor(successMain, 0.3)}`
                          : `0 4px 12px ${getRgbaColor(primaryMain, 0.3)}`,
                        "&:hover": {
                          background: isInCart(selectedProduct._id)
                            ? successMain
                            : appGradients.primary(theme),
                          transform: "translateY(-2px)",
                          boxShadow: isInCart(selectedProduct._id)
                            ? `0 6px 16px ${getRgbaColor(successMain, 0.4)}`
                            : `0 6px 16px ${getRgbaColor(primaryMain, 0.4)}`,
                        },
                        "&:disabled": {
                          opacity: 0.6,
                          transform: "none",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loadingStates[`cart-${selectedProduct._id}`]
                        ? "Adding..."
                        : isInCart(selectedProduct._id)
                        ? "In Cart"
                        : "Add to Cart"}
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Favorite />}
                      onClick={() => {
                        if (wishlistItems.has(selectedProduct._id)) {
                          removeFromWishlist(selectedProduct._id);
                        } else {
                          addToWishlist(selectedProduct._id);
                        }
                      }}
                      disabled={
                        loadingStates[`wishlist-${selectedProduct._id}`]
                      }
                      sx={{
                        borderColor: wishlistItems.has(selectedProduct._id)
                          ? primaryMain
                          : primaryDark,
                        color: wishlistItems.has(selectedProduct._id)
                          ? primaryMain
                          : primaryDark,
                        background: wishlistItems.has(selectedProduct._id)
                          ? getRgbaColor(primaryMain, 0.1)
                          : getRgbaColor(primaryMain, 0.05),
                        fontWeight: 700,
                        borderRadius: 3,
                        px: 4,
                        py: 2,
                        fontSize: "1rem",
                        textTransform: "none",
                        borderWidth: 2,
                        "&:hover": {
                          borderColor: primaryMain,
                          color: primaryMain,
                          background: getRgbaColor(primaryMain, 0.15),
                          transform: "translateY(-2px)",
                          boxShadow: `0 6px 16px ${getRgbaColor(primaryMain, 0.2)}`,
                        },
                        "&:disabled": {
                          opacity: 0.6,
                          transform: "none",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loadingStates[`wishlist-${selectedProduct._id}`]
                        ? "Updating..."
                        : wishlistItems.has(selectedProduct._id)
                        ? "In Wishlist"
                        : "Add to Wishlist"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Cart Confirmation Modal */}
      <Modal
        open={showCartConfirmation}
        onClose={cancelAddToCart}
        aria-labelledby="cart-confirmation-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "95%", sm: "90%", md: "500px" },
            maxWidth: 500,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            outline: "none",
            border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
            p: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: primaryMain,
                  mb: 2,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Add to Cart?
              </Typography>

              {pendingCartProduct && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    p: 2,
                    background: getRgbaColor(primaryMain, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
                  }}
                >
                  <Box
                    component="img"
                    src={
                      pendingCartProduct.images?.[0]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={pendingCartProduct.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ textAlign: "left", flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: textPrimary,
                        fontSize: "1rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {pendingCartProduct.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: primaryMain,
                        fontSize: "1.1rem",
                      }}
                    >
                      {pendingCartProduct.price} {pendingCartProduct.currency}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 3,
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Are you sure you want to add this item to your cart?
              </Typography>

              {/* Don't show again checkbox */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2,
                p: 2,
                background: getRgbaColor(primaryMain, 0.05),
                borderRadius: 2,
                border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      sx={{
                        color: primaryMain,
                        '&.Mui-checked': {
                          color: primaryMain,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: textSecondary,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Don&apos;t show this confirmation again
                    </Typography>
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="outlined"
                size="large"
                onClick={cancelAddToCart}
                sx={{
                  borderColor: primaryMain,
                  color: primaryMain,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 3,
                  "&:hover": {
                    borderColor: primaryDark,
                    color: primaryDark,
                    background: getRgbaColor(primaryMain, 0.05),
                  },
                }}
              >
                Cancel
              </Button>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    // If user checked "Don't show again", save the preference
                    if (dontShowAgain) {
                      markCartConfirmationAsSeen();
                    }
                    confirmAddToCart(pendingCartProduct?._id || "");
                  }}
                  disabled={loadingStates[`cart-${pendingCartProduct?._id}`]}
                  sx={{
                    background: appGradients.primary(theme),
                    color: theme.palette.primary.contrastText,
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: 3,
                    boxShadow: `0 4px 12px ${getRgbaColor(primaryMain, 0.3)}`,
                    "&:hover": {
                      background: appGradients.primary(theme),
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 16px ${getRgbaColor(primaryMain, 0.4)}`,
                    },
                    "&:disabled": {
                      opacity: 0.6,
                      transform: "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loadingStates[`cart-${pendingCartProduct?._id}`]
                    ? "Adding..."
                    : "Yes, Add to Cart"}
                </Button>
            </Box>
          </motion.div>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductsSection;
