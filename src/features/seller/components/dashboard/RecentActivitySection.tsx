import { dashboardService } from '../../services';
import { RecentActivity } from '../RecentActivity';
import { DashboardError } from './skeletons';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface RecentActivitySectionProps {
  userId: string;
  t: MarketplaceCopy;
}

/**
 * Wraps the client <RecentActivity> with a server fetch so the section can
 * stream under <Suspense> and surface a real error state
 */
export async function RecentActivitySection({ userId, t }: RecentActivitySectionProps) {
  let activities;
  try {
    activities = await dashboardService.getActivity(userId);
  } catch {
    return <DashboardError message={t.seller.dashboard.loadError} />;
  }

  return <RecentActivity activities={activities.slice(0, 3)} />;
}
