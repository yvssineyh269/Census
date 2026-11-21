import z from "zod";

// Statuts qu'on peut choisir à la saisie ou au changement de statut.
// "cancelled" n'en fait pas partie : seule l'annulation par l'admin y mène.
export const EXPENSE_STATUSES = ["scheduled", "in_progress", "done"] as const;
export type ActiveExpenseStatus = (typeof EXPENSE_STATUSES)[number];

// Motif obligatoire pour annuler une dépense (mêmes règles que la note d'annulation d'une vente)
export const cancelExpenseSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, { message: "Un motif d'au moins 5 caractères est requis pour annuler la dépense" })
    .max(500, { message: "Le motif ne peut pas dépasser 500 caractères" }),
});

export const expenseSchema = z.object({
  image: z
    .string({ message: "L'image de la dépense est requise" })
    .min(1, { message: "L'image est obligatoire" }),
  title: z
    .string()
    .trim()
    .min(1, { message: "Le titre de la dépense est requis" })
    .max(150, { message: "Le titre ne peut pas dépasser 150 caractères" }),
  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),
  amount: z
    .number({ message: "Le montant est requis" })
    .positive({ message: "Le montant doit être supérieur à 0" }),
  spentAt: z.string().date("Format de date invalide"),
  status: z.enum(EXPENSE_STATUSES, { message: "Statut invalide" }),
});
