import type { ExpenseStatus } from "@/lib/generated/prisma/enums";

export const EXPENSE_STATUS_LABELS = {
  scheduled: "Programmée",
  in_progress: "En cours",
  done: "Effectuée",
  cancelled: "Annulée",
} satisfies Record<ExpenseStatus, string>;
