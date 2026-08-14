'use client';

import { Clock } from 'lucide-react';
import type { Activity } from '../types';
import { useTranslations } from '@/shared/i18n/useTranslations';

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const t = useTranslations();

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-muted p-6 text-center">
        <Clock className="mx-auto h-8 w-8 text-muted mb-3" aria-hidden="true" />
        <p className="text-base font-semibold text-muted">{t.seller.dashboard.noActivity}</p>
      </div>
    );
  }

  const labelFor = (activity: Activity): string => {
    const name = activity.productName ?? '';
    const template =
      activity.tipo === 'producto_editado'
        ? t.seller.dashboard.activityUpdated
        : activity.tipo === 'producto_pausado'
          ? t.seller.dashboard.activityPaused
          : activity.tipo === 'producto_retirado'
            ? t.seller.dashboard.activityWithdrawn
            : t.seller.dashboard.activityPublished;
    return template.replace('{product}', name);
  };

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 rounded-xl bg-surface-muted p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dlo/10">
            <Clock className="h-5 w-5 text-dlo" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold">{labelFor(activity)}</p>
            <p className="mt-1 text-sm text-muted">
              {new Date(activity.fecha).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
