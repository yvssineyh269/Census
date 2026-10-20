import { prisma } from "@/lib/db";
import { getWeekRange } from "@/lib/week-range";

// Sélecteur Prisma : Définit quelles colonnes sont récupérées pour une commande (id, prix, commission, article lié, etc.).
export const saleSelectBySaleperson = {
  id: true,
  status: true,
  sellingPrice: true,
  commission: true,
  quantity: true,
  createdAt: true,
  validatedAt: true,

  product: {
    select: {
      id: true,
      productName: true,
      image: true,
    },
  },

  validatedBy: {
    select: {
      id: true,
      name: true,
    },
  },

  cancelledBy: {
    select: {
      id: true,
      name: true,
    },
  },
};

// Liste des ventes : Récupère toutes les ventes d'un commercial spécifique, triées de la plus récente à la plus ancienne.
export async function salepersonGetSales(salepersonId: string) {
  return prisma.sale.findMany({
    where: { salepersonId: salepersonId },
    orderBy: {
      createdAt: "desc",
    },
    select: saleSelectBySaleperson,
  });
}

// Calcul des KPIs : Calcule 4 statistiques clés pour le tableau de bord du commercial (Commission semaine, En attente, Vendues, Taux de croissance).
export async function getSalepersonMetrics(userId: string) {
  const { start, end } = getWeekRange();
  const [
    totalCommission,
    totalSalesPending,
    totalSalesSold,
    lastWeekCommission,
  ] = await Promise.all([
    // Commission de la semain courant
    prisma.sale.aggregate({
      _sum: { commission: true },
      where: {
        salepersonId: userId,
        status: "validated",
        soldAt: { gte: start, lt: end },
      },
    }),

    // Vente en attente
    prisma.sale.count({
      where: {
        salepersonId: userId,
        status: "pending",
      },
    }),

    // Ventes vendues et validé cette semaine
    prisma.sale.count({
      where: {
        salepersonId: userId,
        status: "validated",
        soldAt: { gte: start, lt: end },
      },
    }),

    // Ventes de la semaine précedente
    prisma.sale.aggregate({
      _sum: { commission: true },
      where: {
        salepersonId: userId,
        status: "validated",
        soldAt: {
          gte: new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: start,
        },
      },
    }),
  ]);

  const currentCommission = totalCommission._sum.commission ?? 0;
  const previewCommission = lastWeekCommission._sum.commission ?? 0;
  const growthRate =
    previewCommission === 0
      ? 100
      : Math.round(
          ((currentCommission - previewCommission) / previewCommission) *
            100 *
            10,
        ) / 10;
  return {
    totalSalesSold,
    totalCommission: currentCommission,
    totalSalesPending,
    growthRate,
  };
}
