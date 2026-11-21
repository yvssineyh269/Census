import { tryCatch } from "@/lib/try-catch";
import type { ExpenseSchemaDataForm } from "@/lib/types";
import { expenseSchema } from "@/schemas/zod/expense.schema";
import { addExpense } from "@/server/expense-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useAddExpense() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ExpenseSchemaDataForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      image: "",
      title: "",
      description: "",
      amount: 0,
      spentAt: new Date().toISOString().slice(0, 10),
      status: "scheduled",
    },
  });

  const handleAddExpense = (values: ExpenseSchemaDataForm) => {
    startTransition(async () => {
      const result = await tryCatch(addExpense(values));

      if (result.error || result.data.status !== "success") {
        toast.error(
          result.error
            ? "Une erreur a eu lieu lors de l'enregistrement de la dépense"
            : result.data.message,
        );
        return;
      }

      toast.success("La dépense a été ajoutée avec succès");
      router.push("/pages/expenses");
      router.refresh();
    });
  };

  return { form, isPending, handleAddExpense };
}
