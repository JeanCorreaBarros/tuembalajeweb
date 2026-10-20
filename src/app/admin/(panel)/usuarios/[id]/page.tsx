import { ArrowLeft, Lock, CalendarDays, Clock, ExternalLink, KeyRound, MessageCircle, MessagesSquare, MonitorSmartphone, Trash2 } from "lucide-react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteUserAction, resetUserPasswordAction, updateUserAction } from "@/app/admin/users-actions";
import { AdminHeader } from "@/components/admin/AdminShell";
import { ConfirmSubmit } from "@/components/admin/ConfirmDialog";
import PasswordReset from "@/components/admin/users/PasswordReset";
import UserForm from "@/components/admin/users/UserForm";
import { Avatar } from "@/components/admin/users/ui";
import { getCurrentUser } from "@/lib/auth";
import { activeAdmins, getUser, isSuperUser } from "@/lib/cms/users";
import { db } from "@/lib/db";

// El panel depende de la sesión en cada pantalla: no se navega «al instante» (lo indica Next en desarrollo).
export const instant = false;

export const metadata = { title: "Editar usuario" };

const fmt = (ts: number) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));

export default async function UsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const id = Number((await params).id);
  const user = Number.isInteger(id) ? getUser(id) : null;
  if (!user) notFound();
  const me = await getCurrentUser();
  const isSelf = me?.id === user.id;
  // La cuenta de soporte técnico solo la modifica un superadministrador: los demás la ven en solo lectura.
  const locked = user.is_super === 1 && !(me && isSuperUser(me.id));
  const lastAdmin = user.role === "admin" && !user.disabled && activeAdmins() <= 1;
  const questions = db
    .prepare("SELECT id, title, created_at FROM questions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5")
    .all(user.id) as { id: number; title: string; created_at: number }[];

  const stats = [
    { icon: MessagesSquare, label: "Preguntas", value: user.questions },
    { icon: MessageCircle, label: "Respuestas", value: user.answers },
    { icon: MonitorSmartphone, label: "Sesiones abiertas", value: user.sessions },
  ];

  const card = "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5";

  return (
    <>
      <Link href="/admin/usuarios" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink/55 hover:text-forest">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Usuarios
      </Link>
      <AdminHeader title={user.name} description={user.email} help="/admin/ayuda#usuarios" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {locked ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-forest-dark">
                <Lock className="h-4 w-4 text-violet-600" aria-hidden /> Cuenta de soporte técnico
              </p>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink/60">
                Esta cuenta pertenece al equipo de soporte técnico del sitio. Para proteger el acceso de soporte, sus datos, su contraseña y su
                estado solo los puede modificar el superadministrador.
              </p>
            </div>
          ) : (
            <UserForm
              mode="edit"
              action={updateUserAction.bind(null, user.id)}
              isSelf={isSelf}
              user={{ name: user.name, email: user.email, phone: user.phone, job_title: user.job_title, role: user.role, disabled: user.disabled }}
            />
          )}
        </div>

        <aside className="space-y-4">
          {/* Resumen */}
          <div className={card}>
            <div className="flex items-center gap-3">
              <Avatar name={user.name} />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold text-forest-dark">{user.name}</p>
                <p className="truncate text-[12px] text-ink/50">{user.job_title || (user.role === "admin" ? "Administrador" : "Miembro del foro")}</p>
              </div>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
              {stats.map(({ icon: Icon, label, value }) => (
                <li key={label} className="rounded-2xl bg-mist/70 px-2 py-3">
                  <Icon className="mx-auto h-4 w-4 text-brand" aria-hidden />
                  <p className="mt-1 text-[18px] font-extrabold tabular-nums text-forest-dark">{value}</p>
                  <p className="text-[10px] leading-tight text-ink/50">{label}</p>
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-2 text-[12px] text-ink/60">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-ink/35" aria-hidden /> Creado el {fmt(user.created_at)}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-ink/35" aria-hidden /> {user.last_login ? `Último ingreso: ${fmt(user.last_login)}` : "Nunca ha iniciado sesión"}
              </li>
            </ul>
            {questions.length > 0 && (
              <div className="mt-4 border-t border-black/5 pt-4">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/45">Últimas preguntas</p>
                <ul className="space-y-1.5">
                  {questions.map((q) => (
                    <li key={q.id}>
                      <a
                        href={`/foro/${q.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-1.5 text-[12px] font-semibold text-forest-dark hover:text-brand-dark"
                      >
                        <span className="line-clamp-2 flex-1">{q.title}</span>
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-ink/30 group-hover:text-brand" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contraseña */}
          <div className={card}>
            <p className="mb-1 flex items-center gap-2 text-[14px] font-extrabold text-forest-dark">
              <KeyRound className="h-4 w-4 text-brand" aria-hidden /> Contraseña
            </p>
            {locked ? (
              <p className="text-[12px] text-ink/55">Solo el superadministrador puede cambiar la contraseña de esta cuenta.</p>
            ) : isSelf ? (
              <p className="text-[12px] text-ink/55">
                Tu propia contraseña se cambia en{" "}
                <Link href="/admin/cuenta" className="font-bold text-brand-dark underline">
                  Mi cuenta
                </Link>
                .
              </p>
            ) : (
              <>
                <p className="mb-3 text-[12px] leading-snug text-ink/55">
                  Si olvidó su contraseña, asígnale una nueva. Se cerrarán sus sesiones abiertas.
                </p>
                <PasswordReset action={resetUserPasswordAction.bind(null, user.id)} />
              </>
            )}
          </div>

          {/* Zona de peligro */}
          {!isSelf && !locked && (
            <div className="rounded-3xl border border-red-200 bg-red-50/50 p-5">
              <p className="flex items-center gap-2 text-[14px] font-extrabold text-red-700">
                <Trash2 className="h-4 w-4" aria-hidden /> Eliminar usuario
              </p>
              {lastAdmin ? (
                <p className="mt-1 text-[12px] text-red-700/80">Es el único administrador activo: no se puede eliminar.</p>
              ) : (
                <>
                  <p className="mt-1 text-[12px] leading-snug text-red-700/80">
                    Se borran la cuenta y <b>sus {user.questions + user.answers} publicaciones del foro</b>. No se puede deshacer. Si solo quieres
                    quitarle el acceso, mejor suspende la cuenta.
                  </p>
                  <form action={deleteUserAction.bind(null, user.id)} className="mt-3">
                    <ConfirmSubmit
                      options={{
                        tone: "danger",
                        title: `¿Eliminar a ${user.name}?`,
                        message: "Se borrará todo lo siguiente:",
                        details: [
                          `La cuenta ${user.email} (ya no podrá iniciar sesión)`,
                          `${user.questions} ${user.questions === 1 ? "pregunta" : "preguntas"} y ${user.answers} ${user.answers === 1 ? "respuesta" : "respuestas"} del foro`,
                          "Sus «me gusta» y sesiones abiertas",
                        ],
                        requireText: "ELIMINAR",
                        confirmLabel: "Eliminar definitivamente",
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-[12px] font-bold text-white hover:bg-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden /> Eliminar definitivamente
                    </ConfirmSubmit>
                  </form>
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
