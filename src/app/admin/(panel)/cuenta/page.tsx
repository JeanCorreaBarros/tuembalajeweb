import { BadgeCheck, CalendarDays, Clock, KeyRound, Mail, MonitorSmartphone, Phone, UserRound, Users } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminShell";
import PasswordForm, { OtherSessions, ProfileForm } from "@/components/admin/PasswordForm";
import { Avatar } from "@/components/admin/users/ui";
import { getCurrentUser } from "@/lib/auth";
import { getUser } from "@/lib/cms/users";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Mi cuenta" };

const fmt = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date(ts));
const fmtTime = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));

function Card({ icon: Icon, title, text, children }: { icon: typeof Mail; title: string; text: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <header className="flex items-start gap-3 border-b border-black/5 px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-[16px] font-extrabold text-forest-dark">{title}</h2>
          <p className="text-[12px] text-ink/55">{text}</p>
        </div>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default async function CuentaPage() {
  await connection();
  const me = (await getCurrentUser())!;
  const user = getUser(me.id)!;

  const facts = [
    { icon: Mail, label: "Correo", value: user.email },
    { icon: Phone, label: "Teléfono", value: user.phone || "Sin registrar" },
    { icon: CalendarDays, label: "Miembro desde", value: fmt(user.created_at) },
    { icon: Clock, label: "Último ingreso", value: user.last_login ? fmtTime(user.last_login) : "—" },
  ];

  return (
    <>
      <AdminHeader title="Mi cuenta" description="Tu perfil, tu contraseña y tus sesiones abiertas." help="/admin/ayuda#cuenta" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Perfil */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="relative h-24 bg-gradient-to-br from-forest-dark via-forest to-brand-dark">
              <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-2 border-white/10" aria-hidden />
              <div className="absolute -right-2 -top-4 h-20 w-20 rounded-full border-2 border-white/10" aria-hidden />
            </div>
            <div className="relative -mt-10 px-5 pb-5 text-center">
              <div className="flex justify-center">
                <Avatar name={user.name} size="lg" />
              </div>
              <p className="mt-3 text-[18px] font-extrabold text-forest-dark">{user.name}</p>
              <p className="text-[13px] text-ink/55">{user.job_title || "Sin cargo registrado"}</p>
              <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand-dark">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Administrador
              </span>
            </div>
            <ul className="divide-y divide-black/5 border-t border-black/5">
              {facts.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-3 px-5 py-3">
                  <Icon className="h-4 w-4 shrink-0 text-ink/35" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[11px] text-ink/45">{label}</span>
                    <span className="block truncate text-[13px] font-semibold text-forest-dark">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/admin/usuarios"
            className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-black/10 px-4 py-3 text-[13px] font-bold text-forest-dark transition hover:border-brand/50 hover:bg-white"
          >
            <Users className="h-4 w-4 text-brand" aria-hidden /> Administrar usuarios →
          </Link>
        </aside>

        <div className="min-w-0 space-y-6">
          <Card icon={UserRound} title="Datos personales" text="Tu nombre aparece en el Historial y en tus respuestas del foro.">
            <ProfileForm user={user} />
          </Card>
          <Card icon={KeyRound} title="Contraseña" text="Usa al menos 10 caracteres; mejor si combinas mayúsculas, números y símbolos.">
            <PasswordForm />
          </Card>
          <Card icon={MonitorSmartphone} title="Sesiones" text="Dispositivos donde tu cuenta está abierta.">
            <OtherSessions count={user.sessions} />
          </Card>
        </div>
      </div>
    </>
  );
}
