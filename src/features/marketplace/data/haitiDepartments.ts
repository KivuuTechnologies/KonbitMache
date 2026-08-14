/**
 * Geographic coordinates for Haiti's 10 departments (centroid)
 * Used to place marketplace offer markers on the map
 * Keys match the profiles.department DB enum exactly
 */
export interface DepartmentCoordinates {
  longitude: number;
  latitude: number;
}

export const departmentCoordinates: Record<string, DepartmentCoordinates> = {
  Artibonite: { longitude: -72.6897, latitude: 19.4456 },
  "Grand'Anse": { longitude: -74.1186, latitude: 18.6513 },
  Nord: { longitude: -72.2007, latitude: 19.7594 },
  Centre: { longitude: -72.0153, latitude: 19.1437 },
  'Sud-Est': { longitude: -71.8346, latitude: 18.2485 },
  Sud: { longitude: -73.7484, latitude: 18.1933 },
  Nippes: { longitude: -73.3396, latitude: 18.4415 },
  'Nord-Est': { longitude: -71.8406, latitude: 19.6675 },
  Ouest: { longitude: -72.335, latitude: 18.5392 },
  'Nord-Ouest': { longitude: -72.83, latitude: 19.94 },
};
