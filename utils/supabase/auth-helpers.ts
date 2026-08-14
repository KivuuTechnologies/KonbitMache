import { createClient } from './server';

/**
 * Gets the authenticated user id from the current Supabase session
 * Returns null when the user is not authenticated or when an error occurs
 * Logs authentication errors for debugging
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    console.error('[getAuthenticatedUserId] Failed to get user:', {
      error: error?.message,
    });
    return null;
  }
  return data.claims.sub;
}
