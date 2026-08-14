'use client';

import { BookOpen, DollarSign, Edit, MessageCircle, Phone, Globe, Play } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/i18n/useTranslations';

interface HelpCardsProps {
  locale: string;
}

export function HelpCards({ locale }: HelpCardsProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const dashboardPath = `/${locale}/dashboard`;

  const handleStartTour = () => {
    console.log('[HelpCards] handleStartTour', { pathname, dashboardPath });
    if (pathname === dashboardPath) {
      console.log('[HelpCards] dispatching start-dashboard-tour');
      window.dispatchEvent(new Event('start-dashboard-tour'));
      return;
    }

    console.log('[HelpCards] redirecting to', `${dashboardPath}?startTour=true`);
    router.push(`${dashboardPath}?startTour=true`);
  };

  const helpItems = [
    {
      icon: Play,
      title: t.seller.help.tour,
      description: t.seller.help.tourDesc,
      isTour: true,
    },
    {
      icon: BookOpen,
      title: t.seller.help.howToPublish,
      description: 'Pasos para publicar tu primer producto',
    },
    {
      icon: DollarSign,
      title: t.seller.help.howToChangePrice,
      description: 'Cómo actualizar el precio de tus productos',
    },
    {
      icon: Edit,
      title: t.seller.help.howToEditProduct,
      description: 'Modifica la información de tus productos',
    },
    {
      icon: MessageCircle,
      title: t.seller.help.howToContactSupport,
      description: 'Contacta al equipo de soporte',
    },
    {
      icon: Phone,
      title: t.seller.help.howToChangePhone,
      description: 'Actualiza tu número de teléfono',
    },
    {
      icon: Globe,
      title: t.seller.help.howToChangeLanguage,
      description: 'Cambia el idioma de la plataforma',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {helpItems.map((item) => (
        <div
          key={item.title}
          className={`rounded-2xl border bg-surface p-6 transition ${
            item.isTour ? 'border-dlo bg-dlo/5' : 'hover:border-dlo'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dlo/10 mb-4">
            <item.icon className="h-6 w-6 text-dlo" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-extrabold mb-2">{item.title}</h3>
          <p className="text-base text-muted mb-4">{item.description}</p>
          {item.isTour && (
            <button
              type="button"
              onClick={handleStartTour}
              className="inline-flex items-center gap-2 rounded-xl bg-te px-4 py-2 text-white dark:text-background font-bold transition hover:bg-te/90"
            >
              <Play className="h-4 w-4 fill-white" aria-hidden="true" />
              {t.seller.help.tour}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
