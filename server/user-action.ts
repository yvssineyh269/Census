"use server";

import { prisma } from "@/lib/db";
import { getSessionWithRole } from "@/lib/authorization";
import {
  addUserSchema,
  type AddUserSchemaDataForm,
} from "@/schemas/zod/add.user.schema";

// MODIFIER UN UTILISATEUR (admin uniquement)
export async function updateUser(userId: string, data: AddUserSchemaDataForm) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return { status: "error", message: "Seul un administrateur peut modifier un utilisateur" };
  }

  const validation = addUserSchema.safeParse(data);

  if (!validation.success) {
    return { status: "error", message: "Les informations saisies sont invalides" };
  }

  const { name, email, username, role } = validation.data;

  // Évite qu'un admin se retire lui-même ses droits et se bloque l'accès
  if (userId === session.user.id && role !== "admin") {
    return { status: "error", message: "Vous ne pouvez pas retirer votre propre rôle d'administrateur" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return { status: "error", message: "Cet utilisateur n'existe plus" };
    }

    const existing = await prisma.user.findFirst({
      where: { id: { not: userId }, OR: [{ email }, { username }] },
      select: { email: true },
    });

    if (existing) {
      return {
        status: "error",
        message:
          existing.email === email
            ? "Un autre compte utilise déjà cette adresse e-mail"
            : "Ce nom d'utilisateur est déjà pris",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { name, email, username, displayUsername: username, role },
      });

      // Changement de rôle : on ferme ses sessions pour qu'il se reconnecte avec ses nouveaux droits
      if (user.role !== role) {
        await tx.session.deleteMany({ where: { userId } });
      }
    });

    return { status: "success", message: "L'utilisateur a été modifié" };
  } catch (error) {
    console.error("Failed to update user", error);
    return { status: "error", message: "Une erreur est survenue lors de la modification de l'utilisateur" };
  }
}

// SUPPRIMER UN UTILISATEUR (admin uniquement)
// Refusé si l'utilisateur est lié à des ventes, pour ne pas casser l'historique.
export async function deleteUser(userId: string) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return { status: "error", message: "Seul un administrateur peut supprimer un utilisateur" };
  }

  if (userId === session.user.id) {
    return { status: "error", message: "Vous ne pouvez pas supprimer votre propre compte" };
  }

  try {
    const linkedSales = await prisma.sale.count({
      where: {
        OR: [{ salepersonId: userId }, { validatorId: userId }, { cancelledById: userId }],
      },
    });

    if (linkedSales > 0) {
      return {
        status: "error",
        message: `Cet utilisateur est lié à ${linkedSales} vente${linkedSales > 1 ? "s" : ""} dans l'historique : il ne peut pas être supprimé`,
      };
    }

    // Les sessions et comptes de connexion sont supprimés en cascade
    await prisma.user.delete({ where: { id: userId } });

    return { status: "success", message: "L'utilisateur a été supprimé" };
  } catch (error) {
    console.error("Failed to delete user", error);
    return { status: "error", message: "Une erreur est survenue lors de la suppression de l'utilisateur" };
  }
}
