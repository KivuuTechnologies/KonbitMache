import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnvironment } from './env';
import type { Database } from './types';

/** Creates a Supabase client for React Client Components */
export function createClient() {
  const { url, publishableKey } = getSupabaseEnvironment();

  return createBrowserClient<Database>(url, publishableKey);
}
