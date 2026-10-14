import { IMAGES } from "@/lib/images";
import { HIGHLIGHT_HELP, page, section, type Field, type PageValues, type ScalarField } from "./schema";

/*
 * Contenido editable desde el panel (/admin/paginas). Los "defaults" son los textos actuales:
 * la web los usa mientras una sección no se haya guardado en la base de datos.
 * Convenciones: *asteriscos* = resaltado en verde; Enter = salto de línea.
 */

const ICON_LABEL: ScalarField[] = [
  { key: "icon", label: "Ícono", type: "icon" },
  { key: "label", label: "Texto", type: "textarea", rows: 2 },
];

/* ======================= AJUSTES GENERALES ======================= */

export const AJUSTES = page({
  title: "Ajustes generales",
  description: "Datos de contacto, redes, pie de página y textos para Google.",
  sections: {
    contacto: section({
      title: "Datos de contacto",
      description: "Se usan en toda la web: botones de WhatsApp, contacto, pie de página y documentos legales.",
      fields: [
        {
          key: "whatsapp",
          label: "WhatsApp de ventas",
          type: "text",
          help: "Solo números, con indicativo de país. Ej: 573225982715",
        },
        {
          key: "phones",
          label: "Teléfonos",
          type: "list",
          itemLabel: "Teléfono",
          min: 1,
          max: 5,
          help: "El primero es el principal (se muestra en contacto y en los documentos legales).",
          fields: [
            { key: "display", label: "Como se muestra", type: "text", help: "Ej: +57 322 598 2715" },
            { key: "tel", label: "Para llamar", type: "text", help: "Sin espacios. Ej: +573225982715" },
          ],
        },
        {
          key: "emails",
          label: "Correos",
          type: "list",
          itemLabel: "Correo",
          min: 1,
          max: 5,
          help: "El primero es el principal.",
          fields: [{ key: "email", label: "Correo", type: "text" }],
        },
        { key: "location", label: "Ubicación", type: "text" },
        { key: "schedule", label: "Horario de atención", type: "text" },
        { key: "instagramHandle", label: "Usuario de Instagram", type: "text", help: "Ej: @tuembalaje.sas" },
        { key: "instagramUrl", label: "Enlace de Instagram", type: "text" },
      ],
      defaults: {
        whatsapp: "573225982715",
        phones: [
          { display: "+57 322 598 2715", tel: "+573225982715" },
          { display: "+57 300 571 3284", tel: "+573005713284" },
          { display: "+57 301 768 8468", tel: "+573017688468" },
        ],
        emails: [{ email: "comercial@tuembalaje.com" }, { email: "gerencia@tuembalaje.com" }],
        location: "Colombia",
        schedule: "Lunes a viernes, 7:30 a.m. – 5:30 p.m.",
        instagramHandle: "@tuembalaje.sas",
        instagramUrl: "https://www.instagram.com/tuembalaje.sas",
      },
    }),
    empresa: section({
      title: "Datos legales de la empresa",
      description: "Aparecen en la política de privacidad y en los términos y condiciones.",
      fields: [
        { key: "legalName", label: "Razón social", type: "text" },
        { key: "nit", label: "NIT", type: "text", help: "Si lo dejas vacío no se muestra." },
        { key: "address", label: "Dirección de la sede", type: "text", help: "Si la dejas vacía se muestra la ubicación." },
        { key: "legalUpdated", label: "Fecha de actualización de los documentos legales", type: "text" },
      ],
      defaults: {
        legalName: "Tu Embalaje SAS",
        nit: "",
        address: "",
        legalUpdated: "13 de octubre de 2026",
      },
    }),
    pie: section({
      title: "Pie de página",
      fields: [
        { key: "description", label: "Descripción", type: "textarea", rows: 3 },
        { key: "tagline", label: "Lema", type: "text", help: "Separa las palabras con · (punto medio)." },
      ],
      defaults: {
        description: "Diseñamos y fabricamos embalajes en madera a tu medida: sostenibles, resistentes y listos para exportar.",
        tagline: "Calidad · Sostenibilidad · Confianza",
      },
    }),
    seo: section({
      title: "Google y redes (SEO)",
      description:
        "Título y descripción que muestra Google y la vista previa al compartir. Títulos de 50–60 caracteres y descripciones de 140–160.",
      fields: [
        { key: "homeTitle", label: "Inicio · título", type: "text", max: 70 },
        { key: "homeDescription", label: "Inicio · descripción", type: "textarea", rows: 2, max: 170 },
        { key: "productosTitle", label: "Productos · título", type: "text", max: 70 },
        { key: "productosDescription", label: "Productos · descripción", type: "textarea", rows: 2, max: 170 },
        { key: "nosotrosTitle", label: "Nosotros · título", type: "text", max: 70 },
        { key: "nosotrosDescription", label: "Nosotros · descripción", type: "textarea", rows: 2, max: 170 },
        { key: "contactoTitle", label: "Contacto · título", type: "text", max: 70 },
        { key: "contactoDescription", label: "Contacto · descripción", type: "textarea", rows: 2, max: 170 },
        { key: "cotizadorTitle", label: "Cotizador · título", type: "text", max: 70 },
        { key: "cotizadorDescription", label: "Cotizador · descripción", type: "textarea", rows: 2, max: 170 },
      ],
      defaults: {
        homeTitle: "Tu Embalaje | Embalajes en madera a tu medida",
        homeDescription:
          "Diseñamos y fabricamos embalajes en madera a tu medida: cajas, estibas, pallets y huacales con madera reforestada certificada NIMF 15, aptos para exportación. Envíos a toda Colombia.",
        productosTitle: "Cajas de madera, estibas y pallets a la medida",
        productosDescription:
          "Cajas de madera, estibas, pallets, huacales y embalajes especiales a la medida. Madera reforestada con certificación NIMF 15, apta para exportación.",
        nosotrosTitle: "Nosotros: fabricantes de embalajes en madera",
        nosotrosDescription:
          "Conoce a Tu Embalaje: diseñamos y fabricamos embalajes en madera a la medida, con madera certificada NIMF 15, servicio personalizado y compromiso ambiental.",
        contactoTitle: "Contacto y cotizaciones",
        contactoDescription:
          "Solicita tu asesoría gratis y cotiza cajas de madera, estibas, pallets y embalajes especiales a tu medida. Escríbenos por WhatsApp o llámanos.",
        cotizadorTitle: "Cotizador de estibas de madera",
        cotizadorDescription:
          "Cotiza tu estiba de madera en línea: ingresa medidas, tipo (listones o tacos) y ensamble, y recibe gratis una propuesta a medida en menos de 24 horas.",
      },
    }),
  },
});

