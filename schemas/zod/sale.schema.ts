import z from "zod";

export const cancelSaleSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, { message: "Une note d'au moins 5 caractères est requise pour justifier l'annulation" })
    .max(500, { message: "La note ne peut pas dépasser 500 caractères" }),
});

// Ajustement du "dernier prix" d'une vente par l'admin (prix réellement encaissé et commission)
export const adjustSaleSchema = z
  .object({
    sellingPrice: z
      .number({ message: "Le prix de revente est requis" })
      .positive({ message: "Le prix de revente doit être supérieur à 0" })
      .max(100_000_000, { message: "Le prix de revente est trop élevé" }),
    commission: z
      .number({ message: "La commission est requise" })
      .min(0, { message: "La commission ne peut pas être négative" }),
  })
  .refine((values) => values.commission <= values.sellingPrice, {
    message: "La commission ne peut pas dépasser le prix de revente",
    path: ["commission"],
  });
