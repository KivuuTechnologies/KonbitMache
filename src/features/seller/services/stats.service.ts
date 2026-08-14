import { mockSellerStats } from './mocks';
import type { SellerStats } from '../types';

// TODO - Replace with a Supabase RPC - view that returns the counters
// or compute them from server-side aggregate queries
export async function getSellerStats(): Promise<SellerStats> {
  return { ...mockSellerStats };
}