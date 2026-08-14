import type { Locale } from '@/shared/i18n/types';

/**
 * Admin panel copy, scoped to the feature but keyed by the SAME `Locale`
 * union used across the app. Consumed on the client through a `copy` prop
 * passed from the server page (`getAdminCopy(locale)`)
 */
export interface AdminCopy {
  sidebar: {
    title: string;
    back: string;
  };
  page: {
    title: string;
    subtitle: string;
    empty: string;
    noSelection: string;
    search: string;
    image: string;
  };
  product: {
    seller: string;
    category: string;
    price: string;
    quantity: string;
    unit: string;
    location: string;
    description: string;
    published: string;
    contact: string;
  };
  withdraw: {
    title: string;
    trigger: string;
    reasonLabel: string;
    reasonPlaceholder: string;
    reasonRequired: string;
    cancel: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    notAllowed: string;
  };
  common: { loading: string; unknown: string };
}

export const adminCopy: Record<Locale, AdminCopy> = {
  ht: {
    sidebar: { title: 'Moderasyon', back: 'Retounen nan pòtay' },
    page: {
      title: 'Moderasyon pwodui',
      subtitle: 'Revize pwodui yo epi retire moun ki pa respekte règ yo',
      empty: 'Pa gen pwodui aktif pou kounye a',
      noSelection: 'Chwazi yon pwodui nan lis la pou wè detay li yo',
      search: 'Chèche yon pwodui...',
      image: 'Foto',
    },
    product: {
      seller: 'Vandè',
      category: 'Kategori',
      price: 'Pri',
      quantity: 'Kantite',
      unit: 'Inite',
      location: 'Kote',
      description: 'Deskripsyon',
      published: 'Pibliye',
      contact: 'Kontak',
    },
    withdraw: {
      title: 'Retire pwodui sa a?',
      trigger: 'Retire piblikasyon',
      reasonLabel: 'Rezon (obligatwa)',
      reasonPlaceholder: 'Eksplike poukisa w ap retire pwodui sa a...',
      reasonRequired: 'Tanpri bay yon rezon',
      cancel: 'Anile',
      submit: 'Retire pwodui',
      submitting: 'Ap retire...',
      success: 'Pwodui retire avèk siksè',
      error: 'Nou pa t ka retire pwodui a. Eseye ankò',
      notAllowed: 'Ou pa gen pèmisyon pou fè aksyon sa a',
    },
    common: { loading: 'Ap chaje...', unknown: 'Enkoni' },
  },
  fr: {
    sidebar: { title: 'Modération', back: 'Retour au portail' },
    page: {
      title: 'Modération des produits',
      subtitle: 'Examinez les produits et retirez ceux qui ne respectent pas les règles',
      empty: 'Aucun produit actif pour le moment',
      noSelection: 'Sélectionnez un produit dans la liste pour voir ses détails',
      search: 'Rechercher un produit...',
      image: 'Photo',
    },
    product: {
      seller: 'Vendeur',
      category: 'Catégorie',
      price: 'Prix',
      quantity: 'Quantité',
      unit: 'Unité',
      location: 'Localisation',
      description: 'Description',
      published: 'Publié le',
      contact: 'Contact',
    },
    withdraw: {
      title: 'Retirer ce produit ?',
      trigger: 'Retirer la publication',
      reasonLabel: 'Motif (obligatoire)',
      reasonPlaceholder: 'Expliquez pourquoi vous retirez ce produit...',
      reasonRequired: 'Veuillez indiquer un motif',
      cancel: 'Annuler',
      submit: 'Retirer le produit',
      submitting: 'Retrait en cours...',
      success: 'Produit retiré avec succès',
      error: 'Impossible de retirer le produit. Veuillez réessayer',
      notAllowed: 'Vous n\'êtes pas autorisé à effectuer cette action',
    },
    common: { loading: 'Chargement...', unknown: 'Inconnu' },
  },
  es: {
    sidebar: { title: 'Moderación', back: 'Volver al portal' },
    page: {
      title: 'Moderación de productos',
      subtitle: 'Revisa los productos y retira los que no cumplan las normas',
      empty: 'No hay productos activos por ahora',
      noSelection: 'Selecciona un producto de la lista para ver sus detalles',
      search: 'Buscar un producto...',
      image: 'Foto',
    },
    product: {
      seller: 'Vendedor',
      category: 'Categoría',
      price: 'Precio',
      quantity: 'Cantidad',
      unit: 'Unidad',
      location: 'Ubicación',
      description: 'Descripción',
      published: 'Publicado el',
      contact: 'Contacto',
    },
    withdraw: {
      title: '¿Retirar este producto?',
      trigger: 'Retirar publicación',
      reasonLabel: 'Motivo (obligatorio)',
      reasonPlaceholder: 'Explica por qué retiras este producto...',
      reasonRequired: 'Por favor indica un motivo',
      cancel: 'Cancelar',
      submit: 'Retirar producto',
      submitting: 'Retirando...',
      success: 'Producto retirado correctamente',
      error: 'No se pudo retirar el producto. Inténtalo de nuevo',
      notAllowed: 'No tienes permiso para realizar esta acción',
    },
    common: { loading: 'Cargando...', unknown: 'Desconocido' },
  },
  en: {
    sidebar: { title: 'Moderation', back: 'Back to portal' },
    page: {
      title: 'Product moderation',
      subtitle: 'Review products and withdraw those that do not meet the rules',
      empty: 'No active products right now',
      noSelection: 'Select a product from the list to see its details',
      search: 'Search a product...',
      image: 'Photo',
    },
    product: {
      seller: 'Seller',
      category: 'Category',
      price: 'Price',
      quantity: 'Quantity',
      unit: 'Unit',
      location: 'Location',
      description: 'Description',
      published: 'Published on',
      contact: 'Contact',
    },
    withdraw: {
      title: 'Withdraw this product?',
      trigger: 'Withdraw listing',
      reasonLabel: 'Reason (required)',
      reasonPlaceholder: 'Explain why you are withdrawing this product...',
      reasonRequired: 'Please provide a reason',
      cancel: 'Cancel',
      submit: 'Withdraw product',
      submitting: 'Withdrawing...',
      success: 'Product withdrawn successfully',
      error: 'Could not withdraw the product. Please try again',
      notAllowed: 'You are not allowed to perform this action',
    },
    common: { loading: 'Loading...', unknown: 'Unknown' },
  },
};

export function getAdminCopy(locale: Locale): AdminCopy {
  return adminCopy[locale];
}
