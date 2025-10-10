'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  product: string | {
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
  addToCart: (productId: string, quantity?: number, notes?: string) => Promise<void>;
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
    throw new Error('useCart must be used within a CartProvider');
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
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        userId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
      } catch (error) {
        console.error('Failed to extract user ID from token:', error);
      }
    }

    if (!userId) {
      try {
        const storedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.id || parsedUser._id;
        }
      } catch (error) {
        console.error('Failed to get user from storage:', error);
      }
    }

    return userId;
  };

  // Fetch product details for cart items
  const fetchProductDetails = React.useCallback(async (productId: string) => {
    try {
      console.log('Fetching product details for:', productId);
      const response = await fetch(`${productsApiBase}/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Product API response status:', response.status);
      
      if (response.ok) {
        const productData = await response.json();
        console.log('Product data received:', productData);
        return productData.data || productData;
      } else {
        console.error('Product API error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Product API error details:', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    }
    return null;
  }, [token]);

  // Transform database cart response to frontend format
  const transformCartData = React.useCallback(async (dbCart: DatabaseCartResponse): Promise<CartItem[]> => {
    const transformedItems: CartItem[] = [];
    
    // Check if items exist and is an array
    if (!dbCart.items || !Array.isArray(dbCart.items)) {
      console.log('No items found in cart data:', dbCart);
      return transformedItems;
    }
    
    console.log('Processing cart items:', dbCart.items);
    
    for (const item of dbCart.items) {
      console.log('Processing item:', item);
      
      // Handle both ObjectId string and full product object
      if (item.product) {
        if (typeof item.product === 'string') {
          // Product is just an ObjectId, we need to fetch the product details
          console.log('Product is ObjectId, fetching details for:', item.product);
          const productDetails = await fetchProductDetails(item.product);
          
          if (productDetails) {
            transformedItems.push({
              _id: item._id,
              productId: item.product,
              product: {
                _id: productDetails._id,
                name: productDetails.name || 'Unknown Product',
                price: item.price, // Use price from cart item
                currency: productDetails.currency || 'USD',
                images: (productDetails.images || []).map((img: { url: string; alt: string; isPrimary: boolean }) => ({
                  url: img.url,
                  alt: img.alt || '',
                  isPrimary: img.isPrimary
                })),
                stock: productDetails.stock || 0,
                brand: productDetails.brand,
                categories: productDetails.categories
              },
              quantity: item.quantity,
              notes: item.notes || '',
              addedAt: item.addedAt,
              updatedAt: item.addedAt
            });
          } else {
            console.log('Failed to fetch product details for ObjectId:', item.product);
          }
        } else {
          // Product is a full object
          transformedItems.push({
            _id: item._id,
            productId: item.product._id,
            product: {
              _id: item.product._id,
              name: item.product.name || 'Unknown Product',
              price: item.price, // Use price from cart item
              currency: item.product.currency || 'USD',
              images: (item.product.images || []).map(img => ({
                url: img.url,
                alt: img.alt || '',
                isPrimary: img.isPrimary
              })),
              stock: item.product.stock || 0,
              brand: item.product.brand,
              categories: item.product.categories
            },
            quantity: item.quantity,
            notes: item.notes || '',
            addedAt: item.addedAt,
            updatedAt: item.addedAt
          });
        }
      } else {
        console.log('No product data found for item:', item);
      }
    }
    
    console.log('Transformed items result:', transformedItems);
    return transformedItems;
  }, [fetchProductDetails]);

  const fetchCart = React.useCallback(async (): Promise<void> => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBase}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const apiResponse: ApiCartResponse = await response.json();
        console.log('Raw cart data from API:', apiResponse);
        
        // Extract the actual cart data from the API response
        const cartData = apiResponse.data;
        console.log('Extracted cart data:', cartData);
        
        // Check if cart has items
        if (!cartData.items || cartData.items.length === 0) {
          console.log('Cart is empty or has no items');
          setCartItems([]);
          setCartSummary(null);
          return;
        }
        
        // Transform the database response to frontend format
        const transformedItems = await transformCartData(cartData);
        console.log('Transformed cart items:', transformedItems);
        
        setCartItems(transformedItems);
        
        // Calculate summary from transformed items
        const totalItems = transformedItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = transformedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
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
          currency: transformedItems[0]?.product.currency || 'USD'
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch cart');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token, transformCartData]);


  const addToCart = async (productId: string, quantity: number = 1, notes: string = ''): Promise<void> => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    const userId = getUserId();
    if (!userId) {
      throw new Error('User information is missing. Please login again.');
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBase}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity,
          notes,
          userId
        })
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number): Promise<void> => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Updating cart item:', { itemId, quantity });
      console.log('API endpoint:', `${apiBase}/items/${itemId}`);

      const response = await fetch(`${apiBase}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      console.log('Update item response status:', response.status);

      if (response.ok) {
        console.log('Item updated successfully, refreshing cart...');
        await fetchCart(); // Refresh cart data
      } else {
        const errorData = await response.json();
        console.error('Update item API error:', errorData);
        throw new Error(errorData.message || 'Failed to update cart item');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cart item';
      console.error('Update item error:', message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<void> => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Removing cart item:', itemId);
      console.log('API endpoint:', `${apiBase}/items/${itemId}`);
      console.log('Token available:', !!token);

      const response = await fetch(`${apiBase}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Remove item response status:', response.status);

      if (response.ok) {
        console.log('Item removed successfully, refreshing cart...');
        await fetchCart(); // Refresh cart data
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Remove item API error:', errorData);
        
        // Try alternative endpoint format if the first one fails
        if (response.status === 404) {
          console.log('Trying alternative endpoint format...');
          const altResponse = await fetch(`${apiBase}/remove/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (altResponse.ok) {
            console.log('Item removed successfully with alternative endpoint');
            await fetchCart();
            return;
          }
        }
        
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove item from cart';
      console.error('Remove item error:', message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBase}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems([]);
        setCartSummary(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear cart');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
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
    return cartItems.some(item => item.productId === productId);
  };

  // Fetch cart when user logs in
  useEffect(() => {
    console.log('CartContext: useEffect triggered', { token: token ? 'present' : 'missing', user: user?.id });
    if (token && user) {
      console.log('CartContext: Fetching cart for user:', user.id);
      fetchCart();
    } else {
      console.log('CartContext: Clearing cart - no token or user');
      setCartItems([]);
      setCartSummary(null);
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
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
