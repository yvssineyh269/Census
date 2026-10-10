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