'use client';

import Map, { Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { useRef, useCallback } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { HaitiMapPoint } from './HaitiMap';

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
}

const INITIAL_VIEW = { longitude: -72.65, latitude: 18.95, zoom: 6.0 };

export function HaitiMapCanvas({ accessibleLabel, points }: HaitiMapCanvasProps) {
  const mapRef = useRef<MapRef>(null);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    mapRef.current?.flyTo({ center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude], zoom: INITIAL_VIEW.zoom, duration: 500 });
  }, []);

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
      >
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#303030] shadow">
          {accessibleLabel} · © OpenStreetMap
        </div>
        {points.map((point) => (
          <Marker key={point.id} longitude={point.longitude} latitude={point.latitude} anchor="bottom">
            <button
              type="button"
              className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-accent px-1 text-[11px] font-extrabold text-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/35"
              aria-label={`${point.department}: ${point.count}`}
              title={`${point.department}: ${point.count}`}
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
          aria-label="Acercar mapa"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#303030] shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Alejar mapa"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#303030] shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Restablecer vista del mapa"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#303030] shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
