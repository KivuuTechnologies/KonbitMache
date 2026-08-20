'use client';

import Script from 'next/script';
import type { Locale } from '@/shared/i18n/types';

const BUTTON_TEXT: Record<Locale, string> = {
  ht: 'Sipòte nou',
  fr: 'Soutenez-nous',
  es: 'Apóyanos',
  en: 'Support Us',
};

interface KofiFloatingWidgetProps {
  locale: Locale;
}

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (id: string, options: Record<string, string>) => void;
    };
  }
}

export function KofiFloatingWidget({ locale }: KofiFloatingWidgetProps) {
  const donateText = BUTTON_TEXT[locale] ?? BUTTON_TEXT.ht;

  const initKofi = () => {
    if (typeof window !== 'undefined' && window.kofiWidgetOverlay) {
      try {
        window.kofiWidgetOverlay.draw('konbitmache', {
          type: 'floating-chat',
          'floating-chat.donateButton.text': donateText,
          'floating-chat.donateButton.background-color': '#5cb85c',
          'floating-chat.donateButton.text-color': '#ffffff',
        });
      } catch {
        // Ignore duplicate init safely
      }
    }
  };

  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="lazyOnload"
      onLoad={initKofi}
    />
  );
}
