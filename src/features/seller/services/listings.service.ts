import type { Product, ProductFormData, ProductStatus } from '../types';

// Legacy mock service kept for backwards compatibility
// Real Supabase queries live in services/index.ts - productService
// and in actions/products.ts - Server Actions - Do not add new queries here

const products: Product[] = [];

export async function listProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getProduct(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: ProductFormData): Promise<Product> {
  const timestamp = new Date().toISOString();
  const product: Product = {
    id: `prod-${Math.random().toString(36).slice(2, 9)}`,
    seller_id: 'demo',
    source_locale: null,
    created_at: timestamp,
    updated_at: timestamp,
    name_translations: {},
    desc_translations: {},
    ...input,
    image_urls: input.image_urls ?? [],
  };
  products.push(product);
  return { ...product };
}

export async function updateProduct(id: string, input: ProductFormData): Promise<Product | null> {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: Product = {
    ...products[index],
    ...input,
    image_urls: input.image_urls ?? products[index].image_urls,
    updated_at: new Date().toISOString(),
  };
  products[index] = updated;
  return { ...updated };
}

export async function setProductStatus(id: string, status: ProductStatus): Promise<Product | null> {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], status, updated_at: new Date().toISOString() };
  return { ...products[index] };
}

export async function deleteProduct(id: string): Promise<void> {
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) products.splice(index, 1);
}