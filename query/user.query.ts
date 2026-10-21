import { prisma } from "@/lib/db";
import { getWeekRange } from "@/lib/week-range";

// Liste de tous les utilisateurs, triés par nom
export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
}

// Résultats de la semaine en cours (samedi 10h → samedi 10h) pour chaque télévendeur :
// nombre de ventes validées et total des commissions, indexés par id du vendeur
export async function getSalepersonsWeeklyResults() {
  const { start, end } = getWeekRange();

  const results = await prisma.sale.groupBy({
    by: ["salepersonId"],
    where: {
      status: "validated",
      soldAt: { gte: start, lt: end },
    },
    _count: { _all: true },
    _sum: { commission: true },
  });

  return new Map(
    results.map((result) => [
      result.salepersonId,
      {
        totalSales: result._count._all,
        totalCommission: result._sum.commission ?? 0,
      },
    ]),
  );
}

// Détail d'un utilisateur (même forme que la liste)
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
}
