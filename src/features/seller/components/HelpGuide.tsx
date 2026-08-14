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
      description: 'Pasos para publicar tu primer producto',
      isTour: true,
      tourWorkflow: 'publish',
      steps: [
        {
          title: 'Ir a tu panel',
          content: 'Después de iniciar sesión serás redirigido a tu panel principal',
          tip: 'Si es tu primera vez se mostrará un tour automático',
        },
        {
          title: 'Hacer clic en Publicar producto',
          content: 'Busca el botón verde en la parte superior de tu panel',
        },
        {
          title: 'Completar la información',
          content: 'Ingresa nombre, categoría, descripción, precio y cantidad',
          tip: 'Una buena descripción ayuda a que te contacten más rápido',
        },
        {
          title: 'Agregar fotos',
          content: 'Sube al menos 1 foto clara, puedes subir hasta 5',
          tip: 'Productos con fotos claras reciben el doble de contactos',
        },
        {
          title: 'Publicar',
          content: 'Revisa todo y hacer clic en Publicar',
        },
      ],
    },
    {
      id: 'edit',
      icon: Edit,
      title: t.seller.help.howToEditProduct,
      description: 'Modifica la información de tus productos',
      steps: [
        {
          title: 'Ir a Mis productos',
          content: 'Desde el menú lateral en escritorio o la barra inferior en móvil',
        },
        {
          title: 'Seleccionar el producto',
          content: 'Busca el producto y haz clic en Editar',
        },
        {
          title: 'Modificar campos',
          content: 'Cambia la información que necesites',
        },
        {
          title: 'Guardar',
          content: 'Haz clic en Guardar para aplicar los cambios',
        },
      ],
    },
    {
      id: 'price',
      icon: DollarSign,
      title: t.seller.help.howToChangePrice,
      description: 'Actualiza el precio de tus productos',
      steps: [
        {
          title: 'Acceder al producto',
          content: 'Ve a Mis productos, busca el producto y haz clic en Editar',
        },
        {
          title: 'Modificar el precio',
          content: 'En la sección Precio ingresa el nuevo valor en HTG',
        },
        {
          title: 'Guardar',
          content: 'Haz clic en Guardar, el cambio se refleja inmediatamente',
          tip: 'Ajusta precios según la temporada o disponibilidad',
        },
      ],
    },
    {
      id: 'pause',
      icon: Package,
      title: 'Pausar o activar un producto',
      description: 'Controla la visibilidad de tus productos',
      isTour: true,
      tourWorkflow: 'products',
      steps: [
        {
          title: 'Ir a Mis productos',
          content: 'Accede a la lista desde el menú',
        },
        {
          title: 'Cambiar estado',
          content: 'Usa Pausar para ocultar o Activar para mostrar',
          tip: 'Los productos pausados no aparecen pero no se eliminan',
        },
        {
          title: 'Marcar como agotado',
          content: 'Si se vendió completamente márcalo como Agotado',
        },
      ],
    },
    {
      id: 'phone',
      icon: Phone,
      title: t.seller.help.howToChangePhone,
      description: 'Actualiza tu teléfono y WhatsApp',
      steps: [
        {
          title: 'Ir a Perfil',
          content: 'Desde el menú lateral o la barra inferior',
        },
        {
          title: 'Editar contacto',
          content: 'Actualiza tu teléfono y/o WhatsApp',
          tip: 'Asegúrate que el WhatsApp tenga el código de país +509',
        },
        {
          title: 'Guardar',
          content: 'Haz clic en Guardar para actualizar',
        },
      ],
    },
    {
      id: 'language',
      icon: Globe,
      title: t.seller.help.howToChangeLanguage,
      description: 'Cambia el idioma de la plataforma',
      isTour: true,
      tourWorkflow: 'settings',
      steps: [
        {
          title: 'Ir a Configuración',
          content: 'Desde el menú lateral haz clic en Configuración',
        },
        {
          title: 'Seleccionar idioma',
          content: 'Elige entre Kreyòl, Français, Español o English',
          tip: 'También puedes cambiarlo desde la página principal',
        },
        {
          title: 'Aplicar',
          content: 'El cambio se aplica inmediatamente',
        },
      ],
    },
    {
      id: 'support',
      icon: MessageCircle,
      title: t.seller.help.howToContactSupport,
      description: 'Contacta al equipo de soporte',
      steps: [
        {
          title: 'Problemas con tu cuenta',
          content: 'Si tienes problemas para iniciar sesión o publicar escribe a soporte',
        },
        {
          title: 'Información necesaria',
          content: 'Incluye tu nombre de usuario, descripción del problema y capturas',
          tip: 'Más detalle = respuesta más rápida',
        },
        {
          title: 'Canales',
          content: 'Contacta por WhatsApp o correo en la sección Contacto del sitio',
        },
      ],
    },
    {
      id: 'profile',
      icon: User,
      title: 'Completar tu perfil',
      description: 'Configura tu perfil para generar confianza',
      isTour: true,
      tourWorkflow: 'profile',
      steps: [
        {
          title: 'Importancia del perfil',
          content: 'Un perfil completo genera más confianza y aumenta ventas',
        },
        {
          title: 'Tipos de vendedor',
          content: 'Puedes ser Agricultor, Cooperativa o Empresa',
        },
        {
          title: 'Ubicación',
          content: 'Selecciona tu departamento y comuna',
          tip: 'Los compradores filtran por departamento',
        },
        {
          title: 'Foto',
          content: 'Sube una foto tuya o de tu negocio',
        },
      ],
    },
    {
      id: 'dashboard',
      icon: Settings,
      title: 'Entender tu panel',
      description: 'Conoce las secciones del dashboard',
      steps: [
        {
          title: 'Resumen',
          content: 'La página principal muestra productos activos, vistas y contactos',
        },
        {
          title: 'Mis productos',
          content: 'Ver, editar, pausar o eliminar productos',
        },
        {
          title: 'Notificaciones',
          content: 'Alertas cuando alguien ve tu producto o te contacta',
        },
        {
          title: 'Perfil',
          content: 'Gestiona tu información personal y ubicación',
        },
        {
          title: 'Configuración',
          content: 'Cambia idioma, tema y preferencias',
        },
        {
          title: 'Ayuda',
          content: 'Aquí encontrarás guías y podrás reiniciar el tour',
          tip: 'Puedes reiniciar el tour en cualquier momento',
        },
      ],
    },
    {
      id: 'buyers',
      icon: ShoppingBag,
      title: 'Cómo te contactan',
      description: 'Entiende el proceso de contacto',
      steps: [
        {
          title: 'WhatsApp',
          content: 'Los compradores te contactan por WhatsApp con un clic',
          tip: 'Asegúrate de tener tu WhatsApp actualizado',
        },
        {
          title: 'Llamada',
          content: 'También pueden llamarte por teléfono',
        },
        {
          title: 'Responder rápido',
          content: 'Responder rápido aumenta tus ventas',
        },
      ],
    },
    {
      id: 'moderation',
      icon: Shield,
      title: 'Moderación',
      description: 'Qué pasa si retiran un producto',
      steps: [
        {
          title: '¿Por qué se retira?',
          content: 'Por información falsa, fotos inapropiadas o precios abusivos',
        },
        {
          title: 'Notificación',
          content: 'Verás una alerta roja con la razón',
        },
        {
          title: 'Corregir',
          content: 'Corrige el problema y vuelve a publicar',
          tip: 'Lee bien las razones antes de volver a publicar',
        },
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
                  <span className="hidden sm:inline">Iniciar</span>
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
