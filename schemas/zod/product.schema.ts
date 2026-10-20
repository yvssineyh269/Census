import z from "zod";

export const productShcema = z
  .object({
    image: z
      .string({ message: "L'image du produit est requis" })
      .min(1, { message: "L'image est obligatoire" }),
    productName: z
      .string()
      .min(1, { message: "Le nom du produit est requis" })
      .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" }),
    description: z
      .string()
      .max(1000, "La description ne peut pas dépasser 1000 caractères")
      .optional(),
    purchasePrice: z
      .number({ message: "Le prix d'achat est requis" })
      .positive({ message: "Le prix d'achat doit être positif" }),
    sellingPrice: z
      .number({ message: "Le prix de revente est requis" })
      .positive({ message: "Le prix doit être positif" }),
    commission: z
      .number({ message: "La commission est requise" })
      .min(0, { message: "La commission ne peut pas être négative" })
      .max(5000, { message: "La commission ne peut pas dépasser 5000 KMF" }),
    quantity: z
      .number({ message: "La quantité est requise" })
      .int("La quantité doit être un nombre entier")
      .min(0, { message: "La quantité ne peut pas être négative" }),
    producedAt: z.string().date("Format de date invalide").optional().or(z.literal("")),
    expiresAt: z.string().date("Format de date invalide").optional().or(z.literal("")),
  })
  .refine((values) => values.sellingPrice >= values.purchasePrice, {
    message: "Le prix de revente doit être supérieur ou égal au prix d'achat",
    path: ["sellingPrice"],
  });