import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground text-balance">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
