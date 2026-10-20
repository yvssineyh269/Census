import z from "zod";

export const cancelSaleSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, { message: "Une note d'au moins 5 caractères est requise pour justifier l'annulation" })
    .max(500, { message: "La note ne peut pas dépasser 500 caractères" }),
});
