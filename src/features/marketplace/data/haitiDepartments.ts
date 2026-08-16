/**
 * Geographic coordinates for Haiti's 10 departments (centroid)
 * Used as fallback when a seller has no commune, or commune is unknown
 * Keys match the profiles.department DB enum exactly
 */
export interface DepartmentCoordinates {
  longitude: number;
  latitude: number;
}

export const departmentCoordinates: Record<string, DepartmentCoordinates> = {
  Artibonite:   { longitude: -72.6897, latitude: 19.4456 },
  "Grand'Anse": { longitude: -74.1186, latitude: 18.6513 },
  Nord:         { longitude: -72.2007, latitude: 19.7594 },
  Centre:       { longitude: -72.0153, latitude: 19.1437 },
  'Sud-Est':    { longitude: -71.8346, latitude: 18.2485 },
  Sud:          { longitude: -73.7484, latitude: 18.1933 },
  Nippes:       { longitude: -73.3396, latitude: 18.4415 },
  'Nord-Est':   { longitude: -71.8406, latitude: 19.6675 },
  Ouest:        { longitude: -72.335,  latitude: 18.5392 },
  'Nord-Ouest': { longitude: -72.83,   latitude: 19.94   },
};

/**
 * Approximate centroid coordinates for Haiti's communes
 * Used to place per-location product markers on the map
 * Keys match the values stored in profiles.commune exactly
 */
