"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { EXPENSE_CREATE_ROLES, EXPENSE_ROLES, getSessionWithRole } from "@/lib/authorization";
import { EXPENSE_STATUS_LABELS } from "@/lib/expense-status";
import { cancelExpenseSchema, EXPENSE_STATUSES, expenseSchema } from "@/schemas/zod/expense.schema";
import { EXPENSE_IMAGE_PREFIX } from "@/schemas/zod/image.upload.schema";
import type { ExpenseSchemaDataForm } from "@/lib/types";

export async function addExpense(data: ExpenseSchemaDataForm) {
  const session = await getSessionWithRole(EXPENSE_CREATE_ROLES);

  if (!session) {
    return {
      status: "error",
      message: "Vous n'êtes pas autorisé à ajouter une dépense",
    };
  }

  const validation = expenseSchema.safeParse(data);

  if (!validation.success) {
    return {
      status: "error",
      message: "Les données du formulaire sont invalides",
    };
  }

  const { spentAt, image, description, ...expenseData } = validation.data;

  // L'image doit provenir de l'uploader des dépenses
  if (!image.startsWith(EXPENSE_IMAGE_PREFIX)) {
    return {
      status: "error",
      message: "Image de la dépense invalide",
    };
  }

  try {
    await prisma.expense.create({
      data: {
        ...expenseData,
        image,
        description: description?.trim() || null,
        spentAt: new Date(`${spentAt}T00:00:00.000Z`),
        // La personne ayant fait la dépense est toujours l'utilisateur connecté
        createdById: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Dépense ajoutée avec succès",
    };
  } catch (error) {
    console.error("Failed to add expense", error);
    return {
      status: "error",
      message: "Une erreur est survenue lors de l'ajout de la dépense",
    };
  }
}

// CHANGER LE STATUT D'UNE DEPENSE (admin, comptable — le manager peut seulement créer)
// Programmée / En cours / Effectuée uniquement : une dépense annulée ne change plus de statut.
export async function updateExpenseStatus(expenseId: string, status: string) {
  const session = await getSessionWithRole(EXPENSE_ROLES);

  if (!session) {
    return { status: "error", message: "Vous n'êtes pas autorisé à modifier cette dépense" };
  }

  const validStatus = EXPENSE_STATUSES.find((value) => value === status);

  if (!validStatus) {
    return { status: "error", message: "Statut invalide" };
  }

  try {
    // Mise à jour conditionnelle : évite de "ressusciter" une dépense annulée entre-temps
    const { count } = await prisma.expense.updateMany({
      where: { id: expenseId, status: { not: "cancelled" } },
      data: { status: validStatus },
    });

    if (count === 0) {
      return { status: "error", message: "Cette dépense n'existe plus ou a été annulée" };
    }

    return {
      status: "success",
      message: `Statut de la dépense : ${EXPENSE_STATUS_LABELS[validStatus]}`,
    };
  } catch (error) {
    console.error("Failed to update expense status", error);
    return { status: "error", message: "Une erreur est survenue lors du changement de statut" };
  }
}

// ANNULER UNE DEPENSE (admin et comptable, motif obligatoire) : la dépense reste dans la liste avec le statut "Annulée"
export async function cancelExpense(expenseId: string, reason: string) {
  const session = await getSessionWithRole(EXPENSE_ROLES);

  if (!session) {
    return { status: "error", message: "Vous n'êtes pas autorisé à annuler une dépense" };
  }

  const validation = cancelExpenseSchema.safeParse({ reason });

  if (!validation.success) {
    return { status: "error", message: validation.error.issues[0].message };
  }

  try {
    const { count } = await prisma.expense.updateMany({
      where: { id: expenseId, status: { not: "cancelled" } },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelReason: validation.data.reason,
        cancelledById: session.user.id,
      },
    });

    if (count === 0) {
      return { status: "error", message: "Cette dépense n'existe plus ou est déjà annulée" };
    }

    return { status: "success", message: "La dépense a été annulée" };
  } catch (error) {
    console.error("Failed to cancel expense", error);
    return { status: "error", message: "Une erreur est survenue lors de l'annulation de la dépense" };
  }
}

// SUPPRIMER UNE DEPENSE (admin uniquement) : suppression définitive, image comprise
export async function deleteExpense(expenseId: string) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return { status: "error", message: "Seul un administrateur peut supprimer une dépense" };
  }

  try {
    const deleted = await prisma.expense
      .delete({ where: { id: expenseId }, select: { image: true } })
      .catch(() => null);

    if (!deleted) {
      return { status: "error", message: "Cette dépense n'existe plus" };
    }

    // L'image n'est plus référencée : on la retire du stockage (un échec ici ne bloque pas la suppression)
    if (deleted.image) {
      await S3.send(
        new DeleteObjectCommand({ Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES, Key: deleted.image }),
      ).catch((error) => console.error("Failed to delete expense image", error));
    }

    return { status: "success", message: "La dépense a été supprimée" };
  } catch (error) {
    console.error("Failed to delete expense", error);
    return { status: "error", message: "Une erreur est survenue lors de la suppression de la dépense" };
  }
}
