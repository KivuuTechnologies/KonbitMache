// Skeleton loading components
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-muted ${className || ''}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#24201e]">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#24201e]">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="mt-2 h-12 w-3/4" />
    </div>
  );
}
