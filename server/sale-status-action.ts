"use server";

import { prisma } from "@/lib/db";
import { getSessionWithRole } from "@/lib/authorization";
import { cancelSaleSchema } from "@/schemas/zod/sale.schema";

// Erreur métier dont le message peut être affiché tel quel à l'utilisateur
class SaleActionError extends Error {}

function toResult(error: unknown) {
  if (error instanceof SaleActionError) {
    return { status: "error", message: error.message };
  }
  console.error(error);
  return { status: "error", message: "Une erreur inattendue est survenue" };
}

// VALIDER UNE VENTE (manager, accountant, assistant) : pending → validated et décrémente le stock
export async function validateSale(saleId: string) {
  const session = await getSessionWithRole(["manager", "accountant", "assistant"]);

  if (!session) {
    return { status: "error", message: "Seuls un manager, un comptable ou un(e) assistant(e) peuvent valider une vente" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        select: { status: true, productId: true, quantity: true },
      });

      if (!sale || sale.status !== "pending") {
        throw new SaleActionError("Cette vente n'est plus en attente de validation");
      }

      // Décrément conditionnel : échoue si le stock est insuffisant (pas de stock négatif)
      const stock = await tx.product.updateMany({
        where: { id: sale.productId, deletedAt: null, quantity: { gte: sale.quantity } },
        data: { quantity: { decrement: sale.quantity } },
      });

      if (stock.count === 0) {
        throw new SaleActionError("Stock insuffisant pour valider cette vente");
      }

      // Le filtre sur le status empêche une double validation simultanée
      const now = new Date();
      const updated = await tx.sale.updateMany({
        where: { id: saleId, status: "pending" },
        data: { status: "validated", validatedAt: now, soldAt: now, validatorId: session.user.id },
      });

      if (updated.count === 0) {
        throw new SaleActionError("Cette vente n'est plus en attente de validation");
      }
    });
  } catch (error) {
    return toResult(error);
  }

  return { status: "success", message: "Vente validée, le stock a été mis à jour" };
}

// ANNULER UNE VENTE
// - manager, accountant, assistant : pending → cancelled, note de justification obligatoire
// - admin : correction d'une vente validée à tort (validated → cancelled), le stock est rendu
export async function cancelSale(saleId: string, note: string) {
  const session = await getSessionWithRole(["manager", "accountant", "assistant", "admin"]);

  if (!session) {
    return { status: "error", message: "Vous n'êtes pas autorisé à annuler une vente" };
  }

  const isAdmin = session.user.role === "admin";
  const validation = cancelSaleSchema.safeParse({ note });

  if (!isAdmin && !validation.success) {
    return { status: "error", message: validation.error.issues[0].message };
  }

  const cleanNote = note.trim() || null;

  try {
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        select: { status: true, productId: true, quantity: true },
      });

      const expectedStatus = isAdmin ? "validated" : "pending";

      if (!sale || sale.status !== expectedStatus) {
        throw new SaleActionError(
          isAdmin
            ? "Seule une vente validée peut être corrigée en annulation"
            : "Cette vente n'est plus en attente de validation",
        );
      }

      const updated = await tx.sale.updateMany({
        where: { id: saleId, status: expectedStatus },
        data: {
          status: "cancelled",
          cancelledAt: new Date(),
          cancelledById: session.user.id,
          ...(cleanNote ? { note: cleanNote } : {}),
        },
      });

      if (updated.count === 0) {
        throw new SaleActionError("La vente a été modifiée entre-temps, réessayez");
      }

      if (isAdmin) {
        await tx.product.update({
          where: { id: sale.productId },
          data: { quantity: { increment: sale.quantity } },
        });
      }
    });
  } catch (error) {
    return toResult(error);
  }

  return {
    status: "success",
    message: isAdmin ? "Vente annulée, le stock a été rendu" : "Vente annulée",
  };
}

// SUPPRIMER UNE VENTE (admin uniquement) : rend le stock si la vente était validée
export async function deleteSale(saleId: string) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return { status: "error", message: "Seul un administrateur peut supprimer une vente" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.delete({
        where: { id: saleId },
        select: { status: true, productId: true, quantity: true },
      });

      if (sale.status === "validated") {
        await tx.product.update({
          where: { id: sale.productId },
          data: { quantity: { increment: sale.quantity } },
        });
      }
    });
  } catch (error) {
    return toResult(error);
  }

  return { status: "success", message: "Vente supprimée" };
}
