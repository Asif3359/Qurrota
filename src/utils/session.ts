// Session management for anonymous users
// Based on API documentation: uses UUID for sessionId

/**
 * Get the current sessionId from localStorage
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sessionId');
}

/**
 * Set a new sessionId in localStorage
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sessionId', sessionId);
}

/**
 * Generate a new UUID sessionId
 */
export function generateSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: This shouldn't be called server-side, but just in case
    return '';
  }
  // Client-side: use browser crypto API
  return crypto.randomUUID();
}

/**
 * Get existing sessionId or create a new one
 */
export function getOrCreateSessionId(): string {
  let sessionId = getSessionId();
  if (!sessionId) {
    sessionId = generateSessionId();
    setSessionId(sessionId);
  }
  return sessionId;
}

/**
 * Clear sessionId from localStorage
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sessionId');
}

/**
 * Transfer anonymous cart to authenticated user
 * This should be called after login to merge carts
 */
export function prepareSessionTransfer(): string | null {
  const sessionId = getSessionId();
  if (sessionId) {
    // Store temporarily for cart migration
    localStorage.setItem('pendingSessionTransfer', sessionId);
  }
  return sessionId;
}

/**
 * Complete session transfer after login
 */
export function completeSessionTransfer(): void {
  localStorage.removeItem('pendingSessionTransfer');
  clearSessionId();
}

