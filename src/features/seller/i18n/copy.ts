import type { Locale } from '@/shared/i18n/types';
import type {
  ProfileStatus,
  ProductStatus,
  NotificationType,
  SellerType,
} from '../types';

/**
 * Seller Portal copy, scoped to the feature but keyed by the SAME `Locale`
 * union used across the app. It is consumed on the client through
 * `useSellerCopy()` (reactive to `LanguageProvider`) and on the server through
 * `getSellerCopy(locale)`. This keeps seller strings co-located with the
 * feature while fully integrating with the existing i18n system
 */
export interface SellerCopy {
  nav: {
    portal: string;
    dashboard: string;
    products: string;
    publish: string;
    notifications: string;
    profile: string;
    settings: string;
    help: string;
    menu: string;
    signOut: string;
    backToMarket: string;
  };
  topbar: { openMenu: string; notifications: string; account: string };
  dashboard: {
    greeting: string;
    subtitle: string;
    statActive: string;
    statViews: string;
    statContacts: string;
    statUnread: string;
    quickActions: string;
    publishCta: string;
    manageProducts: string;
    recentProducts: string;
    recentActivity: string;
    viewAll: string;
    noProducts: string;
    noProductsCta: string;
    noActivity: string;
    profileIncompleteTitle: string;
    profileIncompleteBody: string;
    completeProfile: string;
  };
  products: {
    title: string;
    subtitle: string;
    new: string;
    search: string;
    filterAll: string;
    empty: string;
    emptyCta: string;
    noResults: string;
    views: string;
    contacts: string;
    edit: string;
    pause: string;
    activate: string;
    delete: string;
    deleteConfirm: string;
    deleted: string;
    statusChanged: string;
    count: string;
  };
  moderation: {
    badge: string;
    reasonLabel: string;
    dateLabel: string;
    note: string;
    deleteButton: string;
    deleteConfirm: string;
    deleted: string;
  };
  status: Record<ProductStatus, string>;
  units: Record<string, string>;
  frequencies: Record<string, string>;
  sellerTypes: Record<SellerType, string>;
  profileStatus: Record<ProfileStatus, string>;
  form: {
    newTitle: string;
    editTitle: string;
    newSubtitle: string;
    editSubtitle: string;
    sectionBasics: string;
    sectionPricing: string;
    sectionLocation: string;
    sectionMedia: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    category: string;
    chooseCategory: string;
    price: string;
    unit: string;
    chooseUnit: string;
    quantity: string;
    department: string;
    chooseDepartment: string;
    comuna: string;
    comunaPlaceholder: string;
    images: string;
    imagesHint: string;
    imageUrlPlaceholder: string;
    addImage: string;
    removeImage: string;
    changeImage: string;
    status: string;
    save: string;
    saving: string;
    cancel: string;
    publish: string;
    publishing: string;
    createdToast: string;
    updatedToast: string;
    demoNotice: string;
    /** Image uploader */
    imageOptional: string;
    imageInvalidType: string;
    imageTooBig: string;
    imageUploadError: string;
    /** Multi-image uploader */
    previousImage: string;
    nextImage: string;
    maxImagesReached: string;
    /** Step labels */
    stepCategory: string;
    stepDetails: string;
    stepPricing: string;
    stepPhoto: string;
    stepPreview: string;
    /** Preview step */
    previewTitle: string;
    previewEdit: string;
    previewPublish: string;
    /** Success screen */
    successTitle: string;
    successBody: string;
    viewProduct: string;
    myProducts: string;
    /** Error messages */
    errorNotAuthenticated: string;
    errorProfileNotFound: string;
    errorAccountSuspended: string;
    errorValidation: string;
    errorUpload: string;
    errorGeneric: string;
  };
  profile: {
    title: string;
    subtitle: string;
    personal: string;
    business: string;
    contact: string;
    fullName: string;
    sellerType: string;
    businessName: string;
    businessNamePlaceholder: string;
    department: string;
    comuna: string;
    phone: string;
    whatsapp: string;
    frequency: string;
    memberSince: string;
    save: string;
    saving: string;
    savedToast: string;
    statusLabel: string;
  };
  settings: {
    title: string;
    subtitle: string;
    appearance: string;
    appearanceHint: string;
    theme: string;
    light: string;
    dark: string;
    language: string;
    languageHint: string;
    notifications: string;
    notificationsHint: string;
    channelEmail: string;
    channelPush: string;
    channelWhatsapp: string;
    account: string;
    accountHint: string;
    dangerZone: string;
    deleteAccount: string;
    deleteAccountHint: string;
    comingSoon: string;
    savedToast: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    empty: string;
    markAllRead: string;
    markRead: string;
    allRead: string;
    unreadBadge: string;
    types: Record<NotificationType, string>;
  };
  help: {
    title: string;
    subtitle: string;
    faqTitle: string;
    contactTitle: string;
    contactBody: string;
    contactCta: string;
    faqs: { q: string; a: string }[];
  };
  time: { now: string; minutesAgo: string; hoursAgo: string; daysAgo: string };
  validation: {
    required: string;
    minLength: string;
    positiveNumber: string;
    invalidNumber: string;
  };
  common: { demoBadge: string; loading: string; optional: string; back: string };
}

