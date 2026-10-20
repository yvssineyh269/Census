import AddUserForm from "@/components/add-user-form";
import { requireRole } from "@/lib/authorization";

export default async function AddNewUserPage() {
  // Double protection avec le proxy : cette page est réservée à l'admin
  await requireRole("admin");

  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Ajouter un nouvel employé
        </h1>
        <p className="text-muted-foreground mt-3">
          L&apos;employé recevra un email pour activer son compte et choisir
          son mot de passe. Il pourra ensuite se connecter avec son email ou
          son nom d&apos;utilisateur.
        </p>
      </div>
      <AddUserForm />
    </div>
  );
}
