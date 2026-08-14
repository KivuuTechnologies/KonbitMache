import type { ProductStatus } from '../../types';

const styles: Record<ProductStatus, string> = {
  active: 'bg-fey/15 text-fey',
  paused: 'bg-soley/15 text-soley',
  sold_out: 'bg-muted/15 text-muted',
};

interface StatusBadgeProps {
  status: ProductStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {label}
    </span>
  );
}