/* ======================= INICIO ======================= */

export const INICIO = page({
  title: "Inicio",
  path: "/",
  sections: {
    hero: section({
      title: "Encabezado principal",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título (línea blanca)", type: "text" },
        { key: "highlight", label: "Título (línea verde)", type: "text" },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
        { key: "features", label: "Características", type: "list", itemLabel: "Característica", max: 6, fields: ICON_LABEL },
        { key: "cta", label: "Botón principal (WhatsApp)", type: "text" },
        { key: "cta2", label: "Botón secundario", type: "text" },
        { key: "script", label: "Frase manuscrita (escritorio)", type: "text" },
        { key: "image", label: "Imagen de fondo", type: "image" },
        { key: "imageAlt", label: "Descripción de la imagen", type: "text", help: "Para Google y lectores de pantalla." },
      ],
      defaults: {
        eyebrow: "Diseñamos y fabricamos",
        title: "Tu Embalaje",
        highlight: "a tu medida",
        text: "Soluciones sostenibles y de alta resistencia en madera, para que tus productos lleguen seguros a su destino.",
        features: [
          { icon: "leaf", label: "Materiales\nsostenibles" },
          { icon: "shield-check", label: "Alta\nresistencia" },
          { icon: "cog", label: "Diseño\npersonalizado" },
          { icon: "truck", label: "Transporte\ny exportación" },
        ],
        cta: "Solicita tu asesoría GRATIS",
        cta2: "Conoce nuestros productos",
        script: "Protegemos lo que te importa",
        image: IMAGES.heroBg,
        imageAlt: "Caja de madera en un bosque",
      },
    }),
    cifras: section({
      title: "Cifras de impacto",
      description: "Los números se animan al aparecer en pantalla.",
      fields: [
        {
          key: "items",
          label: "Cifras",
          type: "list",
          itemLabel: "Cifra",
          max: 6,
          fields: [
            { key: "icon", label: "Ícono", type: "icon" },
            { key: "value", label: "Valor", type: "number", step: 0.01 },
            { key: "decimals", label: "Decimales a mostrar", type: "number", min: 0 },
            { key: "label", label: "Descripción", type: "text" },
          ],
        },
      ],
      defaults: {
        items: [
          { icon: "tree-pine", value: 287, decimals: 0, label: "Árboles no talados" },
          { icon: "cloud", value: 258, decimals: 0, label: "Toneladas de CO₂ retenidas" },
          { icon: "wind", value: 33.87, decimals: 2, label: "Toneladas de Oxígeno generadas" },
          { icon: "trees", value: 0.26, decimals: 2, label: "Hectáreas de bosque preservadas" },
          { icon: "layers", value: 287.05, decimals: 2, label: "m³ de madera no desechada" },
        ],
      },
    }),
    nosotros: section({
      title: "Sobre nosotros",
      description: "Esta sección también aparece en la página Nosotros.",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título (1.ª línea)", type: "text" },
        { key: "title2", label: "Título (2.ª línea)", type: "text" },
        { key: "text", label: "Texto", type: "textarea", rows: 5 },
        { key: "button", label: "Botón", type: "text" },
        { key: "image", label: "Foto", type: "image" },
        { key: "imageAlt", label: "Descripción de la foto", type: "text" },
        { key: "points", label: "Puntos destacados", type: "list", itemLabel: "Punto", max: 6, fields: ICON_LABEL },
      ],
      defaults: {
        eyebrow: "Sobre nosotros",
        title: "Más que embalajes,",
        title2: "soluciones que protegen",
        text: "En Tu Embalaje combinamos experiencia, calidad y sostenibilidad para ofrecerte embalajes en madera diseñados a la medida de tus necesidades. Trabajamos con empresas de todos los sectores para garantizar que sus productos lleguen en perfectas condiciones, de forma segura y responsable con el medio ambiente.",
        button: "Conoce nuestra historia",
        image: IMAGES.aboutWorker,
        imageAlt: "Operario de Tu Embalaje trabajando con estibas de madera",
        points: [
          { icon: "cog", label: "Compromiso\ncon la calidad" },
          { icon: "leaf", label: "Madera certificada\ncon NIMF 15" },
          { icon: "cog", label: "Atención personalizada\nen cada proyecto" },
          { icon: "truck", label: "Entregas a nivel nacional\ne internacional" },
        ],
      },
    }),
    productos: section({
      title: "Productos destacados",
      description: "Los productos que aparecen aquí se eligen en Productos (marca «Destacado»).",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "textarea", rows: 2 },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
        { key: "button", label: "Botón", type: "text" },
      ],
      defaults: {
        eyebrow: "Nuestros productos y servicios",
        title: "Soluciones en madera para\ncada necesidad",
        text: "Fabricamos y diseñamos embalajes especializados según el tipo de producto, sector y destino. Desde cajas y estibas hasta soluciones industriales de gran formato.",
        button: "Ver todos nuestros productos",
      },
    }),
    proceso: section({
      title: "Nuestro proceso",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "textarea", rows: 2 },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
        { key: "button", label: "Botón", type: "text" },
        { key: "image", label: "Imagen de fondo", type: "image" },
        {
          key: "steps",
          label: "Pasos",
          type: "list",
          itemLabel: "Paso",
          max: 6,
          fields: [
            { key: "icon", label: "Ícono", type: "icon" },
            { key: "title", label: "Título", type: "text" },
            { key: "desc", label: "Descripción", type: "textarea", rows: 2 },
          ],
        },
      ],
      defaults: {
        eyebrow: "Nuestro proceso",
        title: "Del diseño a la entrega,\nsin complicaciones",
        text: "Te acompañamos en cada paso para que tu embalaje sea exactamente lo que necesitas, con la mejor calidad y en el menor tiempo posible.",
        button: "Conoce nuestro proceso",
        image: IMAGES.processBg,
        steps: [
          { icon: "message-square", title: "Consulta y asesoría", desc: "Entendemos tus necesidades y requerimientos." },
          { icon: "pencil-ruler", title: "Diseño y planificación", desc: "Creamos la solución ideal para tu producto." },
          { icon: "wrench", title: "Fabricación", desc: "Usamos materiales de alta calidad y tecnología especializada." },
          { icon: "package-check", title: "Empaque y entrega", desc: "Tu embalaje listo, seguro y a tiempo." },
        ],
      },
    }),
    compromiso: section({
      title: "Nuestro compromiso",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "textarea", rows: 2 },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
        { key: "badges", label: "Insignias", type: "list", itemLabel: "Insignia", max: 4, fields: ICON_LABEL },
        { key: "brush", label: "Frase de la pincelada", type: "textarea", rows: 3, help: "Una línea por renglón." },
        { key: "image", label: "Imagen de fondo", type: "image" },
      ],
      defaults: {
        eyebrow: "Nuestro compromiso",
        title: "Cuidamos el planeta\nen cada embalaje",
        text: "Utilizamos madera de origen responsable y procesos sostenibles que reducen el impacto ambiental, porque creemos en un futuro más verde.",
        badges: [
          { icon: "badge-check", label: "Madera certificada\ncon NIMF 15" },
          { icon: "shield-check", label: "Uso responsable\nde recursos" },
          { icon: "recycle", label: "Reutilización\nde materiales" },
        ],
        brush: "Pequeñas acciones\ntambién hacen\ngrandes cambios",
        image: IMAGES.commitmentBg,
      },
    }),
    sectores: section({
      title: "Sectores que atendemos",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "text" },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
        { key: "button", label: "Botón", type: "text" },
        { key: "sectors", label: "Sectores", type: "list", itemLabel: "Sector", max: 9, fields: ICON_LABEL },
        { key: "image1", label: "Foto 1 (izquierda)", type: "image" },
        { key: "image2", label: "Foto 2 (centro)", type: "image" },
        { key: "image3", label: "Foto 3 (derecha)", type: "image" },
      ],
      defaults: {
        eyebrow: "Sectores que atendemos",
        title: "Tu aliado en múltiples industrias",
        text: "Trabajamos con empresas de diferentes sectores, ofreciendo soluciones personalizadas y adaptadas a cada necesidad.",
        button: "Ver sectores",
        sectors: [
          { icon: "factory", label: "Industria" },
          { icon: "store", label: "Comercio" },
          { icon: "sprout", label: "Agroindustria" },
          { icon: "wine", label: "Alimentos\ny bebidas" },
          { icon: "pill", label: "Farmacéutico" },
          { icon: "globe", label: "Exportación" },
        ],
        image1: IMAGES.sectorsBg,
        image2: IMAGES.sectorsForklift,
        image3: IMAGES.sectorsTruck,
      },
    }),
    testimonios: section({
      title: "Testimonios",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "textarea", rows: 2 },
        { key: "image", label: "Imagen de fondo", type: "image" },
        {
          key: "items",
          label: "Testimonios",
          type: "list",
          itemLabel: "Testimonio",
          min: 1,
          max: 10,
          fields: [
            { key: "quote", label: "Testimonio", type: "textarea", rows: 3 },
            { key: "name", label: "Nombre", type: "text" },
            { key: "role", label: "Cargo y empresa", type: "text" },
          ],
        },
      ],
      defaults: {
        eyebrow: "Lo que dicen nuestros clientes",
        title: "La confianza de nuestros clientes es nuestra mayor satisfacción",
        image: IMAGES.testimonialsBg,
        items: [
          {
            quote:
              "Excelente servicio y calidad en cada pedido. Los embalajes llegaron en perfecto estado y superaron nuestras expectativas.",
            name: "Carlos Méndez",
            role: "Gerente de Logística - Industrias del Norte",
          },
          {
            quote: "Nos diseñaron una caja a la medida para maquinaria delicada. Cero daños en la exportación.",
            name: "Laura Gómez",
            role: "Directora de Operaciones - AgroExport",
          },
          {
            quote: "Cumplen los tiempos y la madera viene certificada NIMF 15. Totalmente recomendados.",
            name: "Andrés Rojas",
            role: "Jefe de Compras - Comercial Andina",
          },
        ],
      },
    }),
    cta: section({
      title: "Franja final (llamado a la acción)",
      description: "Aparece al final de Inicio, Nosotros y Productos.",
      fields: [
        { key: "title", label: "Título", type: "textarea", rows: 2 },
        { key: "text", label: "Texto", type: "text" },
        { key: "button", label: "Botón (WhatsApp)", type: "text" },
        { key: "image", label: "Imagen de fondo", type: "image" },
      ],
      defaults: {
        title: "¿Listo para proteger tus productos\ncon la mejor solución en madera?",
        text: "Contáctanos hoy y recibe asesoría personalizada sin compromiso.",
        button: "Solicita tu asesoría GRATIS",
        image: IMAGES.ctaBg,
      },
    }),
  },
});

