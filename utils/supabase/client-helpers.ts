import { hasSupabaseEnvironment } from './env';
import { createClient as createServerClient } from './server';

type ServerClient = Awaited<ReturnType<typeof createServerClient>>;

/**
 * Creates a Supabase server client only when the environment is configured
 * Returns null when Supabase environment variables are not set
 * This prevents errors in local development without Supabase
 */
export async function createSupabaseOrNull(): Promise<ServerClient | null> {
  const [{ hasSupabaseEnvironment: hasEnv }, { createClient }] = await Promise.all([
    import('./env'),
    import('./server'),
  ]);
  if (!hasEnv()) return null;
  return createClient();
}

/** PostgREST error codes for relation does not exist */
export const RELATION_MISSING_CODES = ['PGRST205', '42P01'];

export function isRelationMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code && RELATION_MISSING_CODES.includes(error.code)) return true;
  return (
    !!error.message &&
    /could not find the table|relation .* does not exist|is not present in schema/i.test(error.message)
  );
}
