import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, type User } from "@/lib/auth";

/**
 * Exige un administrador. Se llama al inicio de TODA acción del panel (no basta con ocultar
 * la pantalla: las acciones de servidor se pueden invocar directamente).
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/admin/login");
  return user;
}
