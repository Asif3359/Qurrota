# Anonymous User Implementation Guide

## ✅ Completed Changes

### 1. **Session Management Utility** (`/src/utils/session.ts`)
Created a comprehensive session management utility that handles:
- `getSessionId()` - Get current sessionId from localStorage
- `setSessionId()` - Store sessionId in localStorage
- `generateSessionId()` - Generate UUID using browser crypto API
- `getOrCreateSessionId()` - Get existing or create new sessionId
- `clearSessionId()` - Clear sessionId (useful after login)
- `prepareSessionTransfer()` - Prepare for cart migration when user logs in
- `completeSessionTransfer()` - Complete cart migration after login

### 2. **CartContext Updates** (`/src/contexts/CartContext.tsx`)
Updated ALL cart operations to support both authenticated and anonymous users:

#### Changes Made:
- **Import session utilities** - Added session management imports
- **fetchCart()** - Now works with either `Authorization` header OR `X-Session-Id` header
- **addToCart()** - Supports both authenticated and anonymous users
  - Automatically creates sessionId for anonymous users
  - Includes sessionId in both header and body for anonymous requests
  - Stores returned sessionId from API
- **updateCartItem()** - Works with session or token
- **removeFromCart()** - Works with session or token
- **clearCart()** - Works with session or token
- **useEffect hook** - Now fetches cart for anonymous users too
  - Initializes sessionId if not present
  - Fetches cart for both authenticated and anonymous users

### 3. **ProductsSection Updates** (`/src/components/sections/ProductsSection.tsx`)
- **Removed login requirement** for "Add to Cart" button
- Now anonymous users can add items to cart without logging in
- Cart will persist using sessionId

---

## 📋 What You Need to Do Next

### Step 1: Move Cart & Orders Pages Out of Dashboard

The cart and orders pages are currently inside `/dashboard/user/` which requires authentication. They should be moved to be publicly accessible.

#### Current Structure:
```
/app/dashboard/user/cart/page.tsx
/app/dashboard/user/orders/page.tsx
```

#### Recommended New Structure:
```
/app/cart/page.tsx
/app/orders/page.tsx
```

### Step 2: Update Cart Page for Anonymous Users

The current cart page at `/dashboard/user/cart/page.tsx` uses `useCart()` which is now updated to support anonymous users. However, you should:

1. **Move the page** to `/app/cart/page.tsx`
2. **Remove authentication checks** - Let the page work for everyone
3. **Add "Continue as Guest" or "Login" prompts** during checkout

Example structure:
```typescript
// /app/cart/page.tsx
'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { cartItems, loading } = useCart(); // Works for both auth and anon users
  const { token, user } = useAuth();
  
  return (
    <Container>
      {/* Show cart items */}
      {/* For checkout, show: */}
      {!token && (
        <Alert severity="info">
          You're shopping as a guest. You can checkout without an account,
          or <Link href="/login">login</Link> for faster checkout next time.
        </Alert>
      )}
      {/* Checkout button works for both */}
    </Container>
  );
}
```

### Step 3: Update Orders Page for Anonymous Users

Create a new public orders page at `/app/orders/page.tsx` that:

1. Shows orders for authenticated users (using token)
2. Shows orders for anonymous users (using sessionId)
3. Has an "Order Tracking" feature for anonymous users

Example:
```typescript
// /app/orders/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getSessionId } from '@/utils/session';

export default function OrdersPage() {
  const { token } = useAuth();
  const sessionId = getSessionId();
  
  // Fetch orders using either token or sessionId
  const fetchOrders = async () => {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (sessionId) {
      headers['X-Session-Id'] = sessionId;
    }
    
    const response = await fetch('/api/orders', { headers });
    return await response.json();
  };
  
  return (
    // Display orders
  );
}
```

### Step 4: Update Header/Navigation

Update your Header component to show cart icon for everyone (not just authenticated users):

```typescript
// Current (requires auth):
{token && <Link href="/dashboard/user/cart">Cart ({cartItemCount})</Link>}

// New (works for everyone):
<Link href="/cart">Cart ({cartItemCount})</Link>
```

### Step 5: Create Checkout Flow for Anonymous Users

Based on your API documentation, anonymous users can create orders. Create a checkout page that:

1. Collects shipping address (with email for anonymous users)
2. Processes payment
3. Creates order using API
4. Shows order confirmation with tracking info

Example checkout for anonymous users:
```typescript
const createOrder = async (orderData) => {
  const sessionId = getSessionId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (sessionId) {
    headers['X-Session-Id'] = sessionId;
    // Include sessionId in body for anonymous orders
    orderData.sessionId = sessionId;
  }
  
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData)
  });
  
  return await response.json();
};
```

---

## 🔄 Cart Migration on Login

When an anonymous user logs in, you should merge their cart with their authenticated account:

### Implementation:

1. **Before Login** - Store current sessionId:
```typescript
// In your login page, before submitting login
import { prepareSessionTransfer } from '@/utils/session';

const handleLogin = async () => {
  const anonymousSessionId = prepareSessionTransfer();
  
  // Perform login...
  const loginResponse = await loginUser(email, password);
  
  // If login successful and had anonymous cart
  if (loginResponse.success && anonymousSessionId) {
    // Call backend to merge carts
    await fetch('/api/cart/merge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginResponse.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ anonymousSessionId })
    });
    
    // Complete transfer (clears old sessionId)
    completeSessionTransfer();
  }
};
```

