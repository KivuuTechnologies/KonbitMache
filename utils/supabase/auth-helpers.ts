import { createClient } from './server';
import { logError } from '../logger/server';

export async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    logError('[getAuthenticatedUserId] Failed to get user:', {
      error: error?.message,
    });
    return null;
  }
  return data.claims.sub;
}
