/**
 * Supabase Storage path utilities
 *
 * Public URLs from supabase.storage.from(bucket).getPublicUrl(path) follow
 *   https://project.supabase.co/storage/v1/object/public/bucket/path
 * To call storage.from(bucket).remove([path]) we need the relative path
 * without the bucket prefix
 */

const PUBLIC_OBJECT_SEGMENT = '/storage/v1/object/public/';

/**
 * Extracts the relative path inside a bucket from a Supabase public storage URL
 * Returns null if the URL does not match the expected pattern
 * - e.g. external CDN or legacy URL
 */
export function storagePathFromUrl(url: string, bucket: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const marker = `${PUBLIC_OBJECT_SEGMENT}${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  const relativePath = url.slice(idx + marker.length);
  if (!relativePath) return null;

  return relativePath;
}

/** Converts public storage URLs to relative paths - filtering out non-matching URLs */
export function storagePathsFromUrls(urls: string[], bucket: string): string[] {
  return urls
    .map((url) => storagePathFromUrl(url, bucket))
    .filter((p): p is string => p !== null);
}