/* ======================= NOSOTROS ======================= */

export const NOSOTROS = page({
  title: "Nosotros",
  path: "/nosotros",
  description: "La sección «Sobre nosotros», el proceso, el compromiso y los testimonios se editan en Inicio.",
  sections: {
    encabezado: section({
      title: "Encabezado",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "text", help: HIGHLIGHT_HELP },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
      ],
      defaults: {
        eyebrow: "Nosotros",
        title: "Más que embalajes, *soluciones que protegen*",
        text: "Combinamos experiencia, calidad y sostenibilidad para que tus productos lleguen seguros a su destino.",
      },
    }),
    valores: section({
      title: "Misión, visión y valores",
      fields: [
        { key: "mision", label: "Misión", type: "textarea", rows: 4 },
        { key: "vision", label: "Visión", type: "textarea", rows: 4 },
        { key: "eyebrow", label: "Título de los valores", type: "text" },
        {
          key: "values",
          label: "Valores",
          type: "list",
          itemLabel: "Valor",
          max: 8,
          fields: [
            { key: "icon", label: "Ícono", type: "icon" },
            { key: "title", label: "Título", type: "text" },
            { key: "text", label: "Descripción", type: "textarea", rows: 2 },
          ],
        },
      ],
      defaults: {
        mision:
          "Diseñar y fabricar embalajes en madera a la medida, que protejan los productos de nuestros clientes con calidad, cumplimiento y responsabilidad ambiental.",
        vision:
          "Ser el aliado de embalaje más confiable de la industria colombiana, reconocido por su calidad, su servicio personalizado y su compromiso con la sostenibilidad.",
        eyebrow: "Nuestros valores",
        values: [
          { icon: "shield-check", title: "Calidad", text: "Cada embalaje se fabrica para resistir el viaje." },
          { icon: "leaf", title: "Sostenibilidad", text: "Madera reforestada y certificada NIMF 15." },
          { icon: "handshake", title: "Confianza", text: "Cumplimos lo que prometemos, a tiempo." },
          { icon: "users", title: "Servicio", text: "Asesoría cercana y personalizada en cada proyecto." },
        ],
      },
    }),
  },
});

