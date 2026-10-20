"use server";

import { prisma } from "@/lib/db";
import { getSessionWithRole, INVENTORY_ROLES } from "@/lib/authorization";
import { productShcema } from "@/schemas/zod/product.schema";
import type { ProductSchemaDataForm } from "@/lib/types";

export async function addProduct(data: ProductSchemaDataForm) {
  const session = await getSessionWithRole(INVENTORY_ROLES);

  if (!session) {
    return {
      status: "error",
      message: "Vous n'êtes pas autorisé à ajouter un produit",
    };
  }

  const validation = productShcema.safeParse(data);

  try {
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    const { producedAt, expiresAt, ...productData } = validation.data;

    await prisma.product.create({
      data: {
        ...productData,
        producedAt: producedAt ? new Date(`${producedAt}T00:00:00.000Z`) : undefined,
        expiresAt: expiresAt ? new Date(`${expiresAt}T00:00:00.000Z`) : undefined,
      },
    });

    return {
      status: "success",
      message: "Product Added successfully",
    };
  } catch (error) {
    console.error("Failed to add product", error);
    return {
      status: "error",
      message: "Une erreur est survenue lors de l'ajout du produit",
    };
  }
}
