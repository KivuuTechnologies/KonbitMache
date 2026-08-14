import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseEnvironment } from './env';
import type { Database } from './types';

interface ServerClientOptions {
  sessionCookieMaxAge?: number;
}

/**
 * Creates a Supabase client for Server Components, Server Actions and Route
 * Handlers. Cookie refreshes are persisted by the root middleware
 */
export async function createClient(options: ServerClientOptions = {}) {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnvironment();

  return createServerClient<Database>(url, publishableKey, {
    cookieOptions: options.sessionCookieMaxAge
      ? { maxAge: options.sessionCookieMaxAge }
      : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies. The middleware refreshes
          // and writes auth cookies before the component is rendered.
        }
      },
    },
  });
}
