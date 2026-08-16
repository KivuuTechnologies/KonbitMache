import Link from 'next/link';
import { Leaf, MapPin, Sprout } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { translations } from '@/shared/i18n/translations';
import { MarketplaceStats } from '@/features/marketplace/components/MarketplaceStats';
import type { Locale } from '@/i18n/config';

interface AuthPageShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  locale: Locale;
}

export async function AuthPageShell({ title, description, children, locale }: AuthPageShellProps) {
  const t = translations[locale];

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-background">

      {/* Left panel - desktop only */}
      <div className="relative hidden lg:flex lg:w-[52%] lg:flex-col lg:justify-between bg-[#0f1a0d] px-12 py-10 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{backgroundImage: "radial-gradient(circle at 20% 50%, #2e7d32 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c75228 0%, transparent 45%), radial-gradient(circle at 60% 80%, #b45309 0%, transparent 40%)"}}
        />

        {/* Logo */}
        <Link href={`/${locale}`} className="relative inline-flex items-center gap-2.5 text-xl font-extrabold text-white" aria-label={siteConfig.name}>
          <span className="rounded-xl bg-white/10 p-2">
            <Sprout className="h-5 w-5 text-[#81c784]" aria-hidden="true" />
          </span>
          {siteConfig.name}
        </Link>

        {/* Central content */}
        <div className="relative">
          <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold leading-[1.1] tracking-tight text-white">
            {t.hero.title}
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-white/60">
            {t.hero.subtitle}
          </p>
          <div className="mt-10">
            <MarketplaceStats copy={t} variant="dark" hideDepartments />
          </div>
        </div>

        {/* Left footer */}
        <div className="relative flex items-center gap-2 text-sm text-white/40">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>Haïti · {t.footer.help}</span>
          <Leaf className="ml-auto h-4 w-4 text-[#4caf50]" aria-hidden="true" />
        </div>
      </div>

      {/* Right panel - form with internal scroll */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Logo - mobile only */}
          <Link href={`/${locale}`} className="mb-6 inline-flex min-h-12 items-center gap-2 rounded-xl text-xl font-extrabold text-te focus:outline-none focus:ring-4 focus:ring-dlo/30 lg:hidden" aria-label={siteConfig.name}>
            <span className="rounded-xl bg-fey/10 p-2"><Sprout className="h-5 w-5" aria-hidden="true" /></span>
            {siteConfig.name}
          </Link>
          <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          <div className="mt-5">{children}</div>
        </div>
      </div>

    </main>
  );
}