2. **Backend Cart Merge** (you need to implement this):
```javascript
// Backend: /api/cart/merge
exports.mergeAnonymousCart = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { anonymousSessionId } = req.body;
  
  // Find anonymous cart
  const anonymousCart = await Cart.findOne({ 
    sessionId: anonymousSessionId,
    isActive: true 
  });
  
  // Find user cart
  const userCart = await Cart.findOne({ 
    user: userId,
    isActive: true 
  });
  
  if (anonymousCart && anonymousCart.items.length > 0) {
    if (userCart) {
      // Merge items
      for (const item of anonymousCart.items) {
        const existing = userCart.items.find(
          i => i.product.toString() === item.product.toString()
        );
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          userCart.items.push(item);
        }
      }
      await userCart.save();
    } else {
      // Convert anonymous cart to user cart
      anonymousCart.user = userId;
      anonymousCart.sessionId = null;
      await anonymousCart.save();
    }
    
    // Deactivate anonymous cart
    anonymousCart.isActive = false;
    await anonymousCart.save();
  }
  
  return res.json({ success: true, message: 'Cart merged successfully' });
};
```

---

## 📝 API Endpoints Summary (Already Implemented in Backend)

According to your `apidoc.md`, these endpoints already support anonymous users:

### Cart Endpoints (all support sessionId):
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item
- `PUT /api/cart/items/:itemId` - Update quantity
- `DELETE /api/cart/items/:itemId` - Remove item
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/cart/check` - Check if product in cart
- `POST /api/cart/coupon/apply` - Apply coupon
- `DELETE /api/cart/coupon` - Remove coupon
- `PUT /api/cart/shipping-address` - Update shipping
- `PUT /api/cart/billing-address` - Update billing
- `GET /api/cart/summary` - Get cart summary

### Order Endpoints (all support sessionId):
- `POST /api/orders` - Create order (anonymous or authenticated)
- `GET /api/orders` - Get user orders (requires sessionId or token)
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders/number/:orderNumber` - Track order (public, no auth required)
- `PUT /api/orders/:orderId/cancel` - Cancel order
- `GET /api/orders/summary` - Get order summary

---

## ✅ Testing Checklist

### Anonymous User Flow:
- [ ] Open site in incognito mode
- [ ] Browse products
- [ ] Add products to cart (should work without login)
- [ ] View cart page (should show items)
- [ ] Proceed to checkout
- [ ] Enter shipping address with email
- [ ] Complete order
- [ ] Receive order confirmation with order number
- [ ] Track order using order number

### Authenticated User Flow:
- [ ] Login as existing user
- [ ] Add products to cart
- [ ] View cart
- [ ] Complete checkout
- [ ] View orders in orders page

### Cart Migration Flow:
- [ ] Add items to cart as anonymous user
- [ ] Login to existing account
- [ ] Verify cart items are still there (merged)

---

## 🚀 Benefits of This Implementation

1. **Better UX** - Users can shop without creating account
2. **Higher Conversion** - Reduced friction in checkout process
3. **Cart Persistence** - Anonymous carts saved in backend (30 days)
4. **Seamless Migration** - Cart transfers when user logs in
5. **Order Tracking** - Anonymous users can track orders with order number
6. **SEO Friendly** - Cart and order pages are publicly accessible

---

## 📖 Key Code Patterns

### Making API Requests (with session or token):
```typescript
import { getSessionId, setSessionId } from '@/utils/session';

const makeApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const sessionId = getSessionId();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (sessionId) {
    headers['X-Session-Id'] = sessionId;
  }
  
  const response = await fetch(endpoint, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  // Store sessionId if returned (for anonymous users)
  if (data.sessionId) {
    setSessionId(data.sessionId);
  }
  
  return data;
};
```

### Checking User Status:
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { getSessionId } from '@/utils/session';

const { token, user } = useAuth();
const sessionId = getSessionId();

// User is authenticated
if (token && user) {
  // Show authenticated UI
}

// User is anonymous
if (!token && sessionId) {
  // Show anonymous UI (prompt to login)
}

// New visitor (no session yet)
if (!token && !sessionId) {
  // Session will be created automatically when they interact
}
```

---

## 🔧 Files Modified

1. ✅ `/src/utils/session.ts` - Created new utility
2. ✅ `/src/contexts/CartContext.tsx` - Updated for anonymous users
3. ✅ `/src/components/sections/ProductsSection.tsx` - Removed login requirement

## 📁 Files You Need to Create/Move

1. ⏳ `/src/app/cart/page.tsx` - Public cart page
2. ⏳ `/src/app/orders/page.tsx` - Public orders page
3. ⏳ `/src/app/checkout/page.tsx` - Checkout page (optional)
4. ⏳ Backend: `/api/cart/merge` endpoint - For cart migration

---

## 💡 Additional Recommendations

1. **Add "Guest Checkout" Button** - Make it prominent
2. **Show Benefits of Creating Account** - Faster checkout, order history, etc.
3. **Send Order Confirmation Email** - Even for anonymous users
4. **Add Order Tracking Page** - Public page where users can enter order number
5. **Implement Cart Expiration Warning** - Remind users carts expire in 30 days
6. **Analytics** - Track conversion rate improvement

---

## 🎉 You're Almost Done!

The heavy lifting is complete! Your cart system now fully supports anonymous users. Just need to:

1. Move cart and orders pages out of dashboard
2. Update navigation links
3. Test the flow end-to-end
4. Implement cart migration on login (optional but recommended)

Let me know if you need help with any of these remaining tasks!

