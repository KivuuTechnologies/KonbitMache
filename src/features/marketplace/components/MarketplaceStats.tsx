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
    <div
      className={
        dark
          ? 'rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition sm:p-5'
          : 'rounded-2xl border border-border/50 bg-surface-muted p-5 text-center transition hover:border-border sm:p-6'
      }
    >
      <p className={dark ? 'text-2xl font-extrabold text-white sm:text-3xl' : 'text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl'}>
        {value}
      </p>
      <p className={dark ? 'mt-1 text-xs font-semibold text-white/60 sm:text-sm' : 'mt-1.5 text-xs font-bold capitalize text-muted sm:text-sm'}>
        {label}
      </p>
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
          ...(typeof effectiveState.data.interested === 'number'
            ? [{ value: effectiveState.data.interested.toLocaleString(), label: t.stats.interested }]
            : []),
          { value: effectiveState.data.departments.length.toLocaleString(), label: t.stats.departments },
        ]
      : effectiveState.status === 'unavailable'
      ? [
          { value: DASH, label: t.stats.farmers },
          { value: DASH, label: t.stats.interested },
          { value: DASH, label: t.stats.departments },
        ]
      : [];

  const cellCount = cells.length || 2;

  return (
    <section className={dark ? 'mt-10' : 'mt-14 sm:mt-16 text-center'}>
      {title ? (
        <div className={dark ? 'mb-6' : 'mb-6 text-center'}>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">KonbitMache</p>
          <h2 className="mt-2 text-[clamp(1.5rem,6vw,1.875rem)] font-extrabold tracking-tight">{title}</h2>
        </div>
      ) : null}

      <div
        className={
          dark
            ? 'grid grid-cols-2 gap-3 sm:gap-4'
            : cellCount === 2
            ? 'mx-auto grid grid-cols-2 gap-3 sm:gap-4 max-w-lg'
            : 'mx-auto grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 max-w-2xl'
        }
      >
        {effectiveState.status === 'loading'
          ? [1, 2].map((i) => (
              <div
                key={i}
                className={
                  dark
                    ? 'rounded-2xl border border-white/10 bg-white/5 p-4 text-center'
                    : 'rounded-2xl border border-border/50 bg-surface-muted p-5 text-center'
                }
              >
                <div className={dark ? 'mx-auto h-7 w-12 animate-pulse rounded bg-white/10' : 'mx-auto h-9 w-14 animate-pulse rounded bg-muted/20'} />
                <div className={dark ? 'mx-auto mt-2 h-3.5 w-16 animate-pulse rounded bg-white/10' : 'mx-auto mt-2 h-4 w-20 animate-pulse rounded bg-muted/20'} />
              </div>
            ))
          : cells.map((cell) => <StatsCell key={cell.label} value={cell.value} label={cell.label} dark={dark} />)}
      </div>

      {state.status === 'ok' && state.data.departments.length > 0 && !hideDepartments ? (
        <div className={dark ? 'mt-4 flex flex-wrap items-center gap-2' : 'mt-5 flex flex-wrap items-center justify-center gap-2'}>
          {state.data.departments.map((d) => (
            <span
              key={d.name}
              className={
                dark
                  ? 'rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80'
                  : 'rounded-full border border-border/50 bg-surface-muted px-3 py-1 text-xs font-bold text-muted'
              }
            >
              {d.name}: <span className={dark ? 'text-white' : 'text-foreground'}>{d.count.toLocaleString()}</span>
            </span>
          ))}
        </div>
      ) : null}

      {state.status === 'unavailable' ? (
        <p className={dark ? 'mt-3 text-xs text-white/50' : 'mt-4 text-center text-sm text-muted'}>{t.stats.unavailable}</p>
      ) : null}
    </section>
  );
}
