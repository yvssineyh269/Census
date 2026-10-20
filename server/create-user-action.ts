"use server";

import { randomBytes } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSessionWithRole } from "@/lib/authorization";
import { sendInvitationEmail } from "@/lib/account-emails";
import {
  addUserSchema,
  type AddUserSchemaDataForm,
} from "@/schemas/zod/add.user.schema";

// Durée de validité du lien d'invitation (le lien "mot de passe oublié" reste à 1h)
const INVITATION_EXPIRES_IN_MS = 72 * 60 * 60 * 1000;

export async function createUser(data: AddUserSchemaDataForm) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return {
      status: "error",
      message: "Seul un administrateur peut créer un utilisateur",
    };
  }

  const validation = addUserSchema.safeParse(data);

  if (!validation.success) {
    return {
      status: "error",
      message: "Les informations saisies sont invalides",
    };
  }

  const { name, email, username, role } = validation.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true },
  });

  if (existing) {
    return {
      status: "error",
      message:
        existing.email === email
          ? "Un compte existe déjà avec cette adresse e-mail"
          : "Ce nom d'utilisateur est déjà pris",
    };
  }

  const ctx = await auth.$context;

  // Compte créé sans mot de passe : l'employé le définit via le lien d'invitation.
  // Better-Auth crée le compte "credential" au moment du reset du mot de passe.
  const user = await ctx.internalAdapter.createUser({
    name,
    email,
    username,
    displayUsername: username,
    role,
    emailVerified: false,
  }, { method: "admin" });

  // Même format de jeton que le "mot de passe oublié" de Better-Auth : le lien
  // passe par /api/auth/reset-password/:token qui redirige vers /reset-password?token=...
  const token = randomBytes(24).toString("base64url");
  const identifier = `reset-password:${token}`;

  await ctx.internalAdapter.createVerificationValue({
    identifier,
    value: user.id,
    expiresAt: new Date(Date.now() + INVITATION_EXPIRES_IN_MS),
  });

  const url = `${ctx.baseURL}/reset-password/${token}?callbackURL=${encodeURIComponent("/reset-password")}`;

  try {
    await sendInvitationEmail({ to: email, username: name, url });
  } catch (error) {
    console.error("Failed to send invitation email", error);

    // Sans email, l'employé ne pourra jamais activer son compte : on annule la création
    await prisma.verification.deleteMany({ where: { identifier } });
    await prisma.user.delete({ where: { id: user.id } });

    return {
      status: "error",
      message:
        "L'email d'invitation n'a pas pu être envoyé, le compte n'a pas été créé",
    };
  }

  return {
    status: "success",
    message: `Compte créé : un email d'activation a été envoyé à ${email}`,
  };
}
