import type { CategoryKey } from '@/shared/i18n/types';

export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  location: string;
  department: string;
  farmer: string;
  posted: string;
  category: CategoryKey;
  image: string;
}

export const quickCategories: CategoryKey[] = ['fruits', 'grains', 'vegetables', 'coffee', 'livestock', 'spices'];
export const futureCategories: CategoryKey[] = ['seeds', 'tools', 'agricultural_equipment', 'machinery', 'drones', 'fertilizers', 'irrigation', 'agricultural_services'];

export const products: Product[] = [
  { id: 'mango-jean-rabel', name: 'Mango Francis', price: 'G 180 / kg', quantity: '40 kg', location: 'Jean-Rabel', department: 'Nord-Ouest', farmer: 'Marie Jean', posted: 'hace 2 días', category: 'fruits', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=80' },
  { id: 'coffee-kenscoff', name: 'Café de montaña', price: 'G 850 / kg', quantity: '25 kg', location: 'Kenscoff', department: 'Ouest', farmer: 'Jean-Baptiste Kafe', posted: 'hace 4 horas', category: 'coffee', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80' },
  { id: 'cassava-leogane', name: 'Yuca fresca', price: 'G 95 / kg', quantity: '60 kg', location: 'Léogâne', department: 'Ouest', farmer: 'Joseph Pierre', posted: 'hace 1 día', category: 'vegetables', image: 'https://images.unsplash.com/photo-1598514982205-f1f16cb3b561?auto=format&fit=crop&w=900&q=80' },
  { id: 'corn-hinche', name: 'Maíz amarillo', price: 'G 140 / kg', quantity: '100 kg', location: 'Hinche', department: 'Centre', farmer: 'Micheline Dor', posted: 'hace 3 días', category: 'grains', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80' },
  { id: 'plantain-jacmel', name: 'Plátano maduro', price: 'G 120 / mano', quantity: '30 manos', location: 'Jacmel', department: 'Sud-Est', farmer: 'Fritz Toussaint', posted: 'hace 5 horas', category: 'fruits', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80' },
  { id: 'avocado-petion-ville', name: 'Aguacate', price: 'G 75 / unidad', quantity: '80 unidades', location: 'Pétion-Ville', department: 'Ouest', farmer: 'Nadia Charles', posted: 'hace 1 día', category: 'fruits', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80' },
  { id: 'tomato-mirebalais', name: 'Tomate criollo', price: 'G 160 / kg', quantity: '35 kg', location: 'Mirebalais', department: 'Centre', farmer: 'René Saintil', posted: 'hace 6 horas', category: 'vegetables', image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0f?auto=format&fit=crop&w=900&q=80' },
  { id: 'goats-gonaives', name: 'Cabras criollas', price: 'G 18,000 / unidad', quantity: '4 animales', location: 'Gonaïves', department: 'Artibonite', farmer: 'Wilner Désir', posted: 'hace 2 días', category: 'livestock', image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=900&q=80' },
  { id: 'chickens-cayes', name: 'Gallinas ponedoras', price: 'G 1,200 / unidad', quantity: '12 animales', location: 'Les Cayes', department: 'Sud', farmer: 'Solange Louis', posted: 'hace 1 día', category: 'livestock', image: 'https://images.unsplash.com/photo-1569692231431-1275dd251c0a?auto=format&fit=crop&w=900&q=80' },
  { id: 'peppers-cap-haitien', name: 'Pimiento picante', price: 'G 250 / kg', quantity: '20 kg', location: 'Cap-Haïtien', department: 'Nord', farmer: 'André Michel', posted: 'hace 3 horas', category: 'spices', image: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=900&q=80' },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
