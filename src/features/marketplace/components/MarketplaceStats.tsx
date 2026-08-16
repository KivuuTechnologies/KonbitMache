'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { createClient } from '../../../../utils/supabase/client';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { devError } from '@/utils/logger/client';
import type { MarketplaceCopy } from '@/shared/i18n/types';
import type { MarketplaceStats as MarketplaceStatsData } from '@/features/marketplace/services';

export interface MarketplaceStatsProps {
  copy?: MarketplaceCopy;
  stats?: MarketplaceStatsData | null;
  variant?: 'light' | 'dark';
  title?: string;
  hideDepartments?: boolean;
}

type StatsState =
  | { status: 'loading' }
  | { status: 'ok'; data: MarketplaceStatsData }
  | { status: 'unavailable' };

const DASH = '—';

function StatsCell({ value, label, dark }: { value: string; label: string; dark: boolean }) {
  return (
    <div className={dark ? 'rounded-2xl bg-white/5 px-4 py-3 backdrop-blur-sm' : 'rounded-2xl bg-surface-muted p-4 text-center sm:p-5'}>
      <p className={dark ? 'text-2xl font-extrabold text-white' : 'text-3xl font-extrabold tracking-tight'}>{value}</p>
      <p className={dark ? 'mt-0.5 text-xs font-semibold text-white/50' : 'mt-1 text-sm font-bold text-muted'}>{label}</p>
    </div>
  );
}

export function MarketplaceStats({
  copy: propCopy,
  stats,
  variant = 'light',
  title,
  hideDepartments = false,
}: MarketplaceStatsProps) {
  const contextCopy = useTranslations();
  const t = propCopy || contextCopy;

  const [state, setState] = useState<StatsState>(() => {
    if (stats) return { status: 'ok', data: stats };
    if (stats === null && typeof stats !== 'undefined') return { status: 'unavailable' };
    if (!hasSupabaseEnvironment()) return { status: 'unavailable' };
    return { status: 'loading' };
  });

  const effectiveState: StatsState =
    stats !== undefined
      ? stats
        ? { status: 'ok', data: stats }
        : { status: 'unavailable' }
      : state;

  useEffect(() => {
    if (stats !== undefined || !hasSupabaseEnvironment()) return;

    let active = true;

    async function fetchStats() {
      try {
        const client = createClient();
        const { data, error } = await client.rpc('get_public_marketplace_stats');
        if (!active) return;
        if (error || !data) {
          devError('[MarketplaceStats] RPC unavailable:', error?.message);
          setState({ status: 'unavailable' });
          return;
        }
        if (typeof data.farmers !== 'number' || !Array.isArray(data.departments)) {
          devError('[MarketplaceStats] unexpected RPC payload');
          setState({ status: 'unavailable' });
          return;
        }
        setState({ status: 'ok', data });
      } catch (err) {
        if (!active) return;
        devError('[MarketplaceStats] fetch error:', err);
        setState({ status: 'unavailable' });
      }
    }

    fetchStats();

    return () => {
      active = false;
    };
  }, [stats]);

  const dark = variant === 'dark';

  const cells: { value: string; label: string }[] =
    effectiveState.status === 'ok'
      ? [
          { value: effectiveState.data.farmers.toLocaleString(), label: t.stats.farmers },
          ...(typeof effectiveState.data.cooperatives === 'number'
            ? [{ value: effectiveState.data.cooperatives.toLocaleString(), label: t.stats.cooperatives }]
            : []),
          ...(typeof effectiveState.data.companies === 'number'
            ? [{ value: effectiveState.data.companies.toLocaleString(), label: t.stats.companies }]
            : []),
          ...(typeof effectiveState.data.interested === 'number'
            ? [{ value: effectiveState.data.interested.toLocaleString(), label: t.stats.interested }]
            : []),
          { value: effectiveState.data.departments.length.toLocaleString(), label: t.stats.departments },
        ]
      : effectiveState.status === 'unavailable'
      ? [
          { value: DASH, label: t.stats.farmers },
          { value: DASH, label: t.stats.cooperatives },
          { value: DASH, label: t.stats.companies },
          { value: DASH, label: t.stats.interested },
          { value: DASH, label: t.stats.departments },
        ]
      : [];

  return (
    <section className={dark ? 'mt-10' : 'mt-14 sm:mt-16'}>
      {title ? (
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">KonbitMache</p>
          <h2 className="mt-2 text-[clamp(1.5rem,6vw,1.875rem)] font-extrabold tracking-tight">{title}</h2>
        </div>
      ) : null}

      <div className={dark ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-2 gap-3 md:grid-cols-4'}>
        {effectiveState.status === 'loading'
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className={dark ? 'rounded-2xl bg-white/5 px-4 py-3' : 'rounded-2xl bg-surface-muted p-4 text-center sm:p-5'}>
                <div className={dark ? 'mx-auto h-6 w-12 animate-pulse rounded bg-white/10' : 'mx-auto h-8 w-12 animate-pulse rounded bg-muted/20'} />
                <div className={dark ? 'mx-auto mt-2 h-3 w-16 animate-pulse rounded bg-white/10' : 'mx-auto mt-2 h-3 w-16 animate-pulse rounded bg-muted/20'} />
              </div>
            ))
          : cells.map((cell) => <StatsCell key={cell.label} value={cell.value} label={cell.label} dark={dark} />)}
      </div>

      {state.status === 'ok' && state.data.departments.length > 0 && !hideDepartments ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {state.data.departments.map((d) => (
            <span
              key={d.name}
              className={dark ? 'rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70' : 'rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-muted'}
            >
              {d.name}: {d.count.toLocaleString()}
            </span>
          ))}
        </div>
      ) : null}

      {state.status === 'unavailable' ? (
        <p className={dark ? 'mt-3 text-xs text-white/50' : 'mt-3 text-sm text-muted'}>{t.stats.unavailable}</p>
      ) : null}
    </section>
  );
}
