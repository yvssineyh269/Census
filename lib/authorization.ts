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

// Rôles autorisés à changer le statut d'une dépense et à l'annuler (suppression : admin seul)
export const EXPENSE_ROLES: Role[] = ["admin", "accountant"];

// Rôles autorisés à enregistrer une dépense (et à importer son image).
// Le manager peut créer une dépense mais ne change ni son statut ni ne l'annule.
export const EXPENSE_CREATE_ROLES: Role[] = ["admin", "accountant", "manager"];

// Rôles autorisés à importer / supprimer une image selon son dossier S3
export const IMAGE_FOLDER_ROLES = {
  products: INVENTORY_ROLES,
  expenses: EXPENSE_CREATE_ROLES,
} satisfies Record<"products" | "expenses", Role[]>;

// Rôles autorisés à consulter les marges (informations financières)
export const MARGIN_ROLES: Role[] = ["admin", "manager", "accountant"];

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