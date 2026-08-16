'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from '@/shared/i18n/useTranslations';
import {
  getDashboardTourCompletedAction,
  setDashboardTourCompletedAction,
} from '../actions/onboarding';
import { devLog, devWarn, devError } from '@/utils/logger/client';
import type { DriveStep, Driver } from 'driver.js';

import 'driver.js/dist/driver.css';

const TOUR_STORAGE_KEY = 'konbit-dashboard-tour-completed';
const TOUR_EVENT = 'start-dashboard-tour';

let globalDriverInstance: Driver | null = null;

async function markTourCompleted(): Promise<void> {
  try {
    window.localStorage.setItem(TOUR_STORAGE_KEY, '1');
    devLog('[DashboardTour] localStorage marked completed');
  } catch {
    devWarn('[DashboardTour] localStorage error');
  }
  try {
    const result = await setDashboardTourCompletedAction();
    devLog('[DashboardTour] DB setDashboardTourCompletedAction result');
    if (!result.ok) {
      devWarn(
        '[DashboardTour] DB returned ok=false - check RLS / auth on profiles table',
      );
    }
  } catch {
    devError('[DashboardTour] DB setDashboardTourCompletedAction ERROR');
  }
}

function waitForTourElements(
  selectors: string[],
  timeoutMs = 2500,
): Promise<boolean> {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      const anyVisible = selectors.some((sel) => {
        const candidates = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
        return candidates.some(
          (el) =>
            el.offsetParent !== null &&
            getComputedStyle(el).visibility !== 'hidden',
        );
      });
      if (anyVisible) {
        resolve(true);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve(false);
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}

export function DashboardTour() {
  const t = useTranslations();
  const driverRef = useRef<Driver | null>(null);
  const startingRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let savedRef = false;

    async function startTour(force = false) {
      if (startingRef.current) {
        devLog('[DashboardTour] already starting, skip');
        return;
      }
      if (
        !force &&
        driverRef.current &&
        globalDriverInstance === driverRef.current &&
        driverRef.current.isActive()
      ) {
        devLog('[DashboardTour] already running, skip');
        return;
      }

      startingRef.current = true;
      completedRef.current = false;

      const mappingSelectors: Array<[string, string, string]> = [
        ['[data-tour="dashboard"]', 'dashboardTitle', 'dashboardDesc'],
        ['[data-tour="products"]', 'productsTitle', 'productsDesc'],
        ['[data-tour="stats"]', 'statsTitle', 'statsDesc'],
        ['[data-tour="activity"]', 'activityTitle', 'activityDesc'],
        ['[data-tour="publish"]', 'publishTitle', 'publishDesc'],
      ];

      // Only include profile step on desktop where sidebar is visible
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      if (!isMobile) {
        mappingSelectors.push(['[data-tour="profile"]', 'profileTitle', 'profileDesc']);
      }

      if (!force) {
        const ready = await waitForTourElements(
          mappingSelectors.map(([s]) => s),
          2500,
        );
        devLog('[DashboardTour] waitForTourElements ready');
        if (!ready) {
          startingRef.current = false;
          return;
        }
      }

      if (!mounted) {
        startingRef.current = false;
        return;
      }

      let driverFn: ((opts?: unknown) => Driver) | null = null;
      try {
        const imported = await import('driver.js');
        driverFn = imported.driver as (opts?: unknown) => Driver;
        if (typeof driverFn !== 'function') {
          devError('[DashboardTour] driver() is not a function');
          startingRef.current = false;
          return;
        }
      } catch {
        devError('[DashboardTour] Failed to load driver.js');
        startingRef.current = false;
        return;
      }

      if (!mounted) {
        startingRef.current = false;
        return;
      }

      const ts = t.seller.tour?.steps;
      const buttons = t.seller.tour?.buttons;
      const visibleEl = (selector: string) => {
        const candidates = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
        return (
          candidates.find(
            (el) =>
              el.offsetParent !== null &&
              getComputedStyle(el).visibility !== 'hidden',
          ) || null
        );
      };

      const steps: DriveStep[] = [];
      for (const [selector, titleKey, descKey] of mappingSelectors) {
        const el = visibleEl(selector);
        if (!el) continue;
        const title = ts
          ? (ts as unknown as Record<string, string>)[titleKey] || ''
          : '';
        const description = ts
          ? (ts as unknown as Record<string, string>)[descKey] || selector
          : selector;
        steps.push({
          element: el,
          popover: {
            title,
            description,
            side: 'bottom',
            align: 'start',
            nextBtnText: buttons?.next || undefined,
            prevBtnText: buttons?.prev || undefined,
            doneBtnText: buttons?.done || undefined,
          },
        });
      }

      devLog('[DashboardTour] final steps');

      if (steps.length === 0) {
        startingRef.current = false;
        return;
      }

      if (globalDriverInstance) {
        try {
          globalDriverInstance.destroy();
        } catch {
          // ignore
        }
        globalDriverInstance = null;
      }

      const markOnce = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        void markTourCompleted();
      };

      const instance = driverFn({
        steps,
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayOpacity: 0.5,
        nextBtnText: buttons?.next || undefined,
        prevBtnText: buttons?.prev || undefined,
        doneBtnText: buttons?.done || undefined,
        onDoneClick: () => {
          devLog('[DashboardTour] onDoneClick - marking completed');
          markOnce();
          try { instance.destroy(); } catch { /* ignore */ }
        },
        onCloseClick: () => {
          devLog('[DashboardTour] onCloseClick - marking completed');
          markOnce();
          try { instance.destroy(); } catch { /* ignore */ }
        },
        onDestroyed: () => {
          devLog('[DashboardTour] onDestroyed - ensuring completed marked');
          markOnce();
          if (globalDriverInstance === instance) {
            globalDriverInstance = null;
          }
        },
      });

      instance.drive();
      globalDriverInstance = instance;
      driverRef.current = instance;
      startingRef.current = false;
    }

    const hasQueryParam =
      typeof window !== 'undefined' &&
      window.location.search.includes('startTour=true');

    async function resolveAutoStart() {
      if (hasQueryParam) {
        devLog('[DashboardTour] startTour=true in URL - force start');
        void startTour(true);
        return;
      }

      let dbCompleted = false;
      try {
        const result = await getDashboardTourCompletedAction();
        dbCompleted = result.ok && result.completed;
        devLog('[DashboardTour] getDashboardTourCompletedAction DB result');
      } catch {
        devError('[DashboardTour] getDashboardTourCompletedAction DB ERROR');
      }

      let lsCompleted = false;
      try {
        lsCompleted = window.localStorage.getItem(TOUR_STORAGE_KEY) === '1';
      } catch {
        // ignore
      }

      devLog('[DashboardTour] completed check');

      if (!dbCompleted && !lsCompleted) {
        void startTour(false);
      } else if (!savedRef && dbCompleted) {
        try {
          window.localStorage.setItem(TOUR_STORAGE_KEY, '1');
          savedRef = true;
        } catch {
          // ignore
        }
      }
    }

    void resolveAutoStart();

    const handler = () => {
      devLog('[DashboardTour] event tour force start');
      void startTour(true);
    };
    window.addEventListener(TOUR_EVENT, handler);

    return () => {
      mounted = false;
      window.removeEventListener(TOUR_EVENT, handler);
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // ignore
        }
        driverRef.current = null;
      }
    };
  }, [t]);

  return null;
}
