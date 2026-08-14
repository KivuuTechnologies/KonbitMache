import { Bell, Check } from 'lucide-react';
import type { Notification } from '../types';
import { useTranslations } from '@/shared/i18n/useTranslations';

interface NotificationListProps {
  notifications: Notification[];
  locale: string;
}

export function NotificationList({ notifications, locale }: NotificationListProps) {
  void locale;
  const t = useTranslations();

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-muted p-8 text-center">
        <Bell className="mx-auto h-8 w-8 text-muted mb-3" aria-hidden="true" />
        <p className="text-base font-semibold text-muted">{t.seller.notifications.noNotifications}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-xl border p-4 ${notification.leido ? 'bg-surface-muted' : 'bg-surface border-dlo'}`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.leido ? 'bg-muted/10' : 'bg-dlo/10'}`}>
              <Bell className={`h-5 w-5 ${notification.leido ? 'text-muted' : 'text-dlo'}`} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-base font-semibold ${notification.leido ? 'text-muted' : 'text-foreground'}`}>
                {notification.titulo}
              </h3>
              <p className="mt-1 text-sm text-muted">{notification.contenido}</p>
              <p className="mt-2 text-xs text-muted">
                {new Date(notification.fecha).toLocaleDateString()}
              </p>
            </div>
            {!notification.leido && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dlo">
                <Check className="h-3 w-3 text-background" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
