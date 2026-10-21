import { prisma } from "@/lib/db";
import { getPeriodRange, type Period } from "@/lib/period-range";

// Marges des ventes validées sur une période, par jour :
// - marge brute = prix de vente − prix d'achat
// - marge nette = marge brute − commission du télévendeur
// Le prix d'achat est celui actuellement enregistré sur le produit (la vente ne le mémorise pas).
export async function getMarginChartData(period: Period, offset: number) {
  const { start, end, buckets } = getPeriodRange(period, offset);

  const sales = await prisma.sale.findMany({
    where: {
      status: "validated",
      soldAt: { gte: start, lt: end },
    },
    select: {
      soldAt: true,
      sellingPrice: true,
      commission: true,
      quantity: true,
      product: { select: { purchasePrice: true } },
    },
  });

  const data = buckets.map((bucket) => ({
    date: bucket.start.toISOString(),
    gross: 0,
    net: 0,
  }));

  for (const sale of sales) {
    const index = buckets.findIndex(
      (bucket) => sale.soldAt >= bucket.start && sale.soldAt < bucket.end,
    );
    if (index === -1) continue;

    const gross = (sale.sellingPrice - sale.product.purchasePrice) * sale.quantity;
    data[index].gross += gross;
    data[index].net += gross - sale.commission * sale.quantity;
  }

  return {
    period,
    offset,
    start: start.toISOString(),
    // Dernier instant inclus dans la période, pour l'affichage "du ... au ..."
    end: new Date(end.getTime() - 1).toISOString(),
    salesCount: sales.length,
    data,
  };
}

// Totaux d'une semaine de travail (offset 0 = semaine en cours, -1 = semaine dernière) :
// chiffre d'affaires, marge brute, marge nette et commissions des ventes validées
export async function getWeeklyMarginTotals(offset = 0) {
  const { start, end } = getPeriodRange("week", offset);

  const sales = await prisma.sale.findMany({
    where: {
      status: "validated",
      soldAt: { gte: start, lt: end },
    },
    select: {
      sellingPrice: true,
      commission: true,
      quantity: true,
      product: { select: { purchasePrice: true } },
    },
  });

  return sales.reduce(
    (totals, sale) => {
      const revenue = sale.sellingPrice * sale.quantity;
      const gross = revenue - sale.product.purchasePrice * sale.quantity;
      const commission = sale.commission * sale.quantity;
      return {
        salesCount: totals.salesCount + 1,
        revenue: totals.revenue + revenue,
        gross: totals.gross + gross,
        net: totals.net + gross - commission,
        commission: totals.commission + commission,
      };
    },
    { salesCount: 0, revenue: 0, gross: 0, net: 0, commission: 0 },
  );
}
