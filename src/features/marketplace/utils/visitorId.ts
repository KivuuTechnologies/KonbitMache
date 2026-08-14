'use client';

/**
 * Anonymous visitor identification for interest tracking
 *
 * Generates a persistent UUID stored in localStorage to identify returning
 * visitors without requiring authentication or collecting personal data
 *
 * - No IP addresses
 * - No cookies sent to server automatically
 * - Works across normal browser sessions
 * - Fails gracefully if localStorage is unavailable
 */

const VISITOR_ID_KEY = 'konbit_mache_visitor_id';

/**
 * Generates a random UUID (v4)
 * Uses crypto.randomUUID() when available (modern browsers)
 * Falls back to a simple implementation for older environments
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Checks if localStorage is available and functional.
 * Some browsers disable it in private mode or when cookies are blocked
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the existing visitor ID from localStorage, or creates a new one
 *
 * @returns The visitor UUID string, or null if localStorage is unavailable.
 *          The caller should handle null gracefully (tracking becomes best-effort).
 */
export function getOrCreateVisitorId(): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    let visitorId = window.localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateUUID();
      window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    // localStorage threw unexpectedly (quota exceeded, corrupted, etc.)
    return null;
  }
}

/**
 * Clears the stored visitor ID
 * Useful for testing or if the user wants to reset their identity
 */
export function clearVisitorId(): void {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(VISITOR_ID_KEY);
    } catch {
      // Ignore errors
    }
  }
}