/* ======================= PRODUCTOS ======================= */

export const PRODUCTOS = page({
  title: "Productos (página)",
  path: "/productos",
  description: "Textos de la página de productos. Los productos se editan en el menú Productos.",
  sections: {
    encabezado: section({
      title: "Encabezado",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "text", help: HIGHLIGHT_HELP },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
      ],
      defaults: {
        eyebrow: "Productos y servicios",
        title: "Embalajes en madera para cada *necesidad*",
        text: "Cajas de madera, estibas y pallets, embalajes especiales y diseños a la medida de tu operación.",
      },
    }),
  },
});

/* ======================= CONTACTO ======================= */

export const CONTACTO = page({
  title: "Contacto",
  path: "/contacto",
  description: "Teléfonos, correos, ubicación y horario se editan en Ajustes generales.",
  sections: {
    encabezado: section({
      title: "Encabezado",
      fields: [
        { key: "title", label: "Título", type: "text", help: HIGHLIGHT_HELP },
        { key: "text", label: "Texto", type: "textarea", rows: 2 },
        {
          key: "checks",
          label: "Ventajas (con visto bueno)",
          type: "list",
          itemLabel: "Ventaja",
          max: 5,
          fields: [{ key: "label", label: "Texto", type: "text" }],
        },
        { key: "script", label: "Frase manuscrita (escritorio)", type: "textarea", rows: 2 },
        { key: "image", label: "Foto de fondo (opcional)", type: "image", help: "Se muestra a la derecha, sobre el fondo verde." },
      ],
      defaults: {
        image: "",
        title: "Hablemos de tu *embalaje*",
        text: "Recibe asesoría personalizada y sin compromiso. Te respondemos rápido.",
        checks: [{ label: "Asesoría gratuita" }, { label: "Respuesta rápida" }, { label: "Soluciones a tu medida" }],
        script: "Estamos\npara ayudarte",
      },
    }),
    formulario: section({
      title: "Formulario",
      fields: [
        { key: "title", label: "Título", type: "text", help: HIGHLIGHT_HELP },
        { key: "subtitle", label: "Subtítulo", type: "text" },
        { key: "button", label: "Botón", type: "text" },
      ],
      defaults: {
        title: "Solicita tu asesoría *GRATIS*",
        subtitle: "Cuéntanos qué necesitas y te respondemos por WhatsApp.",
        button: "Enviar por WhatsApp",
      },
    }),
    tarjetas: section({
      title: "Tarjetas de contacto",
      fields: [
        { key: "phoneSub", label: "Teléfono · texto", type: "text" },
        { key: "emailSub", label: "Correo · texto", type: "text" },
        { key: "locationSub", label: "Ubicación · texto", type: "text" },
        { key: "scheduleSub", label: "Horario · texto", type: "text" },
        { key: "whatsappTitle", label: "Tarjeta de WhatsApp · título", type: "text" },
        { key: "whatsappSub", label: "Tarjeta de WhatsApp · texto", type: "text" },
        { key: "trust", label: "Garantías (bajo el formulario)", type: "list", itemLabel: "Garantía", max: 4, fields: ICON_LABEL },
        { key: "script", label: "Frase manuscrita", type: "text" },
      ],
      defaults: {
        phoneSub: "Llámanos o escríbenos por WhatsApp",
        emailSub: "Te respondemos en menos de 24 horas",
        locationSub: "Envíos a todo el país",
        scheduleSub: "¡Estamos para atenderte!",
        whatsappTitle: "Escríbenos directo por WhatsApp",
        whatsappSub: "Te asesoramos en minutos",
        trust: [
          { icon: "shield-check", label: "Calidad garantizada" },
          { icon: "truck", label: "Envíos a todo el país" },
          { icon: "leaf", label: "Empaque responsable" },
        ],
        script: "Tu aliado en soluciones de embalaje",
      },
    }),
  },
});

