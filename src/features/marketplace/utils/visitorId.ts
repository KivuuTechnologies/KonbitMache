'use client';

// Anonymous visitor identification for interest tracking
// Generates a persistent UUID stored in localStorage to identify returning
// visitors without requiring authentication or collecting personal data

const VISITOR_ID_KEY = 'konbit_mache_visitor_id';

// Generates a random UUID (v4)
// Uses crypto.randomUUID() when available with fallback for older environments
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Checks if localStorage is available and functional
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

// Gets the existing visitor ID from localStorage, or creates a new one
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
    return null;
  }
}

// Clears the stored visitor ID
export function clearVisitorId(): void {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(VISITOR_ID_KEY);
    } catch {
      // Ignore storage clear errors
    }
  }
}