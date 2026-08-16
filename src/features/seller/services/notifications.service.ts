import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { getAuthenticatedUserId } from '../../../../utils/supabase/auth-helpers';
import type { Notification } from '../types';

export async function listNotifications(): Promise<Notification[]> {
  if (!hasSupabaseEnvironment()) {
    // Return mock data in development without Supabase
    const { mockNotifications } = await import('./mocks');
    return mockNotifications.map((n) => ({ ...n }));
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  // Return empty list until notifications table is provisioned
  return [];
}

export async function getUnreadCount(): Promise<number> {
  if (!hasSupabaseEnvironment()) {
    return 0;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return 0;

  return 0;
}

export async function markAsRead(_id?: string): Promise<void> {
  if (!hasSupabaseEnvironment()) {
    return;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return;
}

export async function markAllAsRead(): Promise<void> {
  if (!hasSupabaseEnvironment()) {
    return;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return;
}