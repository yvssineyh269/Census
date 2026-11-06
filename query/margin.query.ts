import { prisma } from "@/lib/db";
import { getPeriodRange, type Period } from "@/lib/period-range";
import { fromComorosTime, toComorosWallClock } from "@/lib/week-range";

// Marges des ventes validées sur une période, par jour :
// - marge brute = prix de vente − prix d'achat
// - marge nette = marge brute − commission du télévendeur − commission de l'assistant(e) (figée à la validation)
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
      assistantCommission: true,
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
    data[index].net += gross - sale.commission * sale.quantity - sale.assistantCommission;
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

type SaleForTotals = {
  sellingPrice: number;
  commission: number;
  quantity: number;
  assistantCommission: number;
  product: { purchasePrice: number };
};

const TOTALS_SELECT = {
  sellingPrice: true,
  commission: true,
  quantity: true,
  product: { select: { purchasePrice: true } },
  assistantCommission: true,
} as const;

// Chiffre d'affaires, marge brute, marge nette et commissions (télévendeurs + assistant(e)) d'un lot de ventes
function sumSales(sales: SaleForTotals[]) {
  return sales.reduce(
    (totals, sale) => {
      const revenue = sale.sellingPrice * sale.quantity;
      const gross = revenue - sale.product.purchasePrice * sale.quantity;
      const commission = sale.commission * sale.quantity + sale.assistantCommission;
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

async function getTotalsBetween(start: Date, end: Date) {
  const sales = await prisma.sale.findMany({
    where: { status: "validated", soldAt: { gte: start, lt: end } },
    select: TOTALS_SELECT,
  });
  return sumSales(sales);
}

// Totaux d'une semaine de travail (offset 0 = semaine en cours, -1 = semaine dernière) des ventes validées
export async function getWeeklyMarginTotals(offset = 0) {
  const { start, end } = getPeriodRange("week", offset);
  return getTotalsBetween(start, end);
}

// Totaux d'une journée (heure des Comores, minuit → minuit) et de la veille, pour comparaison.
// "day" au format YYYY-MM-DD.
export async function getDailyMarginTotals(day: string) {
  const [year, month, date] = day.split("-").map(Number);
  const start = fromComorosTime(year, month - 1, date);
  const end = fromComorosTime(year, month - 1, date + 1);
  const previousStart = fromComorosTime(year, month - 1, date - 1);

  const [current, previous] = await Promise.all([
    getTotalsBetween(start, end),
    getTotalsBetween(previousStart, start),
  ]);
  return { day, current, previous };
}

// Marges brute et nette de chaque mois d'une année civile (heure des Comores)
export async function getMonthlyMarginTotals(year: number) {
  const start = fromComorosTime(year, 0);
  const end = fromComorosTime(year + 1, 0);

  const sales = await prisma.sale.findMany({
    where: { status: "validated", soldAt: { gte: start, lt: end } },
    select: { ...TOTALS_SELECT, soldAt: true },
  });

  const months = Array.from({ length: 12 }, (_, month) => ({ month, gross: 0, net: 0 }));
  for (const sale of sales) {
    const month = toComorosWallClock(sale.soldAt).getUTCMonth();
    const { gross, net } = sumSales([sale]);
    months[month].gross += gross;
    months[month].net += net;
  }
  return { year, months };
}
