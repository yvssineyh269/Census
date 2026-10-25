import { prisma } from "@/lib/db";
import { getPeriodRange } from "@/lib/period-range";

// L'assistant(e) est payé(e) 250 KMF par vente qu'il/elle a validée
export const ASSISTANT_COMMISSION_PER_SALE = 250;

// Ventes en attente de validation (tous télévendeurs confondus)
export async function getPendingSalesCount() {
  return prisma.sale.count({ where: { status: "pending" } });
}

// Ventes validées par l'assistant(e) sur une semaine de travail (offset 0 = semaine en cours, -1 = semaine dernière)
// et commission figée sur chaque vente à la validation. Une vente annulée ensuite par l'admin n'est plus comptée.
export async function getAssistantWeeklyTotals(validatorId: string, offset = 0) {
  const { start, end } = getPeriodRange("week", offset);

  const result = await prisma.sale.aggregate({
    _count: true,
    _sum: { assistantCommission: true },
    where: {
      status: "validated",
      validatorId,
      validatedAt: { gte: start, lt: end },
    },
  });

  return {
    validatedCount: result._count,
    commission: result._sum.assistantCommission ?? 0,
  };
}
