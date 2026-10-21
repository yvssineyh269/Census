"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { getSessionWithRole } from "@/lib/authorization";
import { activeScope } from "@/lib/active-scope";
import { productShcema } from "@/schemas/zod/product.schema";
import type { ProductSchemaDataForm } from "@/lib/types";

const toDate = (value?: string) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

// MODIFIER UN PRODUIT (admin uniquement)
export async function updateProduct(productId: string, data: ProductSchemaDataForm) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return { status: "error", message: "Seul un administrateur peut modifier un produit" };
  }

  const validation = productShcema.safeParse(data);

  if (!validation.success) {
    return { status: "error", message: "Les informations saisies sont invalides" };
  }

  try {
    const current = await prisma.product.findFirst({
      where: { id: productId, ...activeScope },
      select: { image: true },
    });

    if (!current) {
      return { status: "error", message: "Ce produit n'existe plus" };
    }

    const { producedAt, expiresAt, ...productData } = validation.data;

    await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        producedAt: toDate(producedAt),
        expiresAt: toDate(expiresAt),
      },
    });

    // L'image a été remplacée : l'ancienne n'est plus utilisée, on la retire du stockage
    if (current.image && current.image !== productData.image) {
      await S3.send(
        new DeleteObjectCommand({ Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES, Key: current.image }),
      ).catch((error) => console.error("Failed to delete old product image", error));
    }

    return { status: "success", message: "Le produit a été modifié" };
  } catch (error) {
    console.error("Failed to update product", error);
    return { status: "error", message: "Une erreur est survenue lors de la modification du produit" };
  }
}

// SUPPRIMER UN PRODUIT (admin uniquement)
// Suppression logique (deletedAt) : l'historique des ventes garde la référence au produit.
export async function deleteProduct(productId: string) {
  const session = await getSessionWithRole(["admin"]);

  if (!session) {
    return { status: "error", message: "Seul un administrateur peut supprimer un produit" };
  }

  try {
    const pendingSales = await prisma.sale.count({
      where: { productId, status: "pending" },
    });

    if (pendingSales > 0) {
      return {
        status: "error",
        message: `Ce produit a ${pendingSales} vente${pendingSales > 1 ? "s" : ""} en attente : validez-les ou annulez-les d'abord`,
      };
    }

    const deleted = await prisma.product.updateMany({
      where: { id: productId, ...activeScope },
      data: { deletedAt: new Date() },
    });

    if (deleted.count === 0) {
      return { status: "error", message: "Ce produit n'existe plus" };
    }

    return { status: "success", message: "Le produit a été supprimé de l'inventaire" };
  } catch (error) {
    console.error("Failed to delete product", error);
    return { status: "error", message: "Une erreur est survenue lors de la suppression du produit" };
  }
}
