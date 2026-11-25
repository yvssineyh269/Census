import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import ExpenseList from "@/components/expense-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllExpenses } from "@/query/expense.query";
import { getCurrentSession } from "@/server/current-session";
import noProductInInventory from "@/public/no-product-in-inventory.svg";

export default async function ExpensesPage() {
  // L'accès à la page est limité à admin / manager / comptable (lib/settings.ts)
  const [session, expenses] = await Promise.all([getCurrentSession(), getAllExpenses()]);
  // Admin, comptable et manager enregistrent des dépenses.
  // Admin et comptable changent le statut et annulent, seul l'admin supprime.
  const role = session.user.role;
  const canCreate = role === "admin" || role === "accountant" || role === "manager";
  const canManage = role === "admin" || role === "accountant";
  const canDelete = role === "admin";

  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Crédits et dépenses</h1>
          <p className="text-muted-foreground mt-3">
            Consultez et gérez l'ensemble de vos crédits et dépenses. Ajustez vos transactions en quelques clics et gardez une visibilité constante sur votre situation financière.
          </p>
        </div>
        {canCreate && (
          <Link
            href="/pages/expenses/add"
            className={cn(buttonVariants(), "shrink-0 bg-primary-gradient text-white hover:bg-primary-gradient-hover")}
          >
            <Plus />
            Ajouter une dépense
          </Link>
        )}
      </div>
      <hr />
      {expenses.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center text-muted-foreground">
          <Image
            src={noProductInInventory}
            alt="Aucune dépense enregistrée"
            className="mb-5 h-32 w-32 object-contain rounded-full"
          />
          <h2 className="text-lg font-semibold text-foreground">Aucune dépense enregistrée</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed">
            Les dépenses que vous ajouterez apparaîtront ici avec leur montant et leur statut.
          </p>
        </div>
      ) : (
        <ExpenseList expenses={expenses} canManage={canManage} canDelete={canDelete} />
      )}
    </div>
  );
}
