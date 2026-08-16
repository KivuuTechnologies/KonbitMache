'use client';

import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { useRef, useCallback, useEffect } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { HaitiMapPoint } from './HaitiMap';
import 'maplibre-gl/dist/maplibre-gl.css';

const mapStyle = {
  version: 8 as const,
  sources: {
    openstreetmap: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'openstreetmap', type: 'raster' as const, source: 'openstreetmap' }],
};

interface HaitiMapCanvasProps {
  accessibleLabel: string;
  points: HaitiMapPoint[];
  locale: string;
}

const MAP_UI_TRANSLATIONS = {
  ht: { zoomIn: 'Rapproche', zoomOut: 'Eloiye', resetView: 'Koreksyon vizyèl' },
  fr: { zoomIn: 'Zoom avant', zoomOut: 'Zoom arrière', resetView: 'Réinitialiser la vue' },
  es: { zoomIn: 'Acercar', zoomOut: 'Alejar', resetView: 'Restablecer vista' },
  en: { zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetView: 'Reset view' },
} as const;

type SupportedLocale = keyof typeof MAP_UI_TRANSLATIONS;

// Center on Haiti's geographic midpoint; zoom 6.2 fits the full island
// (including the southern peninsula) without Cuba dominating the view
const INITIAL_VIEW = { longitude: -73.0, latitude: 18.7, zoom: 6.2 };

export function HaitiMapCanvas({ accessibleLabel, points, locale }: HaitiMapCanvasProps) {
  const mapRef = useRef<MapRef>(null);

  const currentLocale = (locale in MAP_UI_TRANSLATIONS ? locale : 'ht') as SupportedLocale;
  const labels = MAP_UI_TRANSLATIONS[currentLocale];

  // Automatically fit the camera view bounds to the points
  const fitCameraToBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const p of points) {
      if (p.longitude < minLng) minLng = p.longitude;
      if (p.longitude > maxLng) maxLng = p.longitude;
      if (p.latitude < minLat) minLat = p.latitude;
      if (p.latitude > maxLat) maxLat = p.latitude;
    }

    if (minLng === Infinity || maxLng === -Infinity || minLat === Infinity || maxLat === -Infinity) {
      return;
    }

    if (points.length === 1) {
      map.flyTo({
        center: [minLng, minLat],
        zoom: 6.2,
        duration: 800,
      });
    } else {
      map.fitBounds([minLng, minLat, maxLng, maxLat], {
        padding: 60,
        maxZoom: 6.5,
        duration: 800,
      });
    }
  }, [points]);

  useEffect(() => {
    // Wait a brief tick for MapLibre map initialization if needed
    const timer = setTimeout(() => {
      fitCameraToBounds();
    }, 200);
    return () => clearTimeout(timer);
  }, [fitCameraToBounds]);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    if (points.length > 0) {
      fitCameraToBounds();
    } else {
      mapRef.current?.flyTo({ center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude], zoom: INITIAL_VIEW.zoom, duration: 500 });
    }
  }, [points, fitCameraToBounds]);

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        aria-label={accessibleLabel}
        initialViewState={INITIAL_VIEW}
        minZoom={4}
        maxZoom={12}
        mapStyle={mapStyle}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        scrollZoom={false}
        dragPan
        touchZoomRotate
        onLoad={fitCameraToBounds}
      >
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#303030] shadow">
          {accessibleLabel} · © OpenStreetMap
        </div>
        {points.map((point) => (
          <Marker key={point.id} longitude={point.longitude} latitude={point.latitude} anchor="bottom">
            <button
              type="button"
              className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-accent px-1 text-[11px] font-extrabold text-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/35"
              aria-label={`${point.commune}, ${point.department}: ${point.count}`}
              title={`${point.commune}, ${point.department}: ${point.count}`}
            >
              {point.count}
            </button>
          </Marker>
        ))}
      </Map>

      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label={labels.zoomIn}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#303030] shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label={labels.zoomOut}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#303030] shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label={labels.resetView}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#303030] shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