/* ======================= COTIZADOR ======================= */

export const COTIZADOR = page({
  title: "Cotizador",
  path: "/cotizador",
  sections: {
    encabezado: section({
      title: "Encabezado",
      fields: [
        { key: "eyebrow", label: "Texto pequeño superior", type: "text" },
        { key: "title", label: "Título", type: "text", help: HIGHLIGHT_HELP },
        { key: "text", label: "Texto", type: "textarea", rows: 3 },
        { key: "perks", label: "Ventajas (bajo el cotizador)", type: "list", itemLabel: "Ventaja", max: 4, fields: ICON_LABEL },
      ],
      defaults: {
        eyebrow: "Cotizador de estibas",
        title: "Cotiza tu estiba *en segundos*",
        text: "Ingresa las medidas, elige el tipo de estiba y el ensamble, y conoce el rango de referencia. Diseñamos gratis la solución que se ajuste a tu carga.",
        perks: [
          { icon: "pencil-ruler", label: "Diseño a medida gratis" },
          { icon: "clock", label: "Respuesta en menos de 24 h" },
          { icon: "shield-check", label: "Madera certificada NIMF 15" },
        ],
      },
    }),
    medidas: section({
      title: "Medidas estándar (cm)",
      description: "Fuera de este rango, el cotizador muestra el mensaje de diseño especial.",
      fields: [
        { key: "largoMin", label: "Largo mínimo", type: "number", min: 1 },
        { key: "largoMax", label: "Largo máximo", type: "number", min: 1 },
        { key: "anchoMin", label: "Ancho mínimo", type: "number", min: 1 },
        { key: "anchoMax", label: "Ancho máximo", type: "number", min: 1 },
      ],
      defaults: { largoMin: 50, largoMax: 150, anchoMin: 50, anchoMax: 150 },
    }),
    precios: section({
      title: "Precios de referencia (COP)",
      fields: [
        { key: "puntillasListonesMin", label: "Puntillas · Listones · desde", type: "number", min: 0 },
        { key: "puntillasListonesMax", label: "Puntillas · Listones · hasta", type: "number", min: 0 },
        { key: "puntillasTacosMin", label: "Puntillas · Tacos · desde", type: "number", min: 0 },
        { key: "puntillasTacosMax", label: "Puntillas · Tacos · hasta", type: "number", min: 0 },
        { key: "tornillosListonesMin", label: "Puntillas y tornillos · Listones · desde", type: "number", min: 0 },
        { key: "tornillosListonesMax", label: "Puntillas y tornillos · Listones · hasta", type: "number", min: 0 },
        { key: "tornillosTacosMin", label: "Puntillas y tornillos · Tacos · desde", type: "number", min: 0 },
        { key: "tornillosTacosMax", label: "Puntillas y tornillos · Tacos · hasta", type: "number", min: 0 },
      ],
      defaults: {
        puntillasListonesMin: 28000,
        puntillasListonesMax: 100000,
        puntillasTacosMin: 34000,
        puntillasTacosMax: 120000,
        tornillosListonesMin: 70000,
        tornillosListonesMax: 250000,
        tornillosTacosMin: 28000,
        tornillosTacosMax: 100000,
      },
    }),
    mensajes: section({
      title: "Mensajes y botón",
      fields: [
        { key: "dentroTitulo", label: "Dentro del rango · título", type: "textarea", rows: 2 },
        { key: "dentroTexto", label: "Dentro del rango · texto", type: "textarea", rows: 3 },
        { key: "fueraTitulo", label: "Fuera del rango · título", type: "textarea", rows: 2 },
        { key: "fueraTexto", label: "Fuera del rango · texto", type: "textarea", rows: 3 },
        { key: "cta", label: "Texto del botón", type: "text" },
      ],
      defaults: {
        dentroTitulo: "Este rango es el punto de partida. Tu embalaje puede ser a la medida.",
        dentroTexto:
          "Déjanos tus datos y diseñamos gratis la solución que se ajuste a tu carga y en menos de 24 horas un asesor te contacta con una propuesta ajustada.",
        fueraTitulo: "Esto se sale de lo estándar, y es justo lo que mejor sabemos hacer.",
        fueraTexto:
          "Las estibas con estas medidas requieren un diseño especial. Déjanos tus datos y en menos de 24 horas un asesor te contacta para estudiar tu caso, sin compromiso.",
        cta: "Recibir propuesta a medida",
      },
    }),
  },
});

