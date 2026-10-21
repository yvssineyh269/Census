import Link from "next/link";
import { UserPlusIcon } from "lucide-react";
import UserCard from "@/components/user-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { getAllUsers, getSalepersonsWeeklyResults } from "@/query/user.query";
import { getCurrentSession } from "@/server/current-session";

// Ordre d'affichage des sections et leur titre
const ROLE_SECTIONS: { role: Role; title: string }[] = [
  { role: "saleperson", title: "Télévendeurs" },
  { role: "admin", title: "Administrateurs" },
  { role: "manager", title: "Managers" },
  { role: "accountant", title: "Comptables" },
  { role: "assistant", title: "Assistants" },
];

const NO_RESULTS = { totalSales: 0, totalCommission: 0 };

export default async function PersonnalsPage() {
  const session = await getCurrentSession();
  const [users, weeklyResults] = await Promise.all([
    getAllUsers(),
    getSalepersonsWeeklyResults(),
  ]);

  return (
    <div className="px-4 py-6 sm:py-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Personnels</h1>
          <p className="text-muted-foreground mt-3">
            {users.length} employé{users.length > 1 ? "s" : ""}, répartis par rôle. Les résultats des
            télévendeurs portent sur les ventes validées de la semaine en cours.
          </p>
        </div>
        {/* Seul l'admin peut créer un compte */}
        {session.user.role === "admin" && (
          <Link
            href="/pages/personnals/add"
            className={cn(buttonVariants(), "bg-primary-gradient text-white hover:bg-primary-gradient-hover")}
          >
            <UserPlusIcon />
            Ajouter un employé
          </Link>
        )}
      </div>

      {/* SECTIONS PAR ROLE */}
      {ROLE_SECTIONS.map(({ role, title }) => {
        const members = users.filter((user) => user.role === role);

        return (
          <section key={role} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {members.length}
              </span>
            </div>

            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun {ROLE_LABELS[role].toLowerCase()} pour le moment.
              </p>
            ) : (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isAdmin={session.user.role === "admin"}
                    isCurrentUser={user.id === session.user.id}
                    weeklyResults={
                      role === "saleperson" ? (weeklyResults.get(user.id) ?? NO_RESULTS) : undefined
                    }
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