export const communeCoordinates: Record<string, DepartmentCoordinates> = {
  // Artibonite
  'Gonaïves':                          { longitude: -72.6907, latitude: 19.4537 },
  'Saint-Marc':                        { longitude: -72.7013, latitude: 19.1116 },
  'Gros-Morne':                        { longitude: -72.6813, latitude: 19.6694 },
  "Petite-Rivière-de-l'Artibonite":   { longitude: -72.5023, latitude: 19.1334 },
  'Verrettes':                         { longitude: -72.4672, latitude: 19.0555 },
  'Dessalines':                        { longitude: -72.5978, latitude: 19.2904 },
  'Ennery':                            { longitude: -72.5255, latitude: 19.5415 },
  'Marmelade':                         { longitude: -72.3588, latitude: 19.4762 },
  'Anse-Rouge':                        { longitude: -73.0977, latitude: 19.6317 },
  // Centre
  'Hinche':                            { longitude: -71.9479, latitude: 19.1510 },
  'Mirebalais':                        { longitude: -72.1079, latitude: 18.8374 },
  'Lascahobas':                        { longitude: -71.9346, latitude: 18.8324 },
  'Boucan-Carré':                      { longitude: -72.0618, latitude: 19.0168 },
  'Belladère':                         { longitude: -71.7736, latitude: 18.8598 },
  "Saut-d'Eau":                        { longitude: -72.1857, latitude: 19.0657 },
  'Cerca-la-Source':                   { longitude: -71.8429, latitude: 19.1629 },
  'Thomassique':                       { longitude: -71.7938, latitude: 19.1918 },
  // Grand'Anse
  'Jérémie':                           { longitude: -74.1183, latitude: 18.6503 },
  "Anse-d'Hainault":                   { longitude: -74.4568, latitude: 18.5009 },
  'Pestel':                            { longitude: -73.9287, latitude: 18.5738 },
  'Dame-Marie':                        { longitude: -74.4235, latitude: 18.5559 },
  'Moron':                             { longitude: -73.9101, latitude: 18.7095 },
  'Corail':                            { longitude: -73.8882, latitude: 18.5643 },
  'Chambellan':                        { longitude: -74.1833, latitude: 18.5167 },
  // Nippes
  'Miragoâne':                         { longitude: -73.0871, latitude: 18.4435 },
  'Anse-à-Veau':                       { longitude: -73.3478, latitude: 18.4883 },
  'Petite-Rivière-de-Nippes':          { longitude: -73.1686, latitude: 18.4870 },
  'Baradères':                         { longitude: -73.6530, latitude: 18.4949 },
  'Fond-des-Nègres':                   { longitude: -73.0819, latitude: 18.2749 },
  'Arnaud':                            { longitude: -73.1380, latitude: 18.4200 },
  'Paillant':                          { longitude: -73.3216, latitude: 18.3484 },
  // Nord
  'Cap-Haïtien':                       { longitude: -72.2046, latitude: 19.7574 },
  'Grande-Rivière-du-Nord':            { longitude: -72.1544, latitude: 19.5996 },
  'Limonade':                          { longitude: -72.0882, latitude: 19.7050 },
  'Plaisance':                         { longitude: -72.4675, latitude: 19.5955 },
  'Saint-Raphaël':                     { longitude: -72.2669, latitude: 19.5028 },
  'Acul-du-Nord':                      { longitude: -72.3058, latitude: 19.7143 },
  'Milot':                             { longitude: -72.2217, latitude: 19.6020 },
  'Quartier-Morin':                    { longitude: -72.1575, latitude: 19.6936 },
  // Nord-Est
  'Fort-Liberté':                      { longitude: -71.8432, latitude: 19.6649 },
  'Ouanaminthe':                       { longitude: -71.7283, latitude: 19.5530 },
  'Trou-du-Nord':                      { longitude: -72.0069, latitude: 19.6166 },
  'Terrier-Rouge':                     { longitude: -71.9040, latitude: 19.6436 },
  'Vallières':                         { longitude: -71.9570, latitude: 19.4774 },
  'Caracol':                           { longitude: -71.9291, latitude: 19.6940 },
  'Mont-Organisé':                     { longitude: -71.8791, latitude: 19.4638 },
  // Nord-Ouest
  'Port-de-Paix':                      { longitude: -72.8357, latitude: 19.9349 },
  'Saint-Louis-du-Nord':               { longitude: -72.7211, latitude: 19.9367 },
  'Jean-Rabel':                        { longitude: -73.1855, latitude: 19.8479 },
  'Môle-Saint-Nicolas':                { longitude: -73.3713, latitude: 19.8003 },
  'Bassin-Bleu':                       { longitude: -73.0837, latitude: 19.7273 },
  'Chansolme':                         { longitude: -72.9547, latitude: 19.9864 },
  'Bombardopolis':                     { longitude: -73.3600, latitude: 19.7177 },
  // Ouest
  'Port-au-Prince':                    { longitude: -72.3386, latitude: 18.5392 },
  'Carrefour':                         { longitude: -72.4019, latitude: 18.5317 },
  'Delmas':                            { longitude: -72.3094, latitude: 18.5609 },
  'Pétion-Ville':                      { longitude: -72.2845, latitude: 18.5121 },
  'Cité Soleil':                       { longitude: -72.3408, latitude: 18.5725 },
  'Tabarre':                           { longitude: -72.2827, latitude: 18.5711 },
  'Croix-des-Bouquets':                { longitude: -72.2157, latitude: 18.5780 },
  'Léogâne':                           { longitude: -72.6327, latitude: 18.5120 },
  'Petit-Goâve':                       { longitude: -72.8668, latitude: 18.4296 },
  'Kenscoff':                          { longitude: -72.2648, latitude: 18.4575 },
  'Gressier':                          { longitude: -72.5221, latitude: 18.5024 },
  'Cabaret':                           { longitude: -72.4333, latitude: 18.6878 },
  'Arcahaie':                          { longitude: -72.5274, latitude: 18.7711 },
  'Grand-Goâve':                       { longitude: -72.7590, latitude: 18.4327 },
  // Sud
  'Les Cayes':                         { longitude: -73.7480, latitude: 18.1937 },
  'Port-Salut':                        { longitude: -73.9226, latitude: 18.1122 },
  'Aquin':                             { longitude: -73.2826, latitude: 18.2809 },
  'Coteaux':                           { longitude: -74.0299, latitude: 18.1399 },
  'Camp-Perrin':                       { longitude: -73.5657, latitude: 18.2993 },
  'Torbeck':                           { longitude: -73.8196, latitude: 18.1594 },
  'Chantal':                           { longitude: -73.9167, latitude: 18.2667 },
  'Maniche':                           { longitude: -73.7000, latitude: 18.2833 },
  'Roche-à-Bateau':                    { longitude: -74.0500, latitude: 18.2000 },
  // Sud-Est
  'Jacmel':                            { longitude: -72.5350, latitude: 18.2340 },
  'Bainet':                            { longitude: -72.8200, latitude: 18.2150 },
  'Belle-Anse':                        { longitude: -72.0628, latitude: 18.2334 },
  'Marigot':                           { longitude: -72.3210, latitude: 18.2340 },
  'Thiotte':                           { longitude: -71.8627, latitude: 18.3401 },
  'Cayes-Jacmel':                      { longitude: -72.6281, latitude: 18.2149 },
  'La Vallée-de-Jacmel':               { longitude: -72.4167, latitude: 18.2000 },
  'Anse-à-Pitres':                     { longitude: -71.7558, latitude: 18.0550 },
};