/* ======================= DOCUMENTOS LEGALES ======================= */

const LEGAL_HELP =
  "Formato: deja una línea en blanco entre párrafos; empieza con «- » para viñetas y con «> » para un recuadro destacado; **negrita**; [texto](enlace). Variables: {empresa}, {nit_texto}, {domicilio}, {correo}, {telefono}, {sitio}, {horario}, {fecha}.";

const legalSections: Field = {
  key: "sections",
  label: "Secciones",
  type: "list",
  itemLabel: "Sección",
  min: 1,
  max: 30,
  help: LEGAL_HELP,
  fields: [
    { key: "title", label: "Título", type: "text" },
    { key: "body", label: "Contenido", type: "richtext", rows: 8 },
  ],
};

export const PRIVACIDAD = page({
  title: "Política de privacidad",
  path: "/politica-de-privacidad",
  sections: {
    documento: section({
      title: "Documento",
      fields: [
        { key: "title", label: "Título", type: "text" },
        { key: "intro", label: "Introducción", type: "textarea", rows: 3 },
        legalSections,
      ],
      defaults: {
        title: "Política de privacidad y tratamiento de datos",
        intro:
          "Te contamos de forma clara qué datos recolectamos, para qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos.",
        sections: [
          {
            title: "Responsable del tratamiento",
            body: "El responsable del tratamiento de tus datos personales es **{empresa}**{nit_texto}, con domicilio en {domicilio} (en adelante, “Tu Embalaje”, “nosotros”).\n\n- **Correo:** [{correo}](mailto:{correo})\n- **Teléfono / WhatsApp:** {telefono}\n- **Sitio web:** {sitio}",
          },
          {
            title: "Marco legal",
            body: "Esta política se rige por el artículo 15 de la Constitución Política de Colombia, la **Ley 1581 de 2012** (protección de datos personales), el **Decreto 1377 de 2013** (compilado en el Decreto 1074 de 2015) y demás normas que los modifiquen o complementen. Aplica a todos los datos personales que recolectamos a través de este sitio web y de nuestros canales de atención.",
          },
          {
            title: "Qué datos recolectamos",
            body: "Solo pedimos los datos necesarios para atenderte. Según cómo uses el sitio:\n\n- **Formulario de cotización y cotizador:** nombre, empresa, teléfono, correo, producto o medidas de interés y el mensaje que escribas. Estos formularios **no guardan tus datos en nuestro sitio**: arman un mensaje y lo abren en WhatsApp para que tú decidas enviarlo.\n- **Cuenta del foro:** nombre, correo electrónico y contraseña. La contraseña se guarda cifrada (nunca en texto plano) y nadie de nuestro equipo puede verla.\n- **Publicaciones en el foro:** las preguntas, respuestas y “me gusta” que publiques, junto con la fecha. Tu nombre aparece públicamente junto a lo que publicas; tu correo **nunca** se muestra.\n- **Comunicaciones directas:** los datos que nos compartas por WhatsApp, teléfono o correo al pedir una cotización o hacer un pedido.\n- **Datos técnicos:** el servidor que aloja el sitio puede registrar de forma automática la dirección IP, el tipo de navegador y las páginas visitadas, con fines de seguridad y funcionamiento.\n\n> No solicitamos datos sensibles (salud, origen étnico, orientación política o religiosa, datos biométricos, etc.) ni datos de menores de edad.",
          },
          {
            title: "Para qué usamos tus datos",
            body: "- Responder tus solicitudes, preparar cotizaciones y darte asesoría sobre nuestros productos.\n- Gestionar pedidos, despachos, facturación y la relación comercial contigo o tu empresa.\n- Crear y administrar tu cuenta del foro y mostrar tus publicaciones.\n- Moderar el foro y prevenir spam, abusos o accesos no autorizados.\n- Atender peticiones, quejas, reclamos y solicitudes de garantía.\n- Enviarte información comercial sobre nuestros productos, **solo si nos lo autorizas**. Puedes pedir que dejemos de hacerlo en cualquier momento.\n- Cumplir obligaciones legales, contables y tributarias.",
          },
          {
            title: "Autorización",
            body: "Al crear una cuenta en el foro marcas una casilla con la que autorizas de forma previa, expresa e informada el tratamiento de tus datos según esta política. Cuando nos escribes por el formulario, WhatsApp, teléfono o correo, entendemos que nos autorizas a usar esos datos para responderte. Puedes revocar la autorización cuando quieras, salvo que exista un deber legal o contractual de conservarlos.",
          },
          {
            title: "Cookies",
            body: "Usamos **una sola cookie**, llamada te_session, y solo si inicias sesión en el foro o en el panel de administración. Sirve para mantener tu sesión abierta, dura hasta 30 días y se borra al cerrar sesión. Es una cookie técnica, indispensable para esas funciones, y no se usa para publicidad ni para seguirte en otros sitios.\n\nNo usamos cookies de analítica ni de publicidad. Si en el futuro las incorporamos, actualizaremos esta política y te pediremos tu consentimiento cuando la ley lo exija.",
          },
          {
            title: "Con quién compartimos tus datos",
            body: "**No vendemos ni alquilamos tus datos.** Solo los compartimos cuando es necesario para prestarte el servicio:\n\n- **WhatsApp (Meta Platforms):** cuando envías el formulario o nos escribes por WhatsApp, tu mensaje viaja por ese servicio y queda sujeto también a su propia política de privacidad.\n- **Proveedor de alojamiento web:** almacena el sitio y la base de datos del foro, en calidad de encargado del tratamiento.\n- **Transportadoras:** cuando haces un pedido, compartimos los datos de entrega necesarios para el despacho.\n- **Autoridades:** cuando una ley o una orden judicial o administrativa así lo exija.\n\nAlgunos de estos proveedores pueden tener servidores fuera de Colombia. En esos casos exigimos que ofrezcan niveles adecuados de protección, según lo previsto en la Ley 1581 de 2012.",
          },
          {
            title: "Tus derechos",
            body: "Como titular de los datos tienes derecho a:\n\n- Conocer, actualizar y rectificar tus datos personales.\n- Pedir prueba de la autorización que nos diste.\n- Ser informado sobre el uso que les hemos dado.\n- Revocar la autorización y pedir que eliminemos tus datos, cuando no exista un deber legal o contractual de conservarlos.\n- Acceder gratuitamente a tus datos.\n- Presentar quejas ante la **Superintendencia de Industria y Comercio (SIC)** después de haber agotado el trámite de consulta o reclamo con nosotros.",
          },
          {
            title: "Cómo ejercer tus derechos",
            body: "Escríbenos a [{correo}](mailto:{correo}) con el asunto “Datos personales”, indicando tu nombre, tu solicitud y un medio de contacto. Para proteger tu información, podemos pedirte que confirmes tu identidad.\n\n- **Consultas** (qué datos tenemos y cómo los usamos): respondemos en máximo **10 días hábiles**, prorrogables por 5 días hábiles más si es necesario, avisándote el motivo.\n- **Reclamos** (corrección, actualización, supresión o revocatoria): respondemos en máximo **15 días hábiles**, prorrogables por 8 días hábiles más, avisándote el motivo.\n\n> Si quieres eliminar tu cuenta del foro, escríbenos desde el correo con el que te registraste. Borraremos la cuenta y tus datos de acceso; tus publicaciones se eliminarán o se dejarán sin tu nombre, según prefieras.",
          },
          {
            title: "Seguridad",
            body: "Aplicamos medidas técnicas y administrativas razonables para proteger tus datos: conexión cifrada (HTTPS), contraseñas guardadas con cifrado irreversible, cookie de sesión protegida contra accesos desde otros sitios y acceso restringido a la información. Ningún sistema es 100 % infalible, pero si ocurriera un incidente que afecte tus datos te lo informaríamos y lo reportaríamos a la autoridad cuando corresponda.",
          },
          {
            title: "Cuánto tiempo guardamos tus datos",
            body: "- **Cuenta y publicaciones del foro:** mientras tu cuenta esté activa o hasta que pidas eliminarla.\n- **Datos de clientes y pedidos:** durante la relación comercial y el tiempo que exijan las normas contables y tributarias.\n- **Solicitudes y cotizaciones:** el tiempo necesario para atenderlas y hacerles seguimiento.",
          },
          {
            title: "Menores de edad",
            body: "Nuestro sitio está dirigido a empresas y personas mayores de edad. No recolectamos a sabiendas datos de menores de 18 años. Si crees que un menor nos ha dado sus datos, escríbenos y los eliminaremos.",
          },
          {
            title: "Cambios a esta política",
            body: "Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. Publicaremos la nueva versión en esta página con su fecha de actualización y, si el cambio es importante, lo avisaremos en el sitio. Esta versión rige desde el {fecha}.",
          },
        ],
      },
    }),
  },
});

