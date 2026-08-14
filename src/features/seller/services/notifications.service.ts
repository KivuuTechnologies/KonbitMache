import { mockNotifications } from './mocks';
import type { Notification } from '../types';

// TODO - Replace mock with Supabase queries against a future `notifications`
// table - select-update where seller_id = auth-uid - or a realtime channel

let notifications: Notification[] = mockNotifications.map((n) => ({ ...n }));

export async function listNotifications(): Promise<Notification[]> {
  return notifications
    .map((n) => ({ ...n }))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function getUnreadCount(): Promise<number> {
  return notifications.filter((n) => !n.leido).length;
}

export async function markAsRead(id: string): Promise<void> {
  notifications = notifications.map((n) => (n.id === id ? { ...n, leido: true } : n));
}

export async function markAllAsRead(): Promise<void> {
  notifications = notifications.map((n) => ({ ...n, leido: true }));
}