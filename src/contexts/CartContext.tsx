"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getSessionId,
  setSessionId,
  getOrCreateSessionId,
} from "@/utils/session";

export interface CartItem {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    price: number;
    currency: string;
    images: Array<{ url: string; alt: string; isPrimary?: boolean }>;
    stock: number;
    brand?: string;
    categories?: string;
  };
  quantity: number;
  notes?: string;
  addedAt: string;
  updatedAt: string;
}

// Database response interfaces
interface DatabaseCartItem {
  _id: string;
  product:
    | string
    | {
        _id: string;
        name: string;
        brand?: string;
        price: number;
        stock: number;
        images: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
        isActive: boolean;
        isPublished: boolean;
        currency?: string;
        categories?: string;
      };
  variant?: string;
  quantity: number;
  price: number;
  notes?: string;
  addedAt: string;
}

interface DatabaseCartResponse {
  _id: string;
  user: string;
  isActive: boolean;
  discountAmount: number;
  items: DatabaseCartItem[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiCartResponse {
  success: boolean;
  data: DatabaseCartResponse;
  message: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary | null;
  loading: boolean;
  error: string | null;
  addToCart: (
    productId: string,
    quantity?: number,
    notes?: string,
  ) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { token, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`;
  const productsApiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;

  // Get user ID from multiple sources
  const getUserId = (): string | null => {
    let userId: string | null = user?.id || null;

    if (!userId && token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        userId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
      } catch (error) {
        console.error("Failed to extract user ID from token:", error);
      }
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
      } catch (error) {
        console.error("Failed to get user from storage:", error);
      }
    }

    return userId;
  };

  // Fetch product details for cart items
  const fetchProductDetails = React.useCallback(
    async (productId: string) => {
      try {
        const response = await fetch(`${productsApiBase}/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const productData = await response.json();
          return productData.data || productData;
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
      return null;
    },
    [token],
  );

  // Transform database cart response to frontend format
  const transformCartData = React.useCallback(
    async (dbCart: DatabaseCartResponse): Promise<CartItem[]> => {
      const transformedItems: CartItem[] = [];

      // Check if items exist and is an array
      if (!dbCart.items || !Array.isArray(dbCart.items)) {
        return transformedItems;
      }

      for (const item of dbCart.items) {
        // Handle both ObjectId string and full product object
        if (item.product) {
          if (typeof item.product === "string") {
            // Product is just an ObjectId, we need to fetch the product details
            const productDetails = await fetchProductDetails(item.product);

            if (productDetails) {
              transformedItems.push({
                _id: item._id,
                productId: item.product,
                product: {
                  _id: productDetails._id,
                  name: productDetails.name || "Unknown Product",
                  price: item.price, // Use price from cart item
                  currency: productDetails.currency || "USD",
                  images: (productDetails.images || []).map(
                    (img: {
                      url: string;
                      alt: string;
                      isPrimary: boolean;
                    }) => ({
                      url: img.url,
                      alt: img.alt || "",
                      isPrimary: img.isPrimary,
                    }),
                  ),
                  stock: productDetails.stock || 0,
                  brand: productDetails.brand,
                  categories: productDetails.categories,
                },
                quantity: item.quantity,
                notes: item.notes || "",
                addedAt: item.addedAt,
                updatedAt: item.addedAt,
              });
            } else {
            }
          } else {
            // Product is a full object
            transformedItems.push({
              _id: item._id,
              productId: item.product._id,
              product: {
                _id: item.product._id,
                name: item.product.name || "Unknown Product",
                price: item.price, // Use price from cart item
                currency: item.product.currency || "USD",
                images: (item.product.images || []).map((img) => ({
                  url: img.url,
                  alt: img.alt || "",
                  isPrimary: img.isPrimary,
                })),
                stock: item.product.stock || 0,
                brand: item.product.brand,
                categories: item.product.categories,
              },
              quantity: item.quantity,
              notes: item.notes || "",
              addedAt: item.addedAt,
              updatedAt: item.addedAt,
            });
          }
        } else {
        }
      }

      return transformedItems;
    },
    [fetchProductDetails],
  );

  const fetchCart = React.useCallback(async (): Promise<void> => {
    // Support both authenticated and anonymous users
    const sessionId = getSessionId();
    if (!token && !sessionId) {
      // No authentication and no session - initialize session for anonymous user
      getOrCreateSessionId();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build headers based on authentication status
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (sessionId) {
        headers["X-Session-Id"] = sessionId;
      }

      const response = await fetch(`${apiBase}`, { headers });

      if (response.ok) {
        const apiResponse: ApiCartResponse & { sessionId?: string } =
          await response.json();

        // Store sessionId if returned (for anonymous users)
        if (apiResponse.sessionId) {
          setSessionId(apiResponse.sessionId);
        }

        // Extract the actual cart data from the API response
        const cartData = apiResponse.data;

        // Check if cart has items
        if (!cartData.items || cartData.items.length === 0) {
          setCartItems([]);
          setCartSummary(null);
          return;
        }

        // Transform the database response to frontend format
        const transformedItems = await transformCartData(cartData);

        setCartItems(transformedItems);

        // Calculate summary from transformed items
        const totalItems = transformedItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const subtotal = transformedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
        const tax = subtotal * 0.1; // 10% tax
        const shipping = 0; // Free shipping
        const discount = cartData.discountAmount || 0;
        const total = subtotal + tax + shipping - discount;

        setCartSummary({
          totalItems,
          subtotal,
          tax,
          shipping,
          discount,
          total,
          currency: transformedItems[0]?.product.currency || "USD",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch cart");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch cart";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token, transformCartData, apiBase]);

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    notes: string = "",
  ): Promise<void> => {
    // Support both authenticated and anonymous users
    const sessionId = token ? null : getOrCreateSessionId();

    try {
      setLoading(true);
      setError(null);

      // Build headers based on authentication status
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (sessionId) {
        headers["X-Session-Id"] = sessionId;
      }

      // Build request body
      const body: Record<string, unknown> = {
        productId,
        quantity,
        notes,
      };

      // Include sessionId in body for anonymous users (as per API docs)
      if (!token && sessionId) {
        body.sessionId = sessionId;
      }

      // Include userId for authenticated users
      if (token) {
        const userId = getUserId();
        if (userId) {
          body.userId = userId;
        }
      }

      const response = await fetch(`${apiBase}/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const apiResponse: { sessionId?: string } = await response.json();

        // Store sessionId if returned (for anonymous users)
        if (apiResponse.sessionId) {
          setSessionId(apiResponse.sessionId);
        }

        await fetchCart(); // Refresh cart data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add item to cart";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (
    itemId: string,
    quantity: number,
  ): Promise<void> => {
    const sessionId = getSessionId();
    if (!token && !sessionId) {
      throw new Error("No authentication or session available");
    }

    try {
      setLoading(true);
      setError(null);

      // Build headers based on authentication status
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (sessionId) {
        headers["X-Session-Id"] = sessionId;
      }

      const response = await fetch(`${apiBase}/items/${itemId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        const apiResponse: { sessionId?: string } = await response.json();

        // Store sessionId if returned (for anonymous users)
        if (apiResponse.sessionId) {
          setSessionId(apiResponse.sessionId);
        }

        await fetchCart(); // Refresh cart data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart item");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update cart item";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
    const sessionId = getSessionId();
    if (!token && !sessionId) {
      throw new Error("No authentication or session available");
    }

    try {
      setLoading(true);
      setError(null);

      // Build headers based on authentication status
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (sessionId) {
        headers["X-Session-Id"] = sessionId;
      }

      const response = await fetch(`${apiBase}/items/${itemId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        const apiResponse: { sessionId?: string } = await response.json();

        // Store sessionId if returned (for anonymous users)
        if (apiResponse.sessionId) {
          setSessionId(apiResponse.sessionId);
        }

        await fetchCart(); // Refresh cart data
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));

        // Try alternative endpoint format if the first one fails
        if (response.status === 404) {
          const altHeaders = { ...headers };
          const altResponse = await fetch(`${apiBase}/remove/${itemId}`, {
            method: "DELETE",
            headers: altHeaders,
          });

          if (altResponse.ok) {
            const altApiResponse: { sessionId?: string } =
              await altResponse.json();
            if (altApiResponse.sessionId) {
              setSessionId(altApiResponse.sessionId);
            }
            await fetchCart();
            return;
          }
        }

        throw new Error(errorData.message || "Failed to remove item from cart");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to remove item from cart";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    const sessionId = getSessionId();
    if (!token && !sessionId) return;

    try {
      setLoading(true);
      setError(null);

      // Build headers based on authentication status
      const headers: HeadersInit = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (sessionId) {
        headers["X-Session-Id"] = sessionId;
      }

      const response = await fetch(`${apiBase}/clear`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        const apiResponse: { sessionId?: string } = await response.json();

        // Store sessionId if returned (for anonymous users)
        if (apiResponse.sessionId) {
          setSessionId(apiResponse.sessionId);
        }

        setCartItems([]);
        setCartSummary(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear cart");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to clear cart";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async (): Promise<void> => {
    await fetchCart();
  };

  const isInCart = (productId: string): boolean => {
    return cartItems.some((item) => item.productId === productId);
  };

  // Fetch cart for both authenticated and anonymous users
  useEffect(() => {
    const sessionId = getSessionId();
    if (token && user) {
      fetchCart();
    } else if (sessionId) {
      fetchCart();
    } else {
      // Initialize session for anonymous user
      getOrCreateSessionId();
      // Fetch cart after initializing session
      fetchCart();
    }
  }, [token, user, fetchCart]);

  const value: CartContextType = {
    cartItems,
    cartSummary,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
