import type { Locale } from '@/shared/i18n/types';

export interface SiteSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface SitePageContent {
  title: string;
  subtitle: string;
  sections: SiteSection[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export type SitePageKey = 'categorias' | 'about' | 'contact' | 'help' | 'privacy';

export const sitePages: Record<SitePageKey, Record<Locale, SitePageContent>> = {
  categorias: {
    es: {
      title: 'Categorías de productos',
      subtitle: 'Explora todas las categorías disponibles en KonbitMache y encuentra productos de agricultores de toda Haití',
      sections: [
        {
          title: 'Alimentos y cosechas',
          paragraphs: ['Encuentra frutas, granos, verduras y más, directo del campo, con precio y cantidad reales de cada productor'],
          list: ['Frutas', 'Granos', 'Verduras', 'Café', 'Ganado', 'Especias', 'Semillas'],
        },
        {
          title: 'Equipos e insumos',
          paragraphs: ['Herramientas, maquinaria y suministros para trabajar mejor la tierra y cuidar cada cultivo'],
          list: ['Herramientas', 'Equipos agrícolas', 'Maquinaria', 'Drones', 'Fertilizantes', 'Riego'],
        },
        {
          title: 'Servicios agrícolas',
          paragraphs: ['Prestadores de servicios publican aquí preparación de suelos, siembra, cosecha y transporte'],
          list: ['Servicios agrícolas'],
        },
      ],
    },
    ht: {
      title: 'Kategori pwodui yo',
      subtitle: 'Eksplore tout kategori ki disponib sou KonbitMache epi jwenn pwodui peyizan nan tout Ayiti',
      sections: [
        {
          title: 'Manje ak rekòt',
          paragraphs: ['Jwenn fwi, grenn, legim ak plis ankò, dirèk soti nan jaden, ak pri ak kantite reyèl chak pwodiktè'],
          list: ['Fwi', 'Grenn', 'Legim', 'Kafe', 'Bèt', 'Epis', 'Semans'],
        },
        {
          title: 'Zouti ak materyèl',
          paragraphs: ['Zouti, machin ak materyèl pou travay tè a pi byen epi pran swen chak rekòt'],
          list: ['Zouti', 'Ekipman agrikòl', 'Machin', 'Dron', 'Angrè', 'Irigasyon'],
        },
        {
          title: 'Sèvis agrikòl',
          paragraphs: ['Prestatè sèvis pibliye isit la pou prepare tè, plante, rekòlte ak transpòte'],
          list: ['Sèvis agrikòl'],
        },
      ],
    },
    fr: {
      title: 'Catégories de produits',
      subtitle: 'Explorez toutes les catégories disponibles sur KonbitMache et trouvez des produits d’agriculteurs de tout Haïti',
      sections: [
        {
          title: 'Aliments et récoltes',
          paragraphs: ['Fruits, céréales, légumes et plus, directement du champ, avec le prix et la quantité réels de chaque producteur'],
          list: ['Fruits', 'Céréales', 'Légumes', 'Café', 'Bétail', 'Épices', 'Semences'],
        },
        {
          title: 'Équipements et intrants',
          paragraphs: ['Outils, machines et fournitures pour mieux travailler la terre et prendre soin de chaque culture'],
          list: ['Outils', 'Équipements agricoles', 'Machines', 'Drones', 'Fertilisants', 'Irrigation'],
        },
        {
          title: 'Services agricoles',
          paragraphs: ['Les prestataires de services publient ici la préparation des sols, la plantation, la récolte et le transport'],
          list: ['Services agricoles'],
        },
      ],
    },
    en: {
      title: 'Product categories',
      subtitle: 'Explore all categories available on KonbitMache and find products from farmers across Haiti',
      sections: [
        {
          title: 'Food and harvests',
          paragraphs: ['Fruits, grains, vegetables and more, straight from the field, with each producer’s real price and quantity'],
          list: ['Fruits', 'Grains', 'Vegetables', 'Coffee', 'Livestock', 'Spices', 'Seeds'],
        },
        {
          title: 'Equipment and inputs',
          paragraphs: ['Tools, machinery and supplies to work the land better and care for every crop'],
          list: ['Tools', 'Agricultural equipment', 'Machinery', 'Drones', 'Fertilizers', 'Irrigation'],
        },
        {
          title: 'Agricultural services',
          paragraphs: ['Service providers post soil preparation, planting, harvesting and transport here'],
          list: ['Agricultural services'],
        },
      ],
    },
  },
  about: {
    es: {
      title: 'Acerca de KonbitMache',
      subtitle: 'La plataforma que conecta a los agricultores de Haití con compradores de todo el país',
      sections: [
        {
          title: 'Nuestra misión',
          paragraphs: ['Creemos que el campo haitiano tiene un potencial enorme. Nuestra misión es dar a cada productor una vitrina digital para vender mejor y a cada comprador un acceso directo a productos frescos del agro haitiano'],
        },
        {
          title: 'Cómo funciona',
          paragraphs: ['Los productores publican sus ofertas con fotos, precios y cantidades reales. Los compradores buscan por categoría o departamento y se comunican directamente por teléfono o WhatsApp. Sin intermediarios'],
        },
        {
          title: 'Nuestra presencia',
          paragraphs: ['Estamos presentes en los diez departamentos de Haití, conectando agricultores y compradores en una sola red'],
        },
      ],
    },
    ht: {
      title: 'Konsènan KonbitMache',
      subtitle: 'Platfòm ki konekte peyizan Ayiti yo ak achtè nan tout peyi a',
      sections: [
        {
          title: 'Misyon nou',
          paragraphs: ['Nou kwè agrikilti ayisyen gen anpil potansyèl. Misyon nou se bay chak pwodiktè yon vitrin dijital pou yo vann pi byen, epi bay chak achtè aksè dirèk ak pwodui fre nan agrikilti ayisyen an'],
        },
        {
          title: 'Kijan li fonksyone',
          paragraphs: ['Pwodiktè pibliye òf yo ak foto, pri ak kantite reyèl. Achtè chèche pa kategori oswa depatman epi yo kominike dirèkteman pa telefòn oswa WhatsApp. San entèmedyè'],
        },
        {
          title: 'Prezans nou',
          paragraphs: ['Nou prezan nan dis depatman Ayiti yo, konekte peyizan ak achtè nan yon sèl rezo'],
        },
      ],
    },
    fr: {
      title: 'À propos de KonbitMache',
      subtitle: 'La plateforme qui connecte les agriculteurs d’Haïti aux acheteurs de tout le pays',
      sections: [
        {
          title: 'Notre mission',
          paragraphs: ['Nous croyons que le secteur agricole haïtien a un énorme potentiel. Notre mission est de donner à chaque producteur une vitrine numérique pour mieux vendre et à chaque acheteur un accès direct aux produits frais de l’agriculture haïtienne'],
        },
        {
          title: 'Comment ça marche',
          paragraphs: ['Les producteurs publient leurs offres avec photos, prix et quantités réelles. Les acheteurs recherchent par catégorie ou département et contactent directement par téléphone ou WhatsApp. Sans intermédiaires'],
        },
        {
          title: 'Notre présence',
          paragraphs: ['Nous sommes présents dans les dix départements d’Haïti, connectant agriculteurs et acheteurs dans un seul réseau'],
        },
      ],
    },
    en: {
      title: 'About KonbitMache',
      subtitle: 'The platform connecting Haiti’s farmers with buyers across the country',
      sections: [
        {
          title: 'Our mission',
          paragraphs: ['We believe Haitian agriculture has enormous potential. Our mission is to give every producer a digital storefront to sell better and every buyer direct access to fresh Haitian produce'],
        },
        {
          title: 'How it works',
          paragraphs: ['Producers publish their offers with real photos, prices and quantities. Buyers search by category or department and get in touch directly by phone or WhatsApp. No middlemen'],
        },
        {
          title: 'Our presence',
          paragraphs: ['We are present in all ten departments of Haiti, connecting farmers and buyers in one network'],
        },
      ],
    },
  },
  contact: {
    es: {
      title: 'Contacto',
      subtitle: 'Estamos para ayudarte. Elige el canal que prefieras y te responderemos lo antes posible',
      sections: [
        {
          title: 'Canales de atención',
          paragraphs: ['Puedes escribirnos o llamarnos por cualquiera de estos canales'],
          list: ['Correo: info@konbitmache.ht', 'WhatsApp: +509 0000 0000', 'Oficina: Puerto Príncipe, Haití'],
        },
        {
          title: 'Horario de atención',
          paragraphs: ['Lunes a viernes de 8:00 a 17:00 (hora de Haití). Respondemos los mensajes dentro de las 24 horas hábiles'],
        },
        {
          title: 'Soporte técnico',
          paragraphs: ['¿Tienes un problema con tu cuenta o tu publicación? Escríbenos y nuestro equipo te ayudará a resolverlo'],
        },
      ],
    },
    ht: {
      title: 'Kontak',
      subtitle: 'Nou la pou ede w. Chwazi kanal ou pi pito a epi n ap reponn w pi vit ke posib',
      sections: [
        {
          title: 'Kanal atansyon',
          paragraphs: ['Ou ka ekri nou oswa rele nou nan nenpòt nan kanal sa yo'],
          list: ['Imel: info@konbitmache.ht', 'WhatsApp: +509 0000 0000', 'Biwo: Pòtoprens, Ayiti'],
        },
        {
          title: 'Lè atansyon',
          paragraphs: ['Lendi rive vandredi, 8:00 rive 17:00 (lè Ayiti). Nou reponn mesaj yo nan 24 èdtan ouvrab'],
        },
        {
          title: 'Sipò teknik',
          paragraphs: ['Èske ou gen yon pwoblèm ak kont ou oswa piblikasyon ou? Ekri nou epi ekip nou ap ede w rezoud li'],
        },
      ],
    },
    fr: {
      title: 'Contact',
      subtitle: 'Nous sommes là pour vous aider. Choisissez le canal que vous préférez et nous vous répondrons au plus vite',
      sections: [
        {
          title: 'Canaux de contact',
          paragraphs: ['Vous pouvez nous écrire ou nous appeler sur l’un de ces canaux'],
          list: ['E-mail : info@konbitmache.ht', 'WhatsApp : +509 0000 0000', 'Bureau : Port-au-Prince, Haïti'],
        },
        {
          title: 'Horaires d’ouverture',
          paragraphs: ['Du lundi au vendredi, de 8h00 à 17h00 (heure d’Haïti). Nous répondons aux messages sous 24 heures ouvrables'],
        },
        {
          title: 'Support technique',
          paragraphs: ['Un problème avec votre compte ou votre publication ? Écrivez-nous et notre équipe vous aidera à le résoudre'],
        },
      ],
    },
    en: {
      title: 'Contact',
      subtitle: 'We are here to help. Choose the channel you prefer and we will get back to you as soon as possible',
      sections: [
        {
          title: 'Contact channels',
          paragraphs: ['You can reach us by email, phone or WhatsApp'],
          list: ['Email: info@konbitmache.ht', 'WhatsApp: +509 0000 0000', 'Office: Port-au-Prince, Haiti'],
        },
        {
          title: 'Business hours',
          paragraphs: ['Monday to Friday, 8:00 a.m. to 5:00 p.m. (Haiti time). We reply to messages within 24 business hours'],
        },
        {
          title: 'Technical support',
          paragraphs: ['Having trouble with your account or your listing? Write to us and our team will help you fix it'],
        },
      ],
    },
  },
  help: {
    es: {
      title: 'Centro de ayuda',
      subtitle: 'Respuestas a las preguntas más frecuentes para que aproveches KonbitMache al máximo',
      sections: [
        {
          title: '¿Cómo publico un producto?',
          paragraphs: ['Regístrate o inicia sesión, entra a tu panel y pulsa «Crear producto». Completa el nombre, la categoría, el precio, la cantidad, las fotos y la descripción, y publícalo'],
        },
        {
          title: '¿Cómo cambio el precio o la cantidad?',
          paragraphs: ['Desde tu panel, abre el producto, edita los campos que necesites y guarda los cambios. Se actualiza al instante'],
        },
        {
          title: '¿Cómo pauso o elimino una oferta?',
          paragraphs: ['En tu lista de productos puedes pausar una oferta cuando se acabe la temporada o eliminarla definitivamente'],
        },
        {
          title: '¿Cómo me contacta un comprador?',
          paragraphs: ['Los compradores se comunican directamente por el teléfono o WhatsApp que registraste en tu perfil. Mantén tus datos actualizados'],
        },
        {
          title: '¿Cómo cambio el idioma?',
          paragraphs: ['Usa el selector de idioma en la parte superior o visita la página de idioma'],
        },
      ],
    },
    ht: {
      title: 'Sant èd',
      subtitle: 'Repons pou kesyon yo poze pi souvan pou w pwofite KonbitMache nèt',
      sections: [
        {
          title: 'Kijan m pibliye yon pwodui?',
          paragraphs: ['Enskri w oswa konekte, antre nan panèl ou epi peze «Kreye pwodui». Konplete non an, kategori a, pri a, kantite a, foto yo ak deskripsyon an, epi pibliye li'],
        },
        {
          title: 'Kijan m chanje pri a oswa kantite a?',
          paragraphs: ['Soti nan panèl ou, louvri pwodui a, edite jaden ki nesesè yo epi anrejistre chanjman yo. Li mete ajou imedyatman'],
        },
        {
          title: 'Kijan m poz oswa efase yon òf?',
          paragraphs: ['Nan lis pwodui ou yo, ou ka poze yon òf lè sezon an fini oswa efase li definitivman'],
        },
        {
          title: 'Kijan yon achtè kontakte m?',
          paragraphs: ['Achtè kominike dirèkteman pa telefòn oswa WhatsApp ou enskri nan pwofil ou. Kenbe enfòmasyon ou ajou'],
        },
        {
          title: 'Kijan m chanje lang lan?',
          paragraphs: ['Sèvi ak selektè lang lan anlè a oswa vizite paj lang lan'],
        },
      ],
    },
    fr: {
      title: 'Centre d’aide',
      subtitle: 'Réponses aux questions les plus fréquentes pour tirer le meilleur de KonbitMache',
      sections: [
        {
          title: 'Comment publier un produit ?',
          paragraphs: ['Inscrivez-vous ou connectez-vous, allez dans votre tableau de bord et cliquez sur « Créer un produit ». Remplissez le nom, la catégorie, le prix, la quantité, les photos et la description, puis publiez'],
        },
        {
          title: 'Comment modifier le prix ou la quantité ?',
          paragraphs: ['Depuis votre tableau de bord, ouvrez le produit, modifiez les champs nécessaires et enregistrez. C’est mis à jour instantanément'],
        },
        {
          title: 'Comment mettre en pause ou supprimer une offre ?',
          paragraphs: ['Dans votre liste de produits, vous pouvez mettre une offre en pause en fin de saison ou la supprimer définitivement'],
        },
        {
          title: 'Comment un acheteur me contacte-t-il ?',
          paragraphs: ['Les acheteurs vous contactent directement par le téléphone ou WhatsApp enregistré sur votre profil. Gardez vos informations à jour'],
        },
        {
          title: 'Comment changer la langue ?',
          paragraphs: ['Utilisez le sélecteur de langue en haut de la page ou visitez la page de langue'],
        },
      ],
    },
    en: {
      title: 'Help center',
      subtitle: 'Answers to the most common questions so you can get the most out of KonbitMache',
      sections: [
        {
          title: 'How do I publish a product?',
          paragraphs: ['Register or log in, go to your dashboard and click “Create product”. Fill in the name, category, price, quantity, photos and description, then publish'],
        },
        {
          title: 'How do I change the price or quantity?',
          paragraphs: ['From your dashboard, open the product, edit the fields you need and save. It updates instantly'],
        },
        {
          title: 'How do I pause or delete an offer?',
          paragraphs: ['In your product list you can pause an offer when the season ends or delete it permanently'],
        },
        {
          title: 'How does a buyer contact me?',
          paragraphs: ['Buyers contact you directly through the phone or WhatsApp on your profile. Keep your details up to date'],
        },
        {
          title: 'How do I change the language?',
          paragraphs: ['Use the language selector at the top of the page or visit the language page'],
        },
      ],
    },
  },
  privacy: {
    es: {
      title: 'Política de privacidad',
      subtitle: 'En KonbitMache nos tomamos tu privacidad en serio. Esta política explica qué datos recopilamos y cómo los usamos',
      sections: [
        {
          title: 'Datos que recopilamos',
          paragraphs: ['Recopilamos la información que compartes al registrarte: nombre, correo, teléfono, ubicación y los productos que publicas. También datos de uso anónimos para mejorar la plataforma'],
        },
        {
          title: 'Cómo usamos los datos',
          paragraphs: ['Usamos tus datos para mostrar tus ofertas, conectar compradores y mejorar la experiencia. Nunca vendemos tu información personal a terceros'],
        },
        {
          title: 'Cookies',
          paragraphs: ['Usamos cookies para recordar tu idioma y tus preferencias de sesión'],
        },
        {
          title: 'Tus derechos',
          paragraphs: ['Puedes actualizar o eliminar tu información en cualquier momento desde tu perfil o contactándonos en info@konbitmache.ht'],
        },
      ],
    },
    ht: {
      title: 'Règleman konfidansyalite',
      subtitle: 'Sou KonbitMache nou pran konfidansyalite ou oserye. Politik sa a esplike kisa nou kolekte ak kijan nou sèvi ak li',
      sections: [
        {
          title: 'Done n ap kolekte',
          paragraphs: ['Nou kolekte enfòmasyon ou pataje lè w enskri: non, imel, telefòn, kote w ye ak pwodui w pibliye yo. Epitou done itilizasyon anonim pou amelyore platfòm lan'],
        },
        {
          title: 'Kijan nou sèvi ak done yo',
          paragraphs: ['Nou sèvi ak done ou pou montre òf ou yo, konekte achtè epi amelyore eksperyans lan. Nou pa janm vann enfòmasyon pèsonèl ou a twazyèm moun'],
        },
        {
          title: 'Cookies',
          paragraphs: ['Nou sèvi ak cookies pou sonje lang ou ak preferans sesyon ou'],
        },
        {
          title: 'Dwa ou yo',
          paragraphs: ['Ou ka mete enfòmasyon ou ajou oswa efase li nenpòt lè soti nan pwofil ou oswa lè w kontakte nou nan info@konbitmache.ht'],
        },
      ],
    },
    fr: {
      title: 'Politique de confidentialité',
      subtitle: 'Chez KonbitMache, votre vie privée compte. Cette politique explique quelles données nous collectons et comment nous les utilisons',
      sections: [
        {
          title: 'Données que nous collectons',
          paragraphs: ['Nous collectons les informations que vous partagez lors de votre inscription : nom, e-mail, téléphone, localisation et les produits que vous publiez. Ainsi que des données d’utilisation anonymes pour améliorer la plateforme'],
        },
        {
          title: 'Comment nous utilisons les données',
          paragraphs: ['Nous utilisons vos données pour afficher vos offres, connecter les acheteurs et améliorer l’expérience. Nous ne vendons jamais vos informations personnelles à des tiers'],
        },
        {
          title: 'Cookies',
          paragraphs: ['Nous utilisons des cookies pour mémoriser votre langue et vos préférences de session'],
        },
        {
          title: 'Vos droits',
          paragraphs: ['Vous pouvez mettre à jour ou supprimer vos informations à tout moment depuis votre profil ou en nous contactant à info@konbitmache.ht'],
        },
      ],
    },
    en: {
      title: 'Privacy policy',
      subtitle: 'At KonbitMache we take your privacy seriously. This policy explains what data we collect and how we use it',
      sections: [
        {
          title: 'Data we collect',
          paragraphs: ['We collect the information you share when you register: name, email, phone, location and the products you publish. We also collect anonymous usage data to improve the platform'],
        },
        {
          title: 'How we use the data',
          paragraphs: ['We use your data to display your offers, connect buyers and improve the experience. We never sell your personal information to third parties'],
        },
        {
          title: 'Cookies',
          paragraphs: ['We use cookies to remember your language and session preferences'],
        },
        {
          title: 'Your rights',
          paragraphs: ['You can update or delete your information at any time from your profile or by contacting us at info@konbitmache.ht'],
        },
      ],
    },
  },
};

export const blogPosts: Record<Locale, BlogPost[]> = {
  es: [
    { slug: 'vender-en-linea', title: 'Vender en línea: la nueva oportunidad del campo haitiano', excerpt: 'Cada vez más agricultores de Haití venden directo por internet. Te contamos cómo empezar y qué herramientas necesitas', date: '12 de julio de 2026', readTime: '4 min de lectura' },
    { slug: 'consejos-cosecha', title: '5 consejos para que tu cosecha se venda rápido', excerpt: 'Fotos claras, precios reales y descripciones honestas: pequeños detalles que marcan la diferencia en el marketplace', date: '28 de junio de 2026', readTime: '3 min de lectura' },
    { slug: 'konbit-trabajo-campesino', title: 'Konbit: la fuerza del trabajo agrícola comunitario', excerpt: 'La tradición de apoyarse entre agricultores permite cosechar mejor, reducir costos y fortalecer la economía local', date: '10 de junio de 2026', readTime: '5 min de lectura' },
  ],
  ht: [
    { slug: 'vender-en-linea', title: 'Vann an liy: nouvo opòtinite jaden ayisyen an', excerpt: 'Pli plis peyizan Ayiti ap vann dirèk sou entènèt. Nou di w kijan pou kòmanse ak ki zouti ou bezwen', date: '12 jiyè 2026', readTime: '4 min lekti' },
    { slug: 'consejos-cosecha', title: '5 konsèy pou rekòt ou vann byen vit', excerpt: 'Foto klè, pri reyèl ak deskripsyon onèt: ti detay ki fè yon gwo diferans nan mache a', date: '28 jen 2026', readTime: '3 min lekti' },
    { slug: 'konbit-trabajo-campesino', title: 'Konbit: fòs travay agrikòl nan kominote peyizan', excerpt: 'Tradisyon konbit la pèmèt peyizan yo travay ansanm, diminye depans epi devlope ekonomi lokal la', date: '10 jen 2026', readTime: '5 min lekti' },
  ],
  fr: [
    { slug: 'vender-en-linea', title: 'Vendre en ligne : la nouvelle opportunité du secteur agricole haïtien', excerpt: 'De plus en plus d’agriculteurs d’Haïti vendent directement en ligne. Comment commencer et quels outils vous faut-il', date: '12 juillet 2026', readTime: '4 min de lecture' },
    { slug: 'consejos-cosecha', title: '5 conseils pour vendre vite votre récolte', excerpt: 'Photos claires, prix réels et descriptions honnêtes : de petits détails qui font la différence sur la place de marché', date: '28 juin 2026', readTime: '3 min de lecture' },
    { slug: 'konbit-trabajo-campesino', title: 'Konbit : la force du travail agricole communautaire', excerpt: 'La tradition du konbit permet aux agriculteurs d’unir leurs forces, de réduire les coûts et de dynamiser l’économie locale', date: '10 juin 2026', readTime: '5 min de lecture' },
  ],
  en: [
    { slug: 'vender-en-linea', title: 'Selling online: a new opportunity for Haitian farming', excerpt: 'More and more Haitian farmers are selling directly online. Here is how to get started and what tools you need', date: 'July 12, 2026', readTime: '4 min read' },
    { slug: 'consejos-cosecha', title: '5 tips to sell your harvest fast', excerpt: 'Clear photos, real prices and honest descriptions: small details that make a big difference in the marketplace', date: 'June 28, 2026', readTime: '3 min read' },
    { slug: 'konbit-trabajo-campesino', title: 'Konbit: the power of community farming in Haiti', excerpt: 'The tradition of working together helps farmers cut costs, harvest efficiently, and strengthen the local rural economy', date: 'June 10, 2026', readTime: '5 min read' },
  ],
};
