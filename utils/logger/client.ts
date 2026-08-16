'use client';

export function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[dev]', ...args);
  }
}

export function devWarn(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[dev]', ...args);
  }
}

export function devError(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.error('[dev]', ...args);
  }
}
