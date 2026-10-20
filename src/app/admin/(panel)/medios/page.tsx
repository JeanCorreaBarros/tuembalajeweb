import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/AdminShell";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { listLibrary } from "@/lib/cms/media";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Medios" };

export default async function MediosPage() {
  await connection();
  return (
    <>
      <AdminHeader
        title="Medios"
        help="/admin/ayuda#imagenes"
        description="Todas las imágenes de la web: las que subes desde aquí y las que ya trae la web (productos, encabezados…), con dónde se usa cada una."
      />
      <MediaLibrary initial={await listLibrary()} />
    </>
  );
}
