import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/shared/i18n/types';
import { SitePageLayout } from '@/features/site/components/SitePageLayout';
import { buildPageMetadata } from '@/shared/config/site';

const comingSoonCopy: Record<Locale, { title: string; subtitle: string }> = {
  ht: { title: 'Byento disponib', subtitle: 'Seksyon sa a pa disponib ankò. Nou ap travay pou bay ou pi bon eksperyans lan' },
  fr: { title: 'Bientôt disponible', subtitle: 'Cette section n\'est pas encore disponible. Nous travaillons pour vous offrir la meilleure expérience' },
  es: { title: 'Próximamente disponible', subtitle: 'Esta sección aún no está disponible. Estamos trabajando para ofrecerte la mejor experiencia' },
  en: { title: 'Coming soon', subtitle: 'This section is not available yet. We are working to bring you the best experience' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = comingSoonCopy[locale];
  return buildPageMetadata({
    title: copy.title,
    description: copy.subtitle,
    locale,
    path: '/blog',
  });
}

export default async function ComingSoonPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = comingSoonCopy[locale];

  return (
    <SitePageLayout locale={locale}>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-fey">KonbitMache</p>
        <h1 className="mt-2 text-[clamp(2rem,6vw,2.75rem)] font-extrabold tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{copy.subtitle}</p>
      </main>
    </SitePageLayout>
  );
}