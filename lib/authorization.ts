import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isRole, ROLE_HOME, type Role } from "@/lib/roles";

export async function requireRole(requiredRole: Role) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role;

  if (!isRole(userRole)) {
    redirect("/login");
  }

  if (userRole !== requiredRole) {
    redirect(ROLE_HOME[userRole]);
  }

  return session;
}

// Rôles autorisés à gérer l'inventaire (produits et images)
export const INVENTORY_ROLES: Role[] = ["admin", "manager"];

// Pour les server actions et routes API : renvoie la session si l'utilisateur
// a l'un des rôles autorisés, sinon null (pas de redirect).
export async function getSessionWithRole(allowedRoles: Role[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userRole = session.user.role;

  if (!isRole(userRole) || !allowedRoles.includes(userRole)) {
    return null;
  }

  return session;
}