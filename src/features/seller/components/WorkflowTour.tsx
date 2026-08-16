'use client';

import { useEffect, useRef } from 'react';
import 'driver.js/dist/driver.css';

interface DashboardDriver {
  drive(): void;
  destroy(): void;
}

type WorkflowName = 'dashboard' | 'publish' | 'products' | 'profile' | 'settings';

const WORKFLOW_EVENT = 'start-workflow-tour';

let globalDriverInstance: DashboardDriver | null = null;

interface TourStep {
  selector: string;
  description: string;
}

const PUBLISH_FORM_STEPS: TourStep[] = [
  { selector: '[data-tour="form-category"]', description: 'Selecciona la categoría de tu producto' },
  { selector: '[data-tour="form-details"]', description: 'Escribe el nombre y una descripción clara' },
  { selector: '[data-tour="form-pricing"]', description: 'Define precio, unidad y cantidad disponible' },
  { selector: '[data-tour="form-photo"]', description: 'Agrega fotos de tu producto (opcional)' },
  { selector: '[data-tour="form-preview"]', description: 'Revisa que todo esté correcto' },
  { selector: '[data-tour="form-publish"]', description: 'Haz clic aquí para publicar tu producto' },
];

const DASHBOARD_STEPS: TourStep[] = [
  { selector: '[data-tour="dashboard"]', description: 'Resumen de tu actividad' },
  { selector: '[data-tour="publish"]', description: 'Publica un nuevo producto' },
  { selector: '[data-tour="products"]', description: 'Gestiona tus productos' },
  { selector: '[data-tour="stats"]', description: 'Mide tus resultados' },
  { selector: '[data-tour="activity"]', description: 'Tu actividad reciente' },
];

export function WorkflowTour() {
  const driverRef = useRef<DashboardDriver | null>(null);
  const startingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function startWorkflowTour(workflow: WorkflowName) {
      if (startingRef.current) return;
      startingRef.current = true;

      let driverModule: unknown = null;
      try {
        driverModule = await import('driver.js');
      } catch {
        startingRef.current = false;
        return;
      }

      if (!mounted) {
        startingRef.current = false;
        return;
      }

      const driverModuleObj = driverModule as { driver?: unknown; default?: unknown };
      const driverFn = driverModuleObj.driver ?? driverModuleObj.default;
      if (typeof driverFn !== 'function') {
        startingRef.current = false;
        return;
      }

      const steps = workflow === 'dashboard' ? DASHBOARD_STEPS : PUBLISH_FORM_STEPS;

      const visibleEl = (selector: string) => {
        const candidates = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
        return candidates.find((el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden') || null;
      };

      const resolved = steps
        .map((s) => ({ el: visibleEl(s.selector), desc: s.description }))
        .filter((s): s is { el: HTMLElement; desc: string } => s.el !== null);

      if (resolved.length === 0) {
        startingRef.current = false;
        return;
      }

      if (globalDriverInstance) {
        try { globalDriverInstance.destroy(); } catch { /* ignore */ }
        globalDriverInstance = null;
      }

      const saveTourCompleted = () => {
        try { window.localStorage.setItem('konbit-dashboard-tour-completed', '1'); } catch { /* ignore */ }
      };

      const instance = driverFn({
        steps: resolved.map((s) => ({
          element: s.el,
          popover: {
            title: '',
            description: s.desc,
            side: 'bottom',
            align: 'start',
          },
        })),
        animate: true,
        allowClose: true,
        overlayOpacity: 0.5,
        onDoneClick: () => {
          saveTourCompleted();
          try { instance.destroy(); } catch { /* ignore */ }
        },
        onCloseClick: () => {
          saveTourCompleted();
          try { instance.destroy(); } catch { /* ignore */ }
        },
        onDestroyed: () => {
          if (globalDriverInstance === instance) {
            globalDriverInstance = null;
          }
        },
      }) as unknown as DashboardDriver;

      instance.drive();
      globalDriverInstance = instance;
      driverRef.current = instance;
      startingRef.current = false;
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { workflow?: WorkflowName } | undefined;
      if (detail?.workflow) {
        void startWorkflowTour(detail.workflow);
      }
    };
    window.addEventListener(WORKFLOW_EVENT, handler);

    return () => {
      mounted = false;
      window.removeEventListener(WORKFLOW_EVENT, handler);
      if (driverRef.current) {
        try { driverRef.current.destroy(); } catch { /* ignore */ }
        driverRef.current = null;
      }
    };
  }, []);

  return null;
}

export function startWorkflowTour(workflow: WorkflowName) {
  window.dispatchEvent(new CustomEvent(WORKFLOW_EVENT, { detail: { workflow } }));
}

