"use server";

import { prisma } from "@/lib/db";
import { getCurrentSession } from "./current-session";
import { activeScope } from "@/lib/active-scope";
import { saleSelectBySaleperson } from "@/query/saleperson.query";

export async function clauseSale(productId: string) {
    const session = await getCurrentSession();

    if (!session || session.user.role !== "saleperson") {
        throw new Error("Unauthorized");
    }

    const product = await prisma.product.findFirst({
        where: { id: productId, quantity: { gt: 0 }, ...activeScope },
    });

    if (!product) {
        throw new Error("Product not found or out of stock");
    }

    const sale = await prisma.sale.create({
        select: saleSelectBySaleperson,
        data: {
            salepersonId: session.user.id,
            productId: product.id,
            sellingPrice: product.sellingPrice,
            commission: product.commission,
            quantity: 1,
            status: "pending",
        },
    });

    return sale;

}