export const TERMINOS = page({
  title: "Términos y condiciones",
  path: "/terminos-y-condiciones",
  sections: {
    documento: section({
      title: "Documento",
      fields: [
        { key: "title", label: "Título", type: "text" },
        { key: "intro", label: "Introducción", type: "textarea", rows: 3 },
        legalSections,
      ],
      defaults: {
        title: "Términos y condiciones de uso",
        intro: "Las reglas para usar nuestro sitio web, pedir cotizaciones y participar en el foro de la comunidad.",
        sections: [
          {
            title: "Aceptación",
            body: "Estos términos regulan el uso del sitio web {sitio} (el “sitio”), operado por **{empresa}**{nit_texto}. Al navegar el sitio, solicitar una cotización o crear una cuenta en el foro, aceptas estos términos y nuestra [Política de privacidad](/politica-de-privacidad).\n\nSi no estás de acuerdo con ellos, te pedimos no usar el sitio.",
          },
          {
            title: "Qué ofrecemos",
            body: "Tu Embalaje diseña y fabrica embalajes en madera: cajas, estibas y pallets, huacales, embalajes especiales y piezas a la medida. El sitio es un canal informativo y de contacto: muestra nuestros productos, permite pedir asesoría y cotizaciones, y ofrece un foro de preguntas y respuestas. **En el sitio no se realizan compras ni pagos en línea.**",
          },
          {
            title: "Información de productos, cotizaciones y pedidos",
            body: "- Las descripciones, fotografías, medidas, fichas técnicas y rangos del cotizador son **referenciales**. Cada embalaje se fabrica según tu necesidad, por lo que el producto final puede variar en tipo de madera, acabado, color o dimensiones.\n- Enviar el formulario o escribirnos por WhatsApp es una **solicitud de información**, no un pedido. Los precios, especificaciones, cantidades, tiempos de entrega y condiciones de pago se definen en la **cotización escrita** que te enviamos, con su vigencia.\n- Un pedido queda confirmado cuando aceptas la cotización y se cumplen las condiciones acordadas en ella (por ejemplo, anticipo u orden de compra).\n- La certificación **NIMF 15** aplica a los productos cotizados expresamente con ese tratamiento y se acredita con el sello correspondiente.\n- Los tiempos de entrega son estimados y pueden verse afectados por causas ajenas a nosotros (disponibilidad de materia prima, transporte, clima, orden público). Te avisaremos oportunamente de cualquier cambio.\n\n> Las garantías, cambios y reclamaciones sobre productos se rigen por lo pactado en la cotización y por el Estatuto del Consumidor (**Ley 1480 de 2011**) cuando sea aplicable.",
          },
          {
            title: "Uso adecuado del sitio",
            body: "Al usar el sitio te comprometes a no:\n\n- Suministrar información falsa o de otra persona.\n- Intentar acceder sin autorización a cuentas, sistemas o datos de otros usuarios o del sitio.\n- Enviar virus, código malicioso o realizar acciones que afecten el funcionamiento del sitio.\n- Usar robots o procesos automáticos para extraer información de forma masiva.\n- Usar el sitio para fines ilegales o contrarios a estos términos.",
          },
          {
            title: "Cuentas y foro de la comunidad",
            body: "- Para preguntar o responder necesitas una cuenta. Eres responsable de mantener tu contraseña en secreto y de la actividad que se haga con tu cuenta.\n- Tu **nombre** y lo que publicas son **visibles para cualquier visitante** y pueden aparecer en buscadores como Google. No publiques datos personales tuyos o de terceros (teléfonos, direcciones, documentos).\n- No se permite publicar contenido ofensivo, discriminatorio, ilegal, engañoso, spam, publicidad no autorizada ni material que infrinja derechos de terceros.\n- Podemos editar, ocultar o eliminar publicaciones, y suspender o cerrar cuentas que incumplan estas reglas, sin previo aviso.\n- Conservas los derechos sobre lo que publicas, y nos autorizas de forma gratuita y no exclusiva a mostrarlo en el sitio mientras esté publicado.\n\n> Las respuestas del foro, incluidas las de nuestro equipo, son **orientativas**. No reemplazan un estudio técnico ni una cotización formal: para tu caso concreto (cargas, medidas, normas del país de destino) solicita asesoría directa.",
          },
          {
            title: "Propiedad intelectual",
            body: "La marca **Tu Embalaje**, el logotipo, los textos, fotografías, diseños, gráficos y el código del sitio pertenecen a {empresa} o se usan con autorización, y están protegidos por las normas de propiedad intelectual. No puedes copiarlos, modificarlos ni usarlos con fines comerciales sin nuestra autorización previa y por escrito. Puedes compartir enlaces a nuestras páginas libremente.",
          },
          {
            title: "Enlaces a otros sitios",
            body: "El sitio incluye enlaces a servicios de terceros, como WhatsApp e Instagram. No controlamos esos sitios ni somos responsables de su contenido o de sus políticas de privacidad; te recomendamos revisarlas al usarlos.",
          },
          {
            title: "Responsabilidad",
            body: "Hacemos lo posible para que el sitio funcione de forma continua y que su información sea correcta y esté actualizada, pero puede tener interrupciones, errores o información desactualizada. En la medida en que la ley lo permita, no respondemos por:\n\n- Daños derivados de interrupciones o fallas técnicas del sitio o de servicios de terceros.\n- Decisiones tomadas solo con base en la información general del sitio o del foro.\n- El contenido publicado por otros usuarios en el foro.\n\nNada de lo anterior limita los derechos que te reconoce el Estatuto del Consumidor cuando sea aplicable.",
          },
          {
            title: "Protección de datos personales",
            body: "El tratamiento de tus datos se rige por nuestra [Política de privacidad y tratamiento de datos](/politica-de-privacidad), conforme a la Ley 1581 de 2012.",
          },
          {
            title: "Cambios a estos términos",
            body: "Podemos modificar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su fecha de actualización. Si sigues usando el sitio después de un cambio, entendemos que aceptas la nueva versión.",
          },
          {
            title: "Ley aplicable",
            body: "Estos términos se rigen por las leyes de la **República de Colombia**. Cualquier diferencia se intentará resolver primero de forma directa y amistosa; si no es posible, se acudirá a las autoridades competentes en Colombia.",
          },
          {
            title: "Contacto",
            body: "Si tienes preguntas sobre estos términos, escríbenos a [{correo}](mailto:{correo}) o llámanos al {telefono} ({horario}).",
          },
        ],
      },
    }),
  },
});

/* ======================= REGISTRO ======================= */

/** Todas las páginas editables, en el orden del panel. La clave es el identificador en la base de datos. */
export const CMS_PAGES = {
  inicio: INICIO,
  nosotros: NOSOTROS,
  productos: PRODUCTOS,
  contacto: CONTACTO,
  cotizador: COTIZADOR,
  privacidad: PRIVACIDAD,
  terminos: TERMINOS,
  ajustes: AJUSTES,
} as const;

export type CmsPageId = keyof typeof CMS_PAGES;
export type CmsValues<K extends CmsPageId> = PageValues<(typeof CMS_PAGES)[K]>;

export const isCmsPage = (id: string): id is CmsPageId => id in CMS_PAGES;
