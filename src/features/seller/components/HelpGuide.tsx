'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/i18n/useTranslations';
import {
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Edit,
  Globe,
  MessageCircle,
  Package,
  Phone,
  Play,
  PlusCircle,
  Settings,
  Shield,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { startWorkflowTour } from './WorkflowTour';

interface HelpGuideProps {
  locale: string;
}

type TourWorkflow = 'dashboard' | 'publish' | 'products' | 'profile' | 'settings';

interface GuideSection {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  isTour?: boolean;
  tourWorkflow?: TourWorkflow;
  steps: GuideStep[];
}

interface GuideStep {
  title: string;
  content: string;
  tip?: string;
}

export function HelpGuide({ locale }: HelpGuideProps) {
  const t = useTranslations();
  const g = t.seller.helpGuide;
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleStartTour = (workflow: TourWorkflow) => {
    const targetPath = workflow === 'publish'
      ? `/${locale}/dashboard/products/new`
      : `/${locale}/dashboard`;

    if (window.location.pathname === targetPath) {
      startWorkflowTour(workflow);
      return;
    }
    router.push(targetPath);
    setTimeout(() => startWorkflowTour(workflow), 800);
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const guides: GuideSection[] = [
    {
      id: 'tour',
      icon: Play,
      title: t.seller.help.tour,
      description: t.seller.help.tourDesc,
      isTour: true,
      tourWorkflow: 'dashboard',
      steps: [],
    },
    {
      id: 'publish',
      icon: PlusCircle,
      title: t.seller.help.howToPublish,
      description: t.seller.help.howToPublishDesc,
      steps: [
        { title: g.publish.step1Title, content: g.publish.step1Content, tip: g.publish.step1Tip },
        { title: g.publish.step2Title, content: g.publish.step2Content },
        { title: g.publish.step3Title, content: g.publish.step3Content, tip: g.publish.step3Tip },
        { title: g.publish.step4Title, content: g.publish.step4Content, tip: g.publish.step4Tip },
        { title: g.publish.step5Title, content: g.publish.step5Content },
      ],
    },
    {
      id: 'edit',
      icon: Edit,
      title: t.seller.help.howToEditProduct,
      description: t.seller.help.howToEditProductDesc,
      steps: [
        { title: g.edit.step1Title, content: g.edit.step1Content },
        { title: g.edit.step2Title, content: g.edit.step2Content },
        { title: g.edit.step3Title, content: g.edit.step3Content },
        { title: g.edit.step4Title, content: g.edit.step4Content },
      ],
    },
    {
      id: 'price',
      icon: DollarSign,
      title: t.seller.help.howToChangePrice,
      description: t.seller.help.howToChangePriceDesc,
      steps: [
        { title: g.price.step1Title, content: g.price.step1Content },
        { title: g.price.step2Title, content: g.price.step2Content },
        { title: g.price.step3Title, content: g.price.step3Content, tip: g.price.step3Tip },
      ],
    },
    {
      id: 'pause',
      icon: Package,
      title: t.seller.help.pauseTitle,
      description: t.seller.help.pauseDesc,
      steps: [
        { title: g.pause.step1Title, content: g.pause.step1Content },
        { title: g.pause.step2Title, content: g.pause.step2Content, tip: g.pause.step2Tip },
        { title: g.pause.step3Title, content: g.pause.step3Content },
      ],
    },
    {
      id: 'phone',
      icon: Phone,
      title: t.seller.help.howToChangePhone,
      description: t.seller.help.howToChangePhoneDesc,
      steps: [
        { title: g.phone.step1Title, content: g.phone.step1Content },
        { title: g.phone.step2Title, content: g.phone.step2Content, tip: g.phone.step2Tip },
        { title: g.phone.step3Title, content: g.phone.step3Content },
      ],
    },
    {
      id: 'language',
      icon: Globe,
      title: t.seller.help.howToChangeLanguage,
      description: t.seller.help.howToChangeLanguageDesc,
      steps: [
        { title: g.language.step1Title, content: g.language.step1Content },
        { title: g.language.step2Title, content: g.language.step2Content, tip: g.language.step2Tip },
        { title: g.language.step3Title, content: g.language.step3Content },
      ],
    },
    {
      id: 'support',
      icon: MessageCircle,
      title: t.seller.help.howToContactSupport,
      description: t.seller.help.howToContactSupportDesc,
      steps: [
        { title: g.support.step1Title, content: g.support.step1Content },
        { title: g.support.step2Title, content: g.support.step2Content, tip: g.support.step2Tip },
        { title: g.support.step3Title, content: g.support.step3Content },
      ],
    },
    {
      id: 'profile',
      icon: User,
      title: t.seller.help.profileTitle,
      description: t.seller.help.profileDesc,
      steps: [
        { title: g.profile.step1Title, content: g.profile.step1Content },
        { title: g.profile.step2Title, content: g.profile.step2Content },
        { title: g.profile.step3Title, content: g.profile.step3Content, tip: g.profile.step3Tip },
        { title: g.profile.step4Title, content: g.profile.step4Content },
      ],
    },
    {
      id: 'dashboard',
      icon: Settings,
      title: t.seller.help.dashboardTitle,
      description: t.seller.help.dashboardDesc,
      steps: [
        { title: g.dashboard.step1Title, content: g.dashboard.step1Content },
        { title: g.dashboard.step2Title, content: g.dashboard.step2Content },
        { title: g.dashboard.step3Title, content: g.dashboard.step3Content },
        { title: g.dashboard.step4Title, content: g.dashboard.step4Content },
        { title: g.dashboard.step5Title, content: g.dashboard.step5Content },
        { title: g.dashboard.step6Title, content: g.dashboard.step6Content, tip: g.dashboard.step6Tip },
      ],
    },
    {
      id: 'buyers',
      icon: ShoppingBag,
      title: t.seller.help.buyersTitle,
      description: t.seller.help.buyersDesc,
      steps: [
        { title: g.buyers.step1Title, content: g.buyers.step1Content, tip: g.buyers.step1Tip },
        { title: g.buyers.step2Title, content: g.buyers.step2Content },
        { title: g.buyers.step3Title, content: g.buyers.step3Content },
      ],
    },
    {
      id: 'moderation',
      icon: Shield,
      title: t.seller.help.moderationTitle,
      description: t.seller.help.moderationDesc,
      steps: [
        { title: g.moderation.step1Title, content: g.moderation.step1Content },
        { title: g.moderation.step2Title, content: g.moderation.step2Content },
        { title: g.moderation.step3Title, content: g.moderation.step3Content, tip: g.moderation.step3Tip },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {guides.map((guide) => {
        const isOpen = openSection === guide.id;
        const Icon = guide.icon;

        return (
          <div
            key={guide.id}
            className={`rounded-2xl border bg-surface transition ${
              guide.isTour
                ? 'border-accent/40 bg-accent/5'
                : isOpen
                  ? 'border-accent/30'
                  : 'border-border/50'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (guide.isTour && guide.tourWorkflow) {
                  handleStartTour(guide.tourWorkflow);
                } else {
                  toggleSection(guide.id);
                }
              }}
              className="flex w-full items-center gap-4 p-4 sm:p-5 text-left"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  guide.isTour ? 'bg-accent/15' : 'bg-muted/10'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${guide.isTour ? 'text-accent' : 'text-muted'}`}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold">{guide.title}</h3>
                <p className="mt-0.5 text-sm text-muted line-clamp-1">{guide.description}</p>
              </div>
              {guide.isTour ? (
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white dark:text-background">
                  <Play className="h-4 w-4 fill-white" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.seller.help.startButton}</span>
                </span>
              ) : (
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>

            {isOpen && !guide.isTour && (
              <div className="border-t border-border/50 px-4 pb-5 pt-4 sm:px-5">
                <ol className="space-y-5">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white dark:text-background">
                          {i + 1}
                        </div>
                        {i < guide.steps.length - 1 && (
                          <div className="mt-1 h-full w-px bg-border/50" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <h4 className="text-sm font-bold">{step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{step.content}</p>
                        {step.tip && (
                          <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-accent">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {step.tip}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
