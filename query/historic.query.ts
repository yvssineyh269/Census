import { prisma } from "@/lib/db";
import { saleSelectBySaleperson } from "./saleperson.query";

// 
const historicOfSale = {
    ...saleSelectBySaleperson,
    soldAt: true,
    cancelledAt: true,
    note: true,
    saleperson: {
        select: {
            id: true,
            name: true,
        }
    }
}

// Liste des ventes, les plus récentes en premier : toutes, ou celles d'un seul vendeur si salepersonId est fourni
export async function getSalesHistoric(salepersonId?: string) {
    return prisma.sale.findMany({
        where: salepersonId ? { salepersonId } : undefined,
        orderBy: { createdAt: "desc" },
        select: historicOfSale,
    });
}

// Historique des activités : uniquement les ventes traitées (validées ou annulées)
export async function getProcessedSales() {
    return prisma.sale.findMany({
        where: { status: { in: ["validated", "cancelled"] } },
        orderBy: { updatedAt: "desc" },
        select: historicOfSale,
    });
}
