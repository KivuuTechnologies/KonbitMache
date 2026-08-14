export const SUPPORTED_LOCALES = ['ht', 'fr', 'es', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type CategoryKey = 'fruits' | 'grains' | 'vegetables' | 'coffee' | 'livestock' | 'spices' | 'seeds' | 'tools' | 'agricultural_equipment' | 'machinery' | 'drones' | 'fertilizers' | 'irrigation' | 'agricultural_services';
/** Stable unit slugs stored in products.unit - never translated values*/
export type UnitSlug = 'kg' | 'lb' | 'unit' | 'bag' | 'box' | 'liter' | 'ton';
export type AuthValidationKey = 'required' | 'invalidEmail' | 'passwordMinLength' | 'passwordMismatch';
export type AuthErrorKey = 'invalidCredentials' | 'emailNotConfirmed' | 'emailAlreadyRegistered' | 'passwordRequirements' | 'rateLimited' | 'sessionExpired' | 'oauthUnavailable' | 'generic';

export interface AuthCopy {
  common: { email: string; password: string; fullName: string; confirmPassword: string; rememberMe: string; continueWithGoogle: string; backToLogin: string; loading: string; or: string; emailConfirmed: string };
  login: { title: string; description: string; submit: string; forgotPassword: string; noAccount: string; createAccount: string; success: string };
  register: { title: string; description: string; submit: string; hasAccount: string; signIn: string; confirmationTitle: string; confirmationDescription: string; success: string };
  forgotPassword: { title: string; description: string; submit: string; success: string };
  resetPassword: { title: string; description: string; submit: string; success: string };
  dashboard: { title: string; description: string; signOut: string; signedOut: string };
  validation: Record<AuthValidationKey, string>;
  errors: Record<AuthErrorKey, string>;
}

export interface MarketplaceCopy {
  nav: { marketplace: string; categories: string; cooperatives: string; farmers: string; signIn: string; register: string; publish: string; comingSoon: string; openMenu: string };
  hero: { eyebrow: string; title: string; subtitle: string; searchPlaceholder: string; department: string; category: string; allCategories: string; search: string };
  categories: Record<CategoryKey, string>;
  units: Record<UnitSlug, string>;
  unitsPlural: Record<UnitSlug, string>;
  filters: { title: string; category: string; department: string; price: string; availability: string; available: string; sellerType: string; farmer: string; cooperative: string; company: string; buyer: string; clear: string };
  sections: { featured: string; recent: string; wanted: string; farmers: string; featuredSellers: string; map: string; mapDescription: string; mapOffers: string; dominantOffer: string; priorityZone: string; agriculturalZones: string; stats: string; ctaTitle: string; ctaDescription: string };
  product: { available: string; published: string; whatsapp: string; call: string; callModalTitle: string; callModalHint: string; callNow: string; callModalClose: string; quantity: string; product: string; products: string; demo: string; share: string; save: string; viewAll: string; previousImage: string; nextImage: string; description: string; };
  stats: { farmers: string; buyers: string; cooperatives: string; companies: string; departments: string; interested: string; unavailable: string };
  footer: { marketplace: string; company: string; support: string; resources: string; about: string; contact: string; help: string; privacy: string; blog: string; language: string; rights: string; comingSoon: string; newsletter: { title: string; description: string; emailPlaceholder: string; subscribe: string; success: string; error: string } };
  common: { language: string; light: string; dark: string; useLight: string; useDark: string; skipToContent: string };
  site: { description: string };
  auth: AuthCopy;
  seller: SellerCopy;
}

export interface SellerCopy {
  dashboard: { 
    welcome: string; 
    publishProduct: string; 
    viewProducts: string; 
    noActivity: string; 
    activeProducts: string;
    views: string;
    contacts: string;
    interestedVisitors: string;
    activeListTitle: string;
    activityTitle: string;
    noActiveProducts: string;
    loadError: string;
    activityPublished: string;
    activityUpdated: string;
    activityPaused: string;
    activityWithdrawn: string;
    moderationAlertTitle: string;
    moderationAlertBody: string;
    moderationViewProducts: string;
  };
  products: { 
    title: string; 
    search: string; 
    filter: string; 
    all: string; 
    active: string; 
    paused: string; 
    soldOut: string; 
    quantity?: string; 
    create: string; 
    edit: string; 
    pause: string; 
    activate: string; 
    markSoldOut: string; 
    delete: string; 
    noProducts: string; 
    publishFirst: string; 
    createFirst: string; 
  };
  productForm: { 
    create: string; 
    edit: string; 
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    name: string; 
    category: string; 
    price: string; 
    unit: string; 
    quantity: string; 
    photo: string; 
    status: string; 
    description: string; 
    save: string; 
    cancel: string; 
    success: string; 
    error: string; 
  };
  profile: { 
    title: string; 
    account: string; 
    business: string; 
    contact: string; 
    fullName: string; 
    sellerType: string; 
    businessName: string; 
    department: string; 
    commune: string; 
    phone: string; 
    whatsapp: string; 
    saleFrequency: string; 
    save: string; 
    cancel: string; 
    success: string; 
    error: string; 
    type: { farmer: string; cooperative: string; company: string }; 
    status: { incomplete: string; active: string; suspended: string };
  };
  notifications: { 
    title: string; 
    all: string; 
    unread: string; 
    markRead: string; 
    markAllRead: string; 
    noNotifications: string; 
    types: { contacto: string; producto_vendido: string; perfil: string; sistema: string }; 
  };
  settings: { 
    title: string; 
    account: string; 
    language: string; 
    theme: string; 
    notifications: string; 
    security: string; 
    signOut: string; 
    save: string; 
    success: string; 
    error: string; 
  };
  help: { 
    title: string; 
    howToPublish: string; 
    howToPublishDesc: string;
    howToChangePrice: string; 
    howToChangePriceDesc: string;
    howToEditProduct: string; 
    howToEditProductDesc: string;
    howToContactSupport: string; 
    howToContactSupportDesc: string;
    howToChangePhone: string; 
    howToChangePhoneDesc: string;
    howToChangeLanguage: string; 
    howToChangeLanguageDesc: string;
    contactSupport: string; 
    // Label to trigger the dashboard tutorial
    tour: string;
    tourDesc: string;
  };
  // Dashboard tutorial translations and steps
  tour: {
    title: string;
    steps: {
      dashboardTitle: string;
      dashboardDesc: string;
      productsTitle: string;
      productsDesc: string;
      publishTitle: string;
      publishDesc: string;
      statsTitle: string;
      statsDesc: string;
      activityTitle: string;
      activityDesc: string;
      profileTitle: string;
      profileDesc: string;
      settingsTitle: string;
      settingsDesc: string;
      helpTitle: string;
      helpDesc: string;
      finalTitle: string;
      finalDesc: string;
    };
    buttons: {
      next: string;
      prev: string;
      done: string;
      close: string;
    };
  };
  sidebar: { 
    dashboard: string; 
    myProducts: string; 
    notifications: string; 
    profile: string; 
    settings: string; 
    help: string; 
    signOut: string;
  };
  onboarding: {
    stepOf: string;
    next: string;
    back: string;
    finish: string;
    saving: string;
    step1: {
      title: string;
      subtitle: string;
      farmer: { title: string; desc: string };
      cooperative: { title: string; desc: string };
      company: { title: string; desc: string };
      businessNameLabel: string;
      businessNameHelp: string;
      businessNamePlaceholder: string;
    };
    step2: {
      title: string;
      subtitle: string;
      departmentLabel: string;
      departmentPlaceholder: string;
      communeLabel: string;
      communePlaceholder: string;
    };
    step3: {
      title: string;
      subtitle: string;
      phoneLabel: string;
      phoneHelp: string;
      sameWhatsappLabel: string;
      whatsappLabel: string;
    };
    step4: {
      title: string;
      subtitle: string;
      uploadButton: string;
      changeButton: string;
      removeButton: string;
      optionalLabel: string;
      fileTooBig: string;
      invalidFileType: string;
    };
    errors: {
      saveStep: string;
      complete: string;
      upload: string;
    };
  };
  suspended: {
    title: string;
    description: string;
    contactSupport: string;
    signOut: string;
  };
}