export const sellerCopy: Record<Locale, SellerCopy> = {
  ht: {
    nav: { portal: 'Espas vandè', dashboard: 'Akèy', products: 'Pwodui', publish: 'Pibliye', notifications: 'Alèt', profile: 'Pwofil', settings: 'Paramèt', help: 'Èd', menu: 'Meni', signOut: 'Dekonekte', backToMarket: 'Retounen nan KonbitMache' },
    topbar: { openMenu: 'Louvri meni', notifications: 'Alèt yo', account: 'Kont mwen' },
    dashboard: { greeting: 'Bonjou, {name}', subtitle: 'Men yon apèsi sou aktivite ou', statActive: 'Pwodui aktif', statViews: 'Total vizit', statContacts: 'Kontak', statUnread: 'Alèt pa li', quickActions: 'Aksyon rapid', publishCta: 'Pibliye yon pwodui', manageProducts: 'Jere pwodui yo', recentProducts: 'Dènye pwodui', recentActivity: 'Dènye aktivite', viewAll: 'Wè tout', noProducts: 'Ou poko gen pwodui', noProductsCta: 'Pibliye premye pwodui ou', noActivity: 'Pa gen aktivite pou kounye a', profileIncompleteTitle: 'Konplete pwofil ou', profileIncompleteBody: 'Yon pwofil konplè bay achtè yo plis konfyans', completeProfile: 'Konplete pwofil la' },
    products: { title: 'Pwodui mwen yo', subtitle: 'Jere tout òf ou yo', new: 'Nouvo pwodui', search: 'Chèche yon pwodui...', filterAll: 'Tout eta', empty: 'Ou poko pibliye okenn pwodui', emptyCta: 'Pibliye premye pwodui ou', noResults: 'Pa gen pwodui ki matche', views: 'vizit', contacts: 'kontak', edit: 'Modifye', pause: 'Kanpe', activate: 'Aktive', delete: 'Efase', deleteConfirm: 'Èske ou sèten ou vle efase pwodui sa a?', deleted: 'Pwodui efase (demo)', statusChanged: 'Eta a chanje (demo)', count: '{count} pwodui' },
    moderation: { badge: 'Retire pa modération', reasonLabel: 'Rezon:', dateLabel: 'Dat:', note: 'Korije erè a epi repibliye l kòrèkteman', deleteButton: 'Efase pwodui a', deleteConfirm: 'Èske ou sèten ou vle efase pwodui sa a?', deleted: 'Pwodui efase' },
    status: { active: 'Aktif', paused: 'Kanpe', sold_out: 'Epiyze' },
    units: { kg: 'kg', lb: 'liv', unidad: 'inite', sac: 'sak', douzen: 'douzèn', mamit: 'mamit', galon: 'galon' },
    frequencies: { todo_el_ano: 'Tout ane a', por_temporadas: 'Pa sezon', segun_disponibilidad: 'Selon disponiblite' },
    sellerTypes: { farmer: 'Agrikiltè', cooperative: 'Koperativ', company: 'Antrepriz' },
    profileStatus: { incomplete: 'Enkonplè', active: 'Aktif', suspended: 'Sispann' },
    form: { newTitle: 'Nouvo pwodui', editTitle: 'Modifye pwodui', newSubtitle: 'Ranpli enfòmasyon òf ou an', editSubtitle: 'Mete enfòmasyon pwodui a ajou', sectionBasics: 'Enfòmasyon debaz', sectionPricing: 'Pri ak kantite', sectionLocation: 'Kote', sectionMedia: 'Foto', name: 'Non pwodui a', namePlaceholder: 'Egzanp: Mango Francis', description: 'Deskripsyon', descriptionPlaceholder: 'Dekri pwodui ou an...', category: 'Kategori', chooseCategory: 'Chwazi yon kategori', price: 'Pri (HTG)', unit: 'Inite', chooseUnit: 'Chwazi yon inite', quantity: 'Kantite disponib', department: 'Depatman', chooseDepartment: 'Chwazi yon depatman', comuna: 'Komin', comunaPlaceholder: 'Egzanp: Kenscoff', images: 'Foto', imagesHint: 'Ajoute lyen foto pwodui a', imageUrlPlaceholder: 'https://...', addImage: 'Ajoute foto', removeImage: 'Retire', changeImage: 'Chanje foto', status: 'Eta', save: 'Anrejistre', saving: 'Ap anrejistre...', cancel: 'Anile', publish: 'Pibliye pwodui', publishing: 'Ap pibliye...', createdToast: 'Pwodui pibliye avèk siksè', updatedToast: 'Pwodui mete ajou avèk siksè', demoNotice: 'Se yon demo. Done yo poko konekte ak baz done a', imageOptional: 'Foto (opsyonèl)', imageInvalidType: 'Fòma sa a pa aksepte. Sèvi ak JPG, PNG oswa WebP', imageTooBig: 'Foto a twò gwo. Limit: 2 MB', imageUploadError: 'Nou pa t ka voye foto a. Eseye ankò', previousImage: 'Foto anvan', nextImage: 'Foto apre', maxImagesReached: 'Ou ka mete jiska 5 foto', stepCategory: 'Kategori', stepDetails: 'Detay', stepPricing: 'Pri', stepPhoto: 'Foto', stepPreview: 'Revize', previewTitle: 'Revize òf ou an', previewEdit: 'Modifye', previewPublish: 'Pibliye kounye a', successTitle: 'Pwodui pibliye!', successBody: 'Òf ou an disponib kounye a pou tout achtè yo', viewProduct: 'Wè pwodui a', myProducts: 'Pwodui mwen yo', errorNotAuthenticated: 'Ou pa konekte. Tanpri konekte ankò', errorProfileNotFound: 'Pwofil ou pa jwenn. Kontakte sipò', errorAccountSuspended: 'Kont ou sispann. Kontakte sipò', errorValidation: 'Verifikasyon done yo echwe. Tcheke champ yo', errorUpload: 'Nou pa t ka voye foto a. Eseye ankò', errorGeneric: 'Yon erè rive. Tanpri eseye ankò' },
    profile: { title: 'Pwofil mwen', subtitle: 'Jere enfòmasyon piblik ou', personal: 'Enfòmasyon pèsonèl', business: 'Enfòmasyon biznis', contact: 'Kontak', fullName: 'Non konplè', sellerType: 'Kalite vandè', businessName: 'Non biznis la', businessNamePlaceholder: 'Egzanp: Koperativ Kafe', department: 'Depatman', comuna: 'Komin', phone: 'Telefòn', whatsapp: 'WhatsApp', frequency: 'Frekans vant', memberSince: 'Manm depi', save: 'Anrejistre chanjman', saving: 'Ap anrejistre...', savedToast: 'Pwofil mete ajou (demo)', statusLabel: 'Eta pwofil' },
    settings: { title: 'Paramèt', subtitle: 'Jere preferans kont ou', appearance: 'Aparans', appearanceHint: 'Chwazi kijan pòtay la parèt', theme: 'Tèm', light: 'Jou', dark: 'Lannwit', language: 'Lang', languageHint: 'Lang pòtay la', notifications: 'Alèt', notificationsHint: 'Chwazi ki jan ou vle resevwa alèt', channelEmail: 'Imèl', channelPush: 'Notifikasyon push', channelWhatsapp: 'WhatsApp', account: 'Kont', accountHint: 'Jere sesyon ou', dangerZone: 'Zòn danje', deleteAccount: 'Efase kont', deleteAccountHint: 'Aksyon sa a pa ka defèt', comingSoon: 'Byento', savedToast: 'Preferans anrejistre (demo)' },
    notifications: { title: 'Alèt', subtitle: 'Rete okouran sou aktivite ou', empty: 'Ou pa gen okenn alèt', markAllRead: 'Make tout kòm li', markRead: 'Make kòm li', allRead: 'Tout alèt li', unreadBadge: '{count} nouvo', types: { contacto: 'Mesaj', producto_vendido: 'Vant', sistema: 'Sistèm', perfil: 'Pwofil' } },
    help: { title: 'Sant èd', subtitle: 'Repons ak kesyon ki pi kouran yo', faqTitle: 'Kesyon moun poze souvan', contactTitle: 'Ou bezwen plis èd?', contactBody: 'Ekip nou an la pou ede ou', contactCta: 'Kontakte sipò', faqs: [ { q: 'Kijan pou m pibliye yon pwodui?', a: 'Ale nan Pwodui epi klike sou "Nouvo pwodui", ranpli fòm nan epi anrejistre' }, { q: 'Kijan achtè yo kontakte m?', a: 'Achtè yo ka rele ou oswa ekri ou sou WhatsApp ak nimewo ou mete nan pwofil ou' }, { q: 'Kijan pou m kanpe yon òf?', a: 'Nan lis pwodui yo, chwazi "Kanpe" sou pwodui a. Ou ka aktive li ankò lè ou vle' }, { q: 'Poukisa pou m konplete pwofil mwen?', a: 'Yon pwofil konplè bay achtè yo plis konfyans epi ede ou vann pi vit' } ] },
    time: { now: 'Kounye a', minutesAgo: 'Sa gen {count} minit', hoursAgo: 'Sa gen {count} èdtan', daysAgo: 'Sa gen {count} jou' },
    validation: { required: 'Chan sa a obligatwa', minLength: 'Twò kout', positiveNumber: 'Antre yon nonb ki pi gran pase zewo', invalidNumber: 'Antre yon nonb ki valab' },
    common: { demoBadge: 'Demo', loading: 'Ap chaje...', optional: 'opsyonèl', back: 'Retounen' },
  },
  fr: {
    nav: { portal: 'Espace vendeur', dashboard: 'Accueil', products: 'Produits', publish: 'Publier', notifications: 'Alertes', profile: 'Profil', settings: 'Paramètres', help: 'Aide', menu: 'Menu', signOut: 'Se déconnecter', backToMarket: 'Retour au marché' },
    topbar: { openMenu: 'Ouvrir le menu', notifications: 'Alertes', account: 'Mon compte' },
    dashboard: { greeting: 'Bonjour, {name}', subtitle: 'Voici un aperçu de votre activité', statActive: 'Produits actifs', statViews: 'Vues totales', statContacts: 'Contacts', statUnread: 'Alertes non lues', quickActions: 'Actions rapides', publishCta: 'Publier un produit', manageProducts: 'Gérer les produits', recentProducts: 'Produits récents', recentActivity: 'Activité récente', viewAll: 'Tout voir', noProducts: 'Vous n\'avez pas encore de produit', noProductsCta: 'Publier votre premier produit', noActivity: 'Aucune activité pour le moment', profileIncompleteTitle: 'Complétez votre profil', profileIncompleteBody: 'Un profil complet inspire davantage confiance aux acheteurs', completeProfile: 'Compléter le profil' },
    products: { title: 'Mes produits', subtitle: 'Gérez toutes vos offres', new: 'Nouveau produit', search: 'Rechercher un produit...', filterAll: 'Tous les statuts', empty: 'Vous n\'avez publié aucun produit', emptyCta: 'Publier votre premier produit', noResults: 'Aucun produit ne correspond', views: 'vues', contacts: 'contacts', edit: 'Modifier', pause: 'Mettre en pause', activate: 'Activer', delete: 'Supprimer', deleteConfirm: 'Voulez-vous vraiment supprimer ce produit ?', deleted: 'Produit supprimé (démo)', statusChanged: 'Statut mis à jour (démo)', count: '{count} produits' },
    moderation: { badge: 'Retiré par modération', reasonLabel: 'Motif :', dateLabel: 'Date :', note: 'Corrigez l\'erreur et republiez-le correctement', deleteButton: 'Supprimer le produit', deleteConfirm: 'Voulez-vous vraiment supprimer ce produit ?', deleted: 'Produit supprimé' },
    status: { active: 'Actif', paused: 'En pause', sold_out: 'Épuisé' },
    units: { kg: 'kg', lb: 'livre', unidad: 'unité', sac: 'sac', douzen: 'douzaine', mamit: 'marmite', galon: 'gallon' },
    frequencies: { todo_el_ano: 'Toute l\'année', por_temporadas: 'Par saison', segun_disponibilidad: 'Selon disponibilité' },
    sellerTypes: { farmer: 'Agriculteur', cooperative: 'Coopérative', company: 'Entreprise' },
    profileStatus: { incomplete: 'Incomplet', active: 'Actif', suspended: 'Suspendu' },
    form: { newTitle: 'Nouveau produit', editTitle: 'Modifier le produit', newSubtitle: 'Renseignez les informations de votre offre', editSubtitle: 'Mettez à jour les informations du produit', sectionBasics: 'Informations de base', sectionPricing: 'Prix et quantité', sectionLocation: 'Localisation', sectionMedia: 'Photos', name: 'Nom du produit', namePlaceholder: 'Ex. : Mangue Francis', description: 'Description', descriptionPlaceholder: 'Décrivez votre produit...', category: 'Catégorie', chooseCategory: 'Choisir une catégorie', price: 'Prix (HTG)', unit: 'Unité', chooseUnit: 'Choisir une unité', quantity: 'Quantité disponible', department: 'Département', chooseDepartment: 'Choisir un département', comuna: 'Commune', comunaPlaceholder: 'Ex. : Kenscoff', images: 'Photos', imagesHint: 'Ajoutez des liens vers les photos du produit', imageUrlPlaceholder: 'https://...', addImage: 'Ajouter une photo', removeImage: 'Retirer', changeImage: 'Changer la photo', status: 'Statut', save: 'Enregistrer', saving: 'Enregistrement...', cancel: 'Annuler', publish: 'Publier le produit', publishing: 'Publication...', createdToast: 'Produit publié avec succès', updatedToast: 'Produit mis à jour avec succès', demoNotice: 'Ceci est une démo. Les données ne sont pas encore reliées à la base de données', imageOptional: 'Photo (facultatif)', imageInvalidType: 'Format non autorisé. Utilisez JPG, PNG ou WebP', imageTooBig: 'La photo est trop volumineuse. Limite : 2 Mo', imageUploadError: 'Impossible d\'envoyer la photo. Veuillez réessayer', previousImage: 'Photo précédente', nextImage: 'Photo suivante', maxImagesReached: 'Maximum 5 photos autorisées', stepCategory: 'Catégorie', stepDetails: 'Détails', stepPricing: 'Prix', stepPhoto: 'Photo', stepPreview: 'Vérifier', previewTitle: 'Vérifiez votre offre', previewEdit: 'Modifier', previewPublish: 'Publier maintenant', successTitle: 'Produit publié !', successBody: 'Votre offre est désormais visible par tous les acheteurs', viewProduct: 'Voir le produit', myProducts: 'Mes produits', errorNotAuthenticated: 'Vous n\'êtes pas connecté. Reconnectez-vous', errorProfileNotFound: 'Profil introuvable. Contactez le support', errorAccountSuspended: 'Compte suspendu. Contactez le support', errorValidation: 'Données invalides. Vérifiez les champs', errorUpload: 'Impossible d\'envoyer la photo. Veuillez réessayer', errorGeneric: 'Une erreur est survenue. Veuillez réessayer' },
    profile: { title: 'Mon profil', subtitle: 'Gérez vos informations publiques', personal: 'Informations personnelles', business: 'Informations de l\'entreprise', contact: 'Contact', fullName: 'Nom complet', sellerType: 'Type de vendeur', businessName: 'Nom de l\'entreprise', businessNamePlaceholder: 'Ex. : Coopérative Café', department: 'Département', comuna: 'Commune', phone: 'Téléphone', whatsapp: 'WhatsApp', frequency: 'Fréquence de vente', memberSince: 'Membre depuis', save: 'Enregistrer les modifications', saving: 'Enregistrement...', savedToast: 'Profil mis à jour (démo)', statusLabel: 'Statut du profil' },
    settings: { title: 'Paramètres', subtitle: 'Gérez les préférences de votre compte', appearance: 'Apparence', appearanceHint: 'Choisissez l\'aspect du portail', theme: 'Thème', light: 'Clair', dark: 'Sombre', language: 'Langue', languageHint: 'Langue du portail', notifications: 'Alertes', notificationsHint: 'Choisissez comment recevoir les alertes', channelEmail: 'E-mail', channelPush: 'Notifications push', channelWhatsapp: 'WhatsApp', account: 'Compte', accountHint: 'Gérez votre session', dangerZone: 'Zone sensible', deleteAccount: 'Supprimer le compte', deleteAccountHint: 'Cette action est irréversible', comingSoon: 'Bientôt', savedToast: 'Préférences enregistrées (démo)' },
    notifications: { title: 'Alertes', subtitle: 'Restez informé de votre activité', empty: 'Vous n\'avez aucune alerte', markAllRead: 'Tout marquer comme lu', markRead: 'Marquer comme lu', allRead: 'Toutes les alertes sont lues', unreadBadge: '{count} nouvelles', types: { contacto: 'Message', producto_vendido: 'Vente', sistema: 'Système', perfil: 'Profil' } },
    help: { title: 'Centre d\'aide', subtitle: 'Réponses aux questions les plus fréquentes', faqTitle: 'Questions fréquentes', contactTitle: 'Besoin de plus d\'aide ?', contactBody: 'Notre équipe est là pour vous aider', contactCta: 'Contacter le support', faqs: [ { q: 'Comment publier un produit ?', a: 'Allez dans Produits, cliquez sur « Nouveau produit », remplissez le formulaire et enregistrez' }, { q: 'Comment les acheteurs me contactent-ils ?', a: 'Les acheteurs peuvent vous appeler ou vous écrire sur WhatsApp au numéro indiqué dans votre profil' }, { q: 'Comment mettre une offre en pause ?', a: 'Dans la liste des produits, choisissez « Mettre en pause ». Vous pourrez la réactiver à tout moment' }, { q: 'Pourquoi compléter mon profil ?', a: 'Un profil complet inspire confiance aux acheteurs et vous aide à vendre plus vite' } ] },
    time: { now: 'À l\'instant', minutesAgo: 'Il y a {count} min', hoursAgo: 'Il y a {count} h', daysAgo: 'Il y a {count} j' },
    validation: { required: 'Ce champ est obligatoire', minLength: 'Trop court', positiveNumber: 'Saisissez un nombre supérieur à zéro', invalidNumber: 'Saisissez un nombre valide' },
    common: { demoBadge: 'Démo', loading: 'Chargement...', optional: 'facultatif', back: 'Retour' },
  },
  es: {
    nav: { portal: 'Portal de vendedor', dashboard: 'Inicio', products: 'Productos', publish: 'Publicar', notifications: 'Alertas', profile: 'Perfil', settings: 'Configuración', help: 'Ayuda', menu: 'Menú', signOut: 'Cerrar sesión', backToMarket: 'Volver al marketplace' },
    topbar: { openMenu: 'Abrir menú', notifications: 'Alertas', account: 'Mi cuenta' },
    dashboard: { greeting: 'Hola, {name}', subtitle: 'Aquí tienes un resumen de tu actividad', statActive: 'Productos activos', statViews: 'Vistas totales', statContacts: 'Contactos', statUnread: 'Alertas sin leer', quickActions: 'Acciones rápidas', publishCta: 'Publicar un producto', manageProducts: 'Gestionar productos', recentProducts: 'Productos recientes', recentActivity: 'Actividad reciente', viewAll: 'Ver todo', noProducts: 'Aún no tienes productos', noProductsCta: 'Publica tu primer producto', noActivity: 'Sin actividad por ahora', profileIncompleteTitle: 'Completa tu perfil', profileIncompleteBody: 'Un perfil completo genera más confianza en los compradores', completeProfile: 'Completar perfil' },
    products: { title: 'Mis productos', subtitle: 'Gestiona todas tus ofertas', new: 'Nuevo producto', search: 'Buscar un producto...', filterAll: 'Todos los estados', empty: 'No has publicado ningún producto', emptyCta: 'Publica tu primer producto', noResults: 'Ningún producto coincide', views: 'vistas', contacts: 'contactos', edit: 'Editar', pause: 'Pausar', activate: 'Activar', delete: 'Eliminar', deleteConfirm: '¿Seguro que quieres eliminar este producto?', deleted: 'Producto eliminado (demo)', statusChanged: 'Estado actualizado (demo)', count: '{count} productos' },
    moderation: { badge: 'Retirado por moderación', reasonLabel: 'Motivo:', dateLabel: 'Fecha:', note: 'Corrige el error y republícalo correctamente', deleteButton: 'Eliminar producto', deleteConfirm: '¿Seguro que quieres eliminar este producto?', deleted: 'Producto eliminado' },
    status: { active: 'Activo', paused: 'Pausado', sold_out: 'Agotado' },
    units: { kg: 'kg', lb: 'libra', unidad: 'unidad', sac: 'saco', douzen: 'docena', mamit: 'marmita', galon: 'galón' },
    frequencies: { todo_el_ano: 'Todo el año', por_temporadas: 'Por temporadas', segun_disponibilidad: 'Según disponibilidad' },
    sellerTypes: { farmer: 'Agricultor', cooperative: 'Cooperativa', company: 'Empresa' },
    profileStatus: { incomplete: 'Incompleto', active: 'Activo', suspended: 'Suspendido' },
    form: { newTitle: 'Nuevo producto', editTitle: 'Editar producto', newSubtitle: 'Completa la información de tu oferta', editSubtitle: 'Actualiza la información del producto', sectionBasics: 'Información básica', sectionPricing: 'Precio y cantidad', sectionLocation: 'Ubicación', sectionMedia: 'Fotos', name: 'Nombre del producto', namePlaceholder: 'Ej.: Mango Francis', description: 'Descripción', descriptionPlaceholder: 'Describe tu producto...', category: 'Categoría', chooseCategory: 'Elige una categoría', price: 'Precio (HTG)', unit: 'Unidad', chooseUnit: 'Elige una unidad', quantity: 'Cantidad disponible', department: 'Departamento', chooseDepartment: 'Elige un departamento', comuna: 'Comuna', comunaPlaceholder: 'Ej.: Kenscoff', images: 'Fotos', imagesHint: 'Agrega enlaces a las fotos del producto', imageUrlPlaceholder: 'https://...', addImage: 'Agregar foto', removeImage: 'Quitar', changeImage: 'Cambiar foto', status: 'Estado', save: 'Guardar', saving: 'Guardando...', cancel: 'Cancelar', publish: 'Publicar producto', publishing: 'Publicando...', createdToast: 'Producto publicado correctamente', updatedToast: 'Producto actualizado correctamente', demoNotice: 'Esto es una demo. Los datos aún no están conectados a la base de datos', imageOptional: 'Foto (opcional)', imageInvalidType: 'Formato no permitido. Usa JPG, PNG o WebP', imageTooBig: 'La foto es demasiado grande. Límite: 2 MB', imageUploadError: 'No se pudo subir la foto. Inténtalo de nuevo', previousImage: 'Imagen anterior', nextImage: 'Imagen siguiente', maxImagesReached: 'Máximo 5 fotos permitidas', stepCategory: 'Categoría', stepDetails: 'Detalles', stepPricing: 'Precio', stepPhoto: 'Foto', stepPreview: 'Revisar', previewTitle: 'Revisa tu oferta', previewEdit: 'Editar', previewPublish: 'Publicar ahora', successTitle: '¡Producto publicado!', successBody: 'Tu oferta ya está disponible para todos los compradores', viewProduct: 'Ver producto', myProducts: 'Mis productos', errorNotAuthenticated: 'No estás autenticado. Inicia sesión de nuevo', errorProfileNotFound: 'Perfil no encontrado. Contacta soporte', errorAccountSuspended: 'Cuenta suspendida. Contacta soporte', errorValidation: 'Datos inválidos. Revisa los campos', errorUpload: 'No se pudo subir la foto. Inténtalo de nuevo', errorGeneric: 'Ocurrió un error. Inténtalo de nuevo' },
    profile: { title: 'Mi perfil', subtitle: 'Gestiona tu información pública', personal: 'Información personal', business: 'Información del negocio', contact: 'Contacto', fullName: 'Nombre completo', sellerType: 'Tipo de vendedor', businessName: 'Nombre del negocio', businessNamePlaceholder: 'Ej.: Cooperativa Café', department: 'Departamento', comuna: 'Comuna', phone: 'Teléfono', whatsapp: 'WhatsApp', frequency: 'Frecuencia de venta', memberSince: 'Miembro desde', save: 'Guardar cambios', saving: 'Guardando...', savedToast: 'Perfil actualizado (demo)', statusLabel: 'Estado del perfil' },
    settings: { title: 'Configuración', subtitle: 'Gestiona las preferencias de tu cuenta', appearance: 'Apariencia', appearanceHint: 'Elige cómo se ve el portal', theme: 'Tema', light: 'Claro', dark: 'Oscuro', language: 'Idioma', languageHint: 'Idioma del portal', notifications: 'Alertas', notificationsHint: 'Elige cómo recibir las alertas', channelEmail: 'Correo electrónico', channelPush: 'Notificaciones push', channelWhatsapp: 'WhatsApp', account: 'Cuenta', accountHint: 'Gestiona tu sesión', dangerZone: 'Zona sensible', deleteAccount: 'Eliminar cuenta', deleteAccountHint: 'Esta acción no se puede deshacer', comingSoon: 'Próximamente', savedToast: 'Preferencias guardadas (demo)' },
    notifications: { title: 'Alertas', subtitle: 'Mantente al día con tu actividad', empty: 'No tienes ninguna alerta', markAllRead: 'Marcar todo como leído', markRead: 'Marcar como leído', allRead: 'Todas las alertas están leídas', unreadBadge: '{count} nuevas', types: { contacto: 'Mensaje', producto_vendido: 'Vendido', sistema: 'Sistema', perfil: 'Perfil' } },
    help: { title: 'Centro de ayuda', subtitle: 'Respuestas a las preguntas más frecuentes', faqTitle: 'Preguntas frecuentes', contactTitle: '¿Necesitas más ayuda?', contactBody: 'Nuestro equipo está aquí para ayudarte', contactCta: 'Contactar soporte', faqs: [ { q: '¿Cómo publico un producto?', a: 'Ve a Productos, haz clic en «Nuevo producto», completa el formulario y guarda' }, { q: '¿Cómo me contactan los compradores?', a: 'Los compradores pueden llamarte o escribirte por WhatsApp al número indicado en tu perfil' }, { q: '¿Cómo pauso una oferta?', a: 'En la lista de productos, elige «Pausar». Podrás reactivarla cuando quieras' }, { q: '¿Por qué completar mi perfil?', a: 'Un perfil completo genera confianza en los compradores y te ayuda a vender más rápido' } ] },
    time: { now: 'Ahora mismo', minutesAgo: 'Hace {count} min', hoursAgo: 'Hace {count} h', daysAgo: 'Hace {count} d' },
    validation: { required: 'Este campo es obligatorio', minLength: 'Demasiado corto', positiveNumber: 'Ingresa un número mayor que cero', invalidNumber: 'Ingresa un número válido' },
    common: { demoBadge: 'Demo', loading: 'Cargando...', optional: 'opcional', back: 'Volver' },
  },
  en: {
    nav: { portal: 'Seller portal', dashboard: 'Home', products: 'Products', publish: 'Post', notifications: 'Alerts', profile: 'Profile', settings: 'Settings', help: 'Help', menu: 'Menu', signOut: 'Sign out', backToMarket: 'Back to marketplace' },
    topbar: { openMenu: 'Open menu', notifications: 'Alerts', account: 'My account' },
    dashboard: { greeting: 'Hello, {name}', subtitle: 'Here is an overview of your activity', statActive: 'Active products', statViews: 'Total views', statContacts: 'Contacts', statUnread: 'Unread alerts', quickActions: 'Quick actions', publishCta: 'Post a product', manageProducts: 'Manage products', recentProducts: 'Recent products', recentActivity: 'Recent activity', viewAll: 'View all', noProducts: 'You have no products yet', noProductsCta: 'Post your first product', noActivity: 'No activity yet', profileIncompleteTitle: 'Complete your profile', profileIncompleteBody: 'A complete profile builds more trust with buyers', completeProfile: 'Complete profile' },
    products: { title: 'My products', subtitle: 'Manage all your offers', new: 'New product', search: 'Search a product...', filterAll: 'All statuses', empty: 'You have not posted any products', emptyCta: 'Post your first product', noResults: 'No products match', views: 'views', contacts: 'contacts', edit: 'Edit', pause: 'Pause', activate: 'Activate', delete: 'Delete', deleteConfirm: 'Are you sure you want to delete this product?', deleted: 'Product deleted (demo)', statusChanged: 'Status updated (demo)', count: '{count} products' },
    moderation: { badge: 'Withdrawn by moderation', reasonLabel: 'Reason:', dateLabel: 'Date:', note: 'Fix the error and republish it correctly', deleteButton: 'Delete product', deleteConfirm: 'Are you sure you want to delete this product?', deleted: 'Product deleted' },
    status: { active: 'Active', paused: 'Paused', sold_out: 'Sold Out' },
    units: { kg: 'kg', lb: 'lb', unidad: 'unit', sac: 'sack', douzen: 'dozen', mamit: 'mamit', galon: 'gallon' },
    frequencies: { todo_el_ano: 'All year round', por_temporadas: 'Seasonal', segun_disponibilidad: 'Based on availability' },
    sellerTypes: { farmer: 'Farmer', cooperative: 'Cooperative', company: 'Business' },
    profileStatus: { incomplete: 'Incomplete', active: 'Active', suspended: 'Suspended' },
    form: { newTitle: 'New product', editTitle: 'Edit product', newSubtitle: 'Fill in the details of your offer', editSubtitle: 'Update the product details', sectionBasics: 'Basic information', sectionPricing: 'Price and quantity', sectionLocation: 'Location', sectionMedia: 'Photos', name: 'Product name', namePlaceholder: 'e.g. Francis Mango', description: 'Description', descriptionPlaceholder: 'Describe your product...', category: 'Category', chooseCategory: 'Choose a category', price: 'Price (HTG)', unit: 'Unit', chooseUnit: 'Choose a unit', quantity: 'Available quantity', department: 'Department', chooseDepartment: 'Choose a department', comuna: 'Commune', comunaPlaceholder: 'e.g. Kenscoff', images: 'Photos', imagesHint: 'Add links to the product photos', imageUrlPlaceholder: 'https://...', addImage: 'Add photo', removeImage: 'Remove', changeImage: 'Change photo', status: 'Status', save: 'Save', saving: 'Saving...', cancel: 'Cancel', publish: 'Publish product', publishing: 'Publishing...', createdToast: 'Product published successfully', updatedToast: 'Product updated successfully', demoNotice: 'This is a demo. Data is not connected to the database yet', imageOptional: 'Photo (optional)', imageInvalidType: 'File type not allowed. Use JPG, PNG, or WebP', imageTooBig: 'Photo is too large. Limit: 2 MB', imageUploadError: 'Could not upload the photo. Please try again', previousImage: 'Previous image', nextImage: 'Next image', maxImagesReached: 'Maximum 5 photos allowed', stepCategory: 'Category', stepDetails: 'Details', stepPricing: 'Price', stepPhoto: 'Photo', stepPreview: 'Review', previewTitle: 'Review your offer', previewEdit: 'Edit', previewPublish: 'Publish now', successTitle: 'Product published!', successBody: 'Your offer is now visible to all buyers', viewProduct: 'View product', myProducts: 'My products', errorNotAuthenticated: 'You are not signed in. Please sign in again', errorProfileNotFound: 'Profile not found. Contact support', errorAccountSuspended: 'Account suspended. Contact support', errorValidation: 'Invalid data. Please check the fields', errorUpload: 'Could not upload the photo. Please try again', errorGeneric: 'Something went wrong. Please try again' },
    profile: { title: 'My profile', subtitle: 'Manage your public information', personal: 'Personal information', business: 'Business information', contact: 'Contact', fullName: 'Full name', sellerType: 'Seller type', businessName: 'Business name', businessNamePlaceholder: 'e.g. Coffee Cooperative', department: 'Department', comuna: 'Commune', phone: 'Phone', whatsapp: 'WhatsApp', frequency: 'Selling frequency', memberSince: 'Member since', save: 'Save changes', saving: 'Saving...', savedToast: 'Profile updated (demo)', statusLabel: 'Profile status' },
    settings: { title: 'Settings', subtitle: 'Manage your account preferences', appearance: 'Appearance', appearanceHint: 'Choose how the portal looks', theme: 'Theme', light: 'Light', dark: 'Dark', language: 'Language', languageHint: 'Portal language', notifications: 'Alerts', notificationsHint: 'Choose how you receive alerts', channelEmail: 'Email', channelPush: 'Push notifications', channelWhatsapp: 'WhatsApp', account: 'Account', accountHint: 'Manage your session', dangerZone: 'Danger zone', deleteAccount: 'Delete account', deleteAccountHint: 'This action cannot be undone', comingSoon: 'Coming soon', savedToast: 'Preferences saved (demo)' },
    notifications: { title: 'Alerts', subtitle: 'Stay up to date with your activity', empty: 'You have no alerts', markAllRead: 'Mark all as read', markRead: 'Mark as read', allRead: 'All alerts are read', unreadBadge: '{count} new', types: { contacto: 'Message', producto_vendido: 'Sold', sistema: 'System', perfil: 'Profile' } },
    help: { title: 'Help center', subtitle: 'Answers to the most common questions', faqTitle: 'Frequently asked questions', contactTitle: 'Need more help?', contactBody: 'Our team is here to help you', contactCta: 'Contact support', faqs: [ { q: 'How do I post a product?', a: 'Go to Products, click "New product", fill in the form and save' }, { q: 'How do buyers contact me?', a: 'Buyers can call or message you on WhatsApp at the number set in your profile' }, { q: 'How do I pause an offer?', a: 'In the product list, choose "Pause". You can reactivate it anytime' }, { q: 'Why complete my profile?', a: 'A complete profile builds buyer trust and helps you sell faster' } ] },
    time: { now: 'Just now', minutesAgo: '{count} min ago', hoursAgo: '{count} h ago', daysAgo: '{count} d ago' },
    validation: { required: 'This field is required', minLength: 'Too short', positiveNumber: 'Enter a number greater than zero', invalidNumber: 'Enter a valid number' },
    common: { demoBadge: 'Demo', loading: 'Loading...', optional: 'optional', back: 'Back' },
  },
};

export function getSellerCopy(locale: Locale): SellerCopy {
  return sellerCopy[locale];
}
