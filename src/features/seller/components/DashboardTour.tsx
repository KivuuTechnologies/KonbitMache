'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from '@/shared/i18n/useTranslations';
import {
  getDashboardTourCompletedAction,
  setDashboardTourCompletedAction,
} from '../actions/onboarding';
import type { DriveStep, Driver } from 'driver.js';

import 'driver.js/dist/driver.css';

const TOUR_STORAGE_KEY = 'konbit-dashboard-tour-completed';
const TOUR_EVENT = 'start-dashboard-tour';

let globalDriverInstance: Driver | null = null;

async function markTourCompleted(): Promise<void> {
  try {
    window.localStorage.setItem(TOUR_STORAGE_KEY, '1');
    console.log('[DashboardTour] localStorage marked completed');
  } catch (e) {
    console.warn('[DashboardTour] localStorage error:', e);
  }
  try {
    const result = await setDashboardTourCompletedAction();
    console.log('[DashboardTour] DB setDashboardTourCompletedAction result:', result);
    if (!result.ok) {
      console.warn('[DashboardTour] DB returned ok=false — check RLS / auth on profiles table');
    }
  } catch (e) {
    console.error('[DashboardTour] DB setDashboardTourCompletedAction ERROR:', e);
  }
}

function waitForTourElements(selectors: string[], timeoutMs = 2500): Promise<boolean> {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      const anyVisible = selectors.some((sel) => {
        const candidates = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
        return candidates.some((el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden');
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
        console.log('[DashboardTour] already starting, skip');
        return;
      }
      if (!force && driverRef.current && globalDriverInstance === driverRef.current && driverRef.current.isActive()) {
        console.log('[DashboardTour] already running, skip');
        return;
      }

      startingRef.current = true;
      completedRef.current = false;

      const mappingSelectors: Array<[string, string, string]> = [
        ['[data-tour="dashboard"]', 'dashboardTitle', 'dashboardDesc'],
        ['[data-tour="products"]',  'productsTitle',  'productsDesc'],
        ['[data-tour="stats"]',     'statsTitle',     'statsDesc'],
        ['[data-tour="activity"]',  'activityTitle',  'activityDesc'],
        ['[data-tour="publish"]',   'publishTitle',   'publishDesc'],
        ['[data-tour="profile"]',   'profileTitle',   'profileDesc'],
      ];

      if (!force) {
        const ready = await waitForTourElements(mappingSelectors.map(([s]) => s), 2500);
        console.log('[DashboardTour] waitForTourElements ready=', ready);
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
          console.error('[DashboardTour] driver() is not a function:', typeof driverFn);
          startingRef.current = false;
          return;
        }
      } catch (error) {
        console.error('[DashboardTour] Failed to load driver.js:', error);
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
        return candidates.find((el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden') || null;
      };

      const steps: DriveStep[] = [];
      for (const [selector, titleKey, descKey] of mappingSelectors) {
        const el = visibleEl(selector);
        if (!el) continue;
        // TypeScript indexing: treat ts as a record of strings
        const title = ts ? (ts as unknown as Record<string, string>)[titleKey] || '' : '';
        const description = ts ? (ts as unknown as Record<string, string>)[descKey] || selector : selector;
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

      console.log('[DashboardTour] final steps=', steps.length, mappingSelectors.map(([selector]) => ({ selector, found: !!document.querySelector(selector), visible: !!visibleEl(selector) })));

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
          console.log('[DashboardTour] onDoneClick — marking completed');
          markOnce();
        },
        onCloseClick: () => {
          console.log('[DashboardTour] onCloseClick — marking completed');
          markOnce();
        },
        onDestroyed: () => {
          console.log('[DashboardTour] onDestroyed — ensuring completed marked');
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

    const hasQueryParam = typeof window !== 'undefined' && window.location.search.includes('startTour=true');

    async function resolveAutoStart() {
      if (hasQueryParam) {
        console.log('[DashboardTour] startTour=true in URL → force start');
        void startTour(true);
        return;
      }

      let dbCompleted = false;
      try {
        const result = await getDashboardTourCompletedAction();
        dbCompleted = result.ok && result.completed;
        console.log('[DashboardTour] getDashboardTourCompletedAction DB result:', result, 'dbCompleted=', dbCompleted);
      } catch (e) {
        console.error('[DashboardTour] getDashboardTourCompletedAction DB ERROR:', e);
      }

      let lsCompleted = false;
      try {
        lsCompleted = window.localStorage.getItem(TOUR_STORAGE_KEY) === '1';
      } catch {
        // ignore
      }

      console.log('[DashboardTour] dbCompleted=', dbCompleted, 'lsCompleted=', lsCompleted, '→ autoStart=', !dbCompleted && !lsCompleted);

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
      console.log('[DashboardTour] event', TOUR_EVENT, '→ force start');
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
