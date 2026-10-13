/**
 * Mapa central de imágenes. Coloca tus archivos en /public/images con estos
 * nombres (o cambia las rutas aquí). Mientras no exista el archivo se muestra
 * un recuadro de relleno con el nombre esperado.
 */
export const IMAGES = {
  heroBg: "/images/hero-bg-5.jpg", // fondo del hero (bosque + caja de madera)
  aboutWorker: "/images/about-worker-2.jpg", // operario con casco
  // Productos (usadas en src/lib/products.ts):
  // producto-cajas.jpg, producto-estibas.jpg,
  // producto-especiales-2.jpg, producto-medida.jpg
  processBg: "/images/proceso-bg.jpg", // hojas verdes (fondo de "Nuestro proceso")
  commitmentBg: "/images/compromiso-planta.jpg", // manos con planta / bosque
  sectorsBg: "/images/sectores-cajas.jpg", // cajas en bodega
  sectorsForklift: "/images/sectores-montacargas.jpg", // montacargas cargando cajas
  sectorsTruck: "/images/sectores-camion.jpg", // camión en bodega
  testimonialsBg: "/images/testimonios-bg.jpg",
  // Foto del hero de contacto (asesora con headset). Vacío = no se usa: pon "/images/contacto-hero.jpg"
  // cuando subas el archivo. Así no se pide una imagen inexistente (404) en cada visita.
  contactHero: "" as string,
  ctaBg: "/images/cta-bg.jpg",
} as const;
