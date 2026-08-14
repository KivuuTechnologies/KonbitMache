/**
 * Presentation helpers for the Seller Portal - Pure functions - no side effects
 * safe to run on the server or the client
 */

/** Formats an amount of Haitian gourdes - e.g. 18000 - G 18,000 */
export function formatGourdes(amount: number): string {
  return `G ${new Intl.NumberFormat('en-US').format(Math.round(amount))}`;
}

export interface RelativeTimeCopy {
  now: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
}

/**
 * Localized relative time using the provided copy templates - Templates may use
 * a count placeholder - e.g. count d - Kept template-based instead of
 * Intl-RelativeTimeFormat so Haitian Creole renders correctly
 */
export function formatRelativeTime(iso: string, copy: RelativeTimeCopy): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return copy.now;
  if (minutes < 60) return copy.minutesAgo.replace('{count}', String(minutes));

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return copy.hoursAgo.replace('{count}', String(hours));

  const days = Math.floor(hours / 24);
  return copy.daysAgo.replace('{count}', String(days));
}
