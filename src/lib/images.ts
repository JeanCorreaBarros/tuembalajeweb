/**
 * Mapa central de imágenes. Coloca tus archivos en /public/images con estos
 * nombres (o cambia las rutas aquí). Mientras no exista el archivo se muestra
 * un recuadro de relleno con el nombre esperado.
 */
export const IMAGES = {
  heroBg: "/images/hero-bg.jpg", // fondo del hero (bosque + caja de madera)
  aboutWorker: "/images/about-worker.jpg", // operario con casco
  // Productos (usadas en src/lib/products.ts):
  // producto-estibas-madera.jpg, producto-estibas-plastico.jpg,
  // producto-especiales.jpg, producto-otros.jpg
  commitmentBg: "/images/compromiso-planta.jpg", // manos con planta / bosque
  sectorsBg: "/images/sectores-cajas.jpg", // cajas en bodega
  sectorsTruck: "/images/sectores-camion.jpg", // camión y montacargas
  testimonialsBg: "/images/testimonios-bg.jpg",
  clientAvatar: "/images/cliente-carlos.jpg",
  contactHero: "/images/contacto-hero.jpg", // asesora con headset (fondo del hero de contacto)
  ctaBg: "/images/cta-bg.jpg",
} as const;
