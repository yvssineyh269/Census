import { prisma } from "@/lib/db";

// Liste toutes les dépenses, les plus récentes d'abord, avec la personne qui les a créées
export async function getAllExpenses() {
  return prisma.expense.findMany({
    orderBy: [{ spentAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      amount: true,
      image: true,
      status: true,
      spentAt: true,
      createdAt: true,
      cancelledAt: true,
      cancelReason: true,
      createdBy: {
        select: { id: true, name: true, role: true },
      },
      cancelledBy: {
        select: { id: true, name: true },
      },
    },
  });
}
