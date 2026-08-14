export function AuthDivider({ label }: { label: string }) {
  return <div className="my-5 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-black/10 dark:bg-white/15" /><span className="text-sm font-semibold text-foreground/60">{label}</span><span className="h-px flex-1 bg-black/10 dark:bg-white/15" /></div>;
}
