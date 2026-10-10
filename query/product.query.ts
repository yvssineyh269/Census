import { prisma } from "@/lib/db";
import { activeScope } from "@/lib/active-scope";

// Liste tous les produits disponible à la vente
export async function getAllProducts() {
  return prisma.product.findMany({
    where: activeScope,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      image: true,
      purchasePrice: true,
      sellingPrice: true,
      commission: true,
      quantity: true,
      description: true,
      producedAt: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Réccupére les produits par ID
export async function getProductById(productId: string) {
  return prisma.product.findFirst({
    where: { id: productId, ...activeScope },
  });
}

// Liste  le stock disponible) : uniquement les produits qui ont encore du stock (quantity > 0) avec les infos essentielles (nom, prix, image).
export async function getAvailableProducts() {
  return prisma.product.findMany({
    where: {
      ...activeScope,
      quantity: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      image: true,
      sellingPrice: true,
      quantity: true,
      commission: true,
      expiresAt: true,
      producedAt: true,
    },
  });
}
