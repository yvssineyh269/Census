import AddExpenseForm from "@/components/add-expense-form";
import { getCurrentSession } from "@/server/current-session";

export default async function AddExpensePage() {
  const session = await getCurrentSession();

  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Ajouter une nouvelle dépense</h1>
        <p className="text-muted-foreground mt-3">
          Renseignez les informations de la dépense en remplissant les champs ci-dessous puis importez l'image du reçu de la dépense
        </p>
      </div>
      <AddExpenseForm createdByName={session.user.name} />
    </div>
  );
}
