import { NextResponse, type NextRequest } from "next/server";

/**
 * Revisión rápida del panel: si no hay cookie de sesión, se va al login antes de renderizar nada.
 * Es solo una primera barrera: la verificación real (sesión válida y rol de administrador) la hacen
 * el layout del panel y cada acción del servidor.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/admin/login" && !request.cookies.has("te_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
