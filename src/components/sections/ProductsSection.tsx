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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Favorite,
  Star,
  Close,
  Visibility,
  ArrowRight,
  ShoppingBag,
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
import SectionHeaders from "../Headers/SectionHeaders";
import OutLineButton from "../buttons/OutLineButton";

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
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [showCartConfirmation, setShowCartConfirmation] = React.useState(false);
  const [pendingCartProduct, setPendingCartProduct] =
    React.useState<Product | null>(null);
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [sortBy, setSortBy] = React.useState<string>("newest");
  const productsPerPage = 12;

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

  const getProducts = React.useCallback(async (page: number = 1, limit: number = 12, sort: string = "newest"): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with pagination and sort params
      // Home page: always page 1, limit 12, but respects sort
      // Products page: uses all params
      const actualPage = isHomePage ? 1 : page;
      const actualLimit = isHomePage ? 12 : limit;
      
      const url = `${apiBase}?page=${actualPage}&limit=${actualLimit}&sort=${sort}`;
      
      console.log('🔗 Fetching URL:', url);
      
      const response = await fetch(url, { 
        cache: "no-cache",
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Response error:', errorData);
        throw new Error(`Failed to load products: ${response.status}`);
      }
      
      const data = await response.json();
      
      setProducts(data.data ?? []);
      setTotalProducts(data.total ?? 0);
      
      console.log('📦 Products loaded:', {
        page: actualPage,
        limit: actualLimit,
        sort,
        received: data.data?.length,
        total: data.total
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      console.error('❌ Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  }, [apiBase, isHomePage]);

  // Fetch products on mount and when page or sort changes
  React.useEffect(() => {
    getProducts(currentPage, productsPerPage, sortBy);
  }, [getProducts, currentPage, sortBy]);

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

  // Calculate total pages from backend total
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top of products section smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort change
  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <Box
      sx={{
        pt: 6,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <SectionHeaders
            title={isHomePage ? "Trending Products" : "All Products"}
            description="Discover our carefully curated collection of premium products for kids and new mothers"
          />
          
            {/* Sort Controls - Show on both home and products page */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: isHomePage ? "flex-end" : "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              {/* Products count - Only on products page */}
              {!isHomePage && !loading && totalProducts > 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Showing {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                </Typography>
              )}

              {/* Sort Dropdown - Show on both pages */}
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 200 },
                }}
              >
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSortChange}
                  sx={{
                    background: theme.palette.background.paper,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: getRgbaColor(primaryMain, 0.3),
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryMain,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryMain,
                    },
                  }}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                  <MenuItem value="name-desc">Name: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </motion.div>
        {loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 2, md: 3 },
            }}
          >
            {Array.from({ length: isHomePage ? 12 : 8 }).map((_, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  height: "100%",
                  background: getRgbaColor(backgroundPaper, 0.9),
                  border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: "hidden",
                }}
              >
                {/* Image Skeleton */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={isSmallMobile ? 180 : isMobile ? 200 : 250}
                  sx={{
                    bgcolor: getRgbaColor(primaryMain, 0.1),
                  }}
                />

                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    "&:last-child": { pb: { xs: 2, sm: 2.5, md: 3 } },
                  }}
                >
                  {/* Title Skeleton */}
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={isSmallMobile ? 24 : 32}
                    sx={{
                      mb: 1,
                      bgcolor: getRgbaColor(primaryMain, 0.1),
                    }}
                  />

                  {/* Description Skeleton */}
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={16}
                    sx={{
                      mb: 0.5,
                      bgcolor: getRgbaColor(primaryMain, 0.08),
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={16}
                    sx={{
                      mb: 2,
                      bgcolor: getRgbaColor(primaryMain, 0.08),
                    }}
                  />

                  {/* Rating Skeleton */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={16}
                      sx={{
                        mr: 1,
                        bgcolor: getRgbaColor(primaryMain, 0.1),
                        borderRadius: 1,
                      }}
                    />
                    <Skeleton
                      variant="text"
                      width={40}
                      height={16}
                      sx={{
                        bgcolor: getRgbaColor(primaryMain, 0.08),
                      }}
                    />
                  </Box>

                  {/* Price Skeleton */}
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={isSmallMobile ? 28 : 32}
                    sx={{
                      mb: 1,
                      bgcolor: getRgbaColor(primaryMain, 0.12),
                    }}
                  />

                  {/* Buttons Skeleton */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 0.75, sm: 1, md: 1 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={isSmallMobile ? 32 : 36}
                      sx={{
                        bgcolor: getRgbaColor(primaryMain, 0.1),
                        borderRadius: 2,
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={isSmallMobile ? 32 : 36}
                      sx={{
                        bgcolor: getRgbaColor(primaryMain, 0.1),
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
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
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: { xs: 2, sm: 2, md: 3 },
              }}
            >
              {products.map((product, index) => (
              <Box key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
                        cursor: "pointer",
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
                          height: { xs: "180px", sm: "200px", md: "250px" },
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
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          fontWeight: 400,
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description?.slice(0, 100) + "..."}
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

                      <Box sx={{ mb: 1 }}>
                        <Box>
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
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: { xs: "column", sm: "row" },
                          width: "100%",
                          gap: { xs: 0.75, sm: 1, md: 1 },
                        }}
                      >
                        <Button
                          variant="contained"
                          size={isSmallMobile ? "small" : "medium"}
                          startIcon={
                            <ShoppingCart
                              sx={{ fontSize: { xs: 14, sm: 16 } }}
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
                            width: "100%",
                            background: isInCart(product._id)
                              ? successMain
                              : primaryMain,
                            color: white,
                            fontWeight: 600,
                            borderRadius: 2,
                            fontSize: { xs: "0.7rem", sm: "0.7rem" },
                            px: { xs: 1, sm: 2 },
                            py: { xs: 0.4, sm: 0.75 },
                            minHeight: { xs: 32, sm: 36 },
                            boxShadow: isInCart(product._id)
                              ? `0 2px 8px ${getRgbaColor(successMain, 0.3)}`
                              : `0 2px 8px ${getRgbaColor(primaryMain, 0.3)}`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: isInCart(product._id)
                                ? getRgbaColor(successMain, 0.8)
                                : primaryDark,
                              transform: "translateY(-2px)",
                              boxShadow: isInCart(product._id)
                                ? `0 4px 12px ${getRgbaColor(successMain, 0.4)}`
                                : `0 4px 12px ${getRgbaColor(primaryMain, 0.4)}`,
                            },
                            "&:active": {
                              transform: "translateY(0)",
                              boxShadow: isInCart(product._id)
                                ? `0 1px 4px ${getRgbaColor(successMain, 0.3)}`
                                : `0 1px 4px ${getRgbaColor(primaryMain, 0.3)}`,
                            },
                            "&:disabled": {
                              opacity: 0.6,
                              background: isInCart(product._id)
                                ? successMain
                                : primaryMain,
                              color: white,
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
                        <Button
                          variant="outlined"
                          size={isSmallMobile ? "small" : "medium"}
                          startIcon={
                            <ShoppingBag
                              sx={{ fontSize: { xs: 14, sm: 16 } }}
                            />
                          }
                          sx={{
                            width: "100%",
                            background: "transparent",
                            color: primaryMain,
                            borderColor: primaryMain,
                            fontWeight: 600,
                            borderRadius: 2,
                            fontSize: { xs: "0.7rem", sm: "0.7rem" },
                            px: { xs: 1, sm: 2 },
                            py: { xs: 0.4, sm: 0.75 },
                            minHeight: { xs: 32, sm: 36 },
                            "&:hover": {
                              background: primaryDark,
                              color: white,
                              borderColor: primaryMain,
                              transform: "translateY(-2px)",
                              boxShadow: `0 4px 12px ${getRgbaColor(primaryMain, 0.4)}`,
                            },
                            "&:active": {
                              transform: "translateY(0)",
                              boxShadow: `0 1px 4px ${getRgbaColor(primaryMain, 0.3)}`,
                            },
                            "&:disabled": {
                              opacity: 0.6,
                              background: primaryMain,
                              color: white,
                              borderColor: primaryMain,
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Shop Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
            </Box>

            {/* Pagination for products page */}
            {!isHomePage && totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: 4, md: 6 },
                  mb: { xs: 2, md: 4 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isSmallMobile ? "small" : isMobile ? "medium" : "large"}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 600,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .Mui-selected": {
                      background: appGradients.primary(theme),
                      color: white,
                      "&:hover": {
                        background: appGradients.primary(theme),
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {isHomePage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: "center", mt: { xs: 4, sm: 5, md: 6 } }}>
              <OutLineButton
                onClick={() => router.push("/products")}
              >
                View All Products
              </OutLineButton>
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
                            boxShadow: `0 2px 8px ${getRgbaColor(
                              secondaryMain,
                              0.3
                            )}`,
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
                            boxShadow: `0 2px 8px ${getRgbaColor(
                              primaryMain,
                              0.3
                            )}`,
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
                        borderTop: `1px solid ${getRgbaColor(
                          primaryMain,
                          0.2
                        )}`,
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
                                  : `3px solid ${getRgbaColor(
                                      primaryMain,
                                      0.1
                                    )}`,
                              borderRadius: 2,
                              overflow: "hidden",
                              transition: "all 0.3s ease",
                              boxShadow:
                                selectedImageIndex === index
                                  ? `0 4px 12px ${getRgbaColor(
                                      primaryMain,
                                      0.4
                                    )}`
                                  : `0 2px 8px ${getRgbaColor(black, 0.1)}`,
                              "&:hover": {
                                borderColor: primaryMain,
                                transform: "scale(1.05)",
                                boxShadow: `0 4px 12px ${getRgbaColor(
                                  primaryMain,
                                  0.3
                                )}`,
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
                  {/* <Typography
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
                  </Typography> */}

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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  p: 2,
                  background: getRgbaColor(primaryMain, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${getRgbaColor(primaryMain, 0.2)}`,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      sx={{
                        color: primaryMain,
                        "&.Mui-checked": {
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
                        fontSize: "0.9rem",
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
