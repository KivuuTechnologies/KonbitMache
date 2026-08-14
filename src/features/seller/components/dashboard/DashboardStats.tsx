import { Package, Eye, Users } from 'lucide-react';
import { dashboardService } from '../../services';
import { DashboardError } from './skeletons';
import type { SellerStats } from '../../types';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface DashboardStatsProps {
  userId: string;
  t: MarketplaceCopy;
}

/**
 * Real stats grid (server component). Rendered inside <Suspense> so the
 * skeleton is the loading state. Distinguishes:
 *   - error   → DashboardError panel
 *   - real 0  → "0"
 *   - missing tracking table → "—" (metric not measurable yet)
 */
export async function DashboardStats({ userId, t }: DashboardStatsProps) {
  let stats: SellerStats;
  try {
    stats = await dashboardService.getStats(userId);
  } catch {
    return <DashboardError message={t.seller.dashboard.loadError} />;
  }

  const cards = [
    {
      label: t.seller.dashboard.activeProducts,
      value: stats.productos_activos,
      icon: Package,
      color: 'bg-fey/10 text-fey',
    },
    {
      label: t.seller.dashboard.views,
      value: stats.visualizaciones,
      icon: Eye,
      color: 'bg-dlo/10 text-dlo',
    },
    {
      label: t.seller.dashboard.interestedVisitors ?? 'Visitantes interesados',
      value: stats.visitantes_interesados,
      icon: Users,
      color: 'bg-purple/10 text-purple',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-surface-muted bg-surface-muted p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.color}`}>
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted">{card.label}</p>
              <p className="text-2xl font-bold">
                {card.value === null ? '—' : card.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
