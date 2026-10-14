/**
 * Estado de carga de las pantallas del panel. Cada pantalla lee la sesión y la base de datos en
 * el momento, así que la navegación muestra este esqueleto al instante mientras llegan los datos
 * (con Cache Components, Next exige este límite de Suspense para no bloquear la navegación).
 */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="animate-pulse">
      <div className="h-8 w-56 rounded-lg bg-black/[0.07]" />
      <div className="mt-2 h-4 w-80 max-w-full rounded bg-black/[0.05]" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-white shadow-sm ring-1 ring-black/5" />
        ))}
      </div>
    </div>
  );
}
