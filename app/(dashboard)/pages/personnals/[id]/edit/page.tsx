import { notFound } from "next/navigation";
import AddUserForm from "@/components/add-user-form";
import { requireRole } from "@/lib/authorization";
import { getUserById } from "@/query/user.query";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Modifier un employé</h1>
        <p className="text-muted-foreground mt-3">
          Modifiez les informations de {user.name}. Si son rôle change, il sera déconnecté et devra se
          reconnecter pour obtenir ses nouveaux accès.
        </p>
      </div>
      <AddUserForm user={user} />
    </div>
  );
}
