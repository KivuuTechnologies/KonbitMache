export interface CommuneCoordinates {
  department: string;
  commune: string;
  latitude: number;
  longitude: number;
}

export const HAITI_COMMUNES_COORDINATES: CommuneCoordinates[] = [
  // Artibonite
  { department: 'Artibonite', commune: 'Gonaïves', latitude: 19.4537, longitude: -72.6907 },
  { department: 'Artibonite', commune: 'Saint-Marc', latitude: 19.1116, longitude: -72.7013 },
  { department: 'Artibonite', commune: 'Gros-Morne', latitude: 19.6694, longitude: -72.6813 },
  { department: 'Artibonite', commune: "Petite-Rivière-de-l'Artibonite", latitude: 19.1334, longitude: -72.5023 },
  { department: 'Artibonite', commune: 'Verrettes', latitude: 19.0555, longitude: -72.4672 },
  { department: 'Artibonite', commune: 'Dessalines', latitude: 19.2904, longitude: -72.5978 },
  { department: 'Artibonite', commune: 'Ennery', latitude: 19.5415, longitude: -72.5255 },
  { department: 'Artibonite', commune: 'Marmelade', latitude: 19.4762, longitude: -72.3588 },
  { department: 'Artibonite', commune: 'Anse-Rouge', latitude: 19.6317, longitude: -73.0977 },

  // Centre
  { department: 'Centre', commune: 'Hinche', latitude: 19.1510, longitude: -71.9479 },
  { department: 'Centre', commune: 'Mirebalais', latitude: 18.8374, longitude: -72.1079 },
  { department: 'Centre', commune: 'Lascahobas', latitude: 18.8324, longitude: -71.9346 },
  { department: 'Centre', commune: 'Boucan-Carré', latitude: 19.0168, longitude: -72.0618 },
  { department: 'Centre', commune: 'Belladère', latitude: 18.8598, longitude: -71.7736 },
  { department: 'Centre', commune: "Saut-d'Eau", latitude: 19.0657, longitude: -72.1857 },
  { department: 'Centre', commune: 'Cerca-la-Source', latitude: 19.1629, longitude: -71.8429 },
  { department: 'Centre', commune: 'Thomassique', latitude: 19.1918, longitude: -71.7938 },

  // Grand'Anse
  { department: "Grand'Anse", commune: 'Jérémie', latitude: 18.6503, longitude: -74.1183 },
  { department: "Grand'Anse", commune: "Anse-d'Hainault", latitude: 18.5009, longitude: -74.4568 },
  { department: "Grand'Anse", commune: 'Pestel', latitude: 18.5738, longitude: -73.9287 },
  { department: "Grand'Anse", commune: 'Dame-Marie', latitude: 18.5559, longitude: -74.4235 },
  { department: "Grand'Anse", commune: 'Moron', latitude: 18.7095, longitude: -73.9101 },
  { department: "Grand'Anse", commune: 'Corail', latitude: 18.5643, longitude: -73.8882 },
  { department: "Grand'Anse", commune: 'Chambellan', latitude: 18.5167, longitude: -74.1833 },

  // Nippes
  { department: 'Nippes', commune: 'Miragoâne', latitude: 18.4435, longitude: -73.0871 },
  { department: 'Nippes', commune: 'Anse-à-Veau', latitude: 18.4883, longitude: -73.3478 },
  { department: 'Nippes', commune: 'Petite-Rivière-de-Nippes', latitude: 18.4870, longitude: -73.1686 },
  { department: 'Nippes', commune: 'Baradères', latitude: 18.4949, longitude: -73.6530 },
  { department: 'Nippes', commune: 'Fond-des-Nègres', latitude: 18.2749, longitude: -73.0819 },
  { department: 'Nippes', commune: 'Arnaud', latitude: 18.4200, longitude: -73.1380 },
  { department: 'Nippes', commune: 'Paillant', latitude: 18.3484, longitude: -73.3216 },

  // Nord
  { department: 'Nord', commune: 'Cap-Haïtien', latitude: 19.7574, longitude: -72.2046 },
  { department: 'Nord', commune: 'Grande-Rivière-du-Nord', latitude: 19.5996, longitude: -72.1544 },
  { department: 'Nord', commune: 'Limonade', latitude: 19.7050, longitude: -72.0882 },
  { department: 'Nord', commune: 'Plaisance', latitude: 19.5955, longitude: -72.4675 },
  { department: 'Nord', commune: 'Saint-Raphaël', latitude: 19.5028, longitude: -72.2669 },
  { department: 'Nord', commune: 'Acul-du-Nord', latitude: 19.7143, longitude: -72.3058 },
  { department: 'Nord', commune: 'Milot', latitude: 19.6020, longitude: -72.2217 },
  { department: 'Nord', commune: 'Quartier-Morin', latitude: 19.6936, longitude: -72.1575 },

  // Nord-Est
  { department: 'Nord-Est', commune: 'Fort-Liberté', latitude: 19.6649, longitude: -71.8432 },
  { department: 'Nord-Est', commune: 'Ouanaminthe', latitude: 19.5530, longitude: -71.7283 },
  { department: 'Nord-Est', commune: 'Trou-du-Nord', latitude: 19.6166, longitude: -72.0069 },
  { department: 'Nord-Est', commune: 'Terrier-Rouge', latitude: 19.6436, longitude: -71.9040 },
  { department: 'Nord-Est', commune: 'Vallières', latitude: 19.4774, longitude: -71.9570 },
  { department: 'Nord-Est', commune: 'Caracol', latitude: 19.6940, longitude: -71.9291 },
  { department: 'Nord-Est', commune: 'Mont-Organisé', latitude: 19.4638, longitude: -71.8791 },

  // Nord-Ouest
  { department: 'Nord-Ouest', commune: 'Port-de-Paix', latitude: 19.9349, longitude: -72.8357 },
  { department: 'Nord-Ouest', commune: 'Saint-Louis-du-Nord', latitude: 19.9367, longitude: -72.7211 },
  { department: 'Nord-Ouest', commune: 'Jean-Rabel', latitude: 19.8479, longitude: -73.1855 },
  { department: 'Nord-Ouest', commune: 'Môle-Saint-Nicolas', latitude: 19.8003, longitude: -73.3713 },
  { department: 'Nord-Ouest', commune: 'Bassin-Bleu', latitude: 19.7273, longitude: -73.0837 },
  { department: 'Nord-Ouest', commune: 'Chansolme', latitude: 19.9864, longitude: -72.9547 },
  { department: 'Nord-Ouest', commune: 'Bombardopolis', latitude: 19.7177, longitude: -73.3600 },

  // Ouest
  { department: 'Ouest', commune: 'Port-au-Prince', latitude: 18.5392, longitude: -72.3386 },
  { department: 'Ouest', commune: 'Carrefour', latitude: 18.5317, longitude: -72.4019 },
  { department: 'Ouest', commune: 'Delmas', latitude: 18.5609, longitude: -72.3094 },
  { department: 'Ouest', commune: 'Pétion-Ville', latitude: 18.5121, longitude: -72.2845 },
  { department: 'Ouest', commune: 'Cité Soleil', latitude: 18.5725, longitude: -72.3408 },
  { department: 'Ouest', commune: 'Tabarre', latitude: 18.5711, longitude: -72.2827 },
  { department: 'Ouest', commune: 'Croix-des-Bouquets', latitude: 18.5780, longitude: -72.2157 },
  { department: 'Ouest', commune: 'Léogâne', latitude: 18.5120, longitude: -72.6327 },
  { department: 'Ouest', commune: 'Petit-Goâve', latitude: 18.4296, longitude: -72.8668 },
  { department: 'Ouest', commune: 'Kenscoff', latitude: 18.4575, longitude: -72.2648 },
  { department: 'Ouest', commune: 'Gressier', latitude: 18.5024, longitude: -72.5221 },
  { department: 'Ouest', commune: 'Cabaret', latitude: 18.6878, longitude: -72.4333 },
  { department: 'Ouest', commune: 'Arcahaie', latitude: 18.7711, longitude: -72.5274 },
  { department: 'Ouest', commune: 'Grand-Goâve', latitude: 18.4327, longitude: -72.7590 },

  // Sud
  { department: 'Sud', commune: 'Les Cayes', latitude: 18.1937, longitude: -73.7480 },
  { department: 'Sud', commune: 'Port-Salut', latitude: 18.1122, longitude: -73.9226 },
  { department: 'Sud', commune: 'Aquin', latitude: 18.2809, longitude: -73.2826 },
  { department: 'Sud', commune: 'Coteaux', latitude: 18.1399, longitude: -74.0299 },
  { department: 'Sud', commune: 'Camp-Perrin', latitude: 18.2993, longitude: -73.5657 },
  { department: 'Sud', commune: 'Torbeck', latitude: 18.1594, longitude: -73.8196 },
  { department: 'Sud', commune: 'Chantal', latitude: 18.2667, longitude: -73.9167 },
  { department: 'Sud', commune: 'Maniche', latitude: 18.2833, longitude: -73.7000 },
  { department: 'Sud', commune: 'Roche-à-Bateau', latitude: 18.2000, longitude: -74.0500 },

  // Sud-Est
  { department: 'Sud-Est', commune: 'Jacmel', latitude: 18.2340, longitude: -72.5350 },
  { department: 'Sud-Est', commune: 'Bainet', latitude: 18.2150, longitude: -72.8200 },
  { department: 'Sud-Est', commune: 'Belle-Anse', latitude: 18.2334, longitude: -72.0628 },
  { department: 'Sud-Est', commune: 'Marigot', latitude: 18.2340, longitude: -72.3210 },
  { department: 'Sud-Est', commune: 'Thiotte', latitude: 18.3401, longitude: -71.8627 },
  { department: 'Sud-Est', commune: 'Cayes-Jacmel', latitude: 18.2149, longitude: -72.6281 },
  { department: 'Sud-Est', commune: 'La Vallée-de-Jacmel', latitude: 18.2000, longitude: -72.4167 },
  { department: 'Sud-Est', commune: 'Anse-à-Pitres', latitude: 18.0550, longitude: -71.7558 },
];

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const LOOKUP_MAP = new Map<string, { latitude: number; longitude: number }>();

HAITI_COMMUNES_COORDINATES.forEach((item) => {
  const key = `${normalizeName(item.department)}_${normalizeName(item.commune)}`;
  LOOKUP_MAP.set(key, { latitude: item.latitude, longitude: item.longitude });
});

export function resolveCommuneCoordinates(
  department: string | null | undefined,
  commune: string | null | undefined
): { latitude: number; longitude: number } | null {
  if (!department || !commune) return null;
  const key = `${normalizeName(department)}_${normalizeName(commune)}`;
  const coords = LOOKUP_MAP.get(key);
  if (!coords) return null;
  if (
    typeof coords.latitude !== 'number' ||
    isNaN(coords.latitude) ||
    typeof coords.longitude !== 'number' ||
    isNaN(coords.longitude)
  ) {
    return null;
  }
  return coords;
}
