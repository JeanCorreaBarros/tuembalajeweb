import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/AdminShell";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/cms/media";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Medios" };

export default async function MediosPage() {
  await connection();
  return (
    <>
      <AdminHeader
        title="Medios"
        description="Sube aquí tus fotos. Se optimizan solas (tamaño y formato WebP) y luego las eliges desde cualquier página o producto."
      />
      <MediaLibrary initial={listMedia()} />
    </>
  );
}
