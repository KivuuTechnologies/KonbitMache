import { AlertTriangle } from 'lucide-react';

/**
 * Shared loading skeletons + error panel for the dashboard sections.
 * Skeletons are the Suspense fallbacks - they only render while the section
 * is fetching, so "loading" is never confused with a real 0 or an error
 */

export function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-danger-bg text-danger">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <p className="max-w-sm text-sm font-medium text-muted">{message}</p>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-surface-muted bg-surface-muted p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-border" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-border" />
              <div className="h-7 w-12 animate-pulse rounded bg-border" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl bg-surface-muted p-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-border" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-3 w-24 animate-pulse rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
          <div className="h-40 animate-pulse bg-border" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-border" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
