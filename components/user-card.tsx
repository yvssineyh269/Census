import Link from "next/link";
import { AtSignIcon, HandCoinsIcon, MailIcon, Pencil, ShoppingCartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteUser } from "@/server/user-action";
import { buttonVariants } from "./ui/button";
import { ConfirmDeleteButton } from "./confirm-delete-button";
import type { UserListDto } from "@/lib/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

const badgeClassName =
  "bg-primary-gradient flex h-7 w-full min-w-0 justify-start gap-1 tabular-nums";

interface Props {
  user: UserListDto;
  // Résultats de la semaine, uniquement pour les télévendeurs
  weeklyResults?: { totalSales: number; totalCommission: number };
  // Modifier / Supprimer réservés à l'admin ; il ne peut pas supprimer son propre compte
  isAdmin: boolean;
  isCurrentUser: boolean;
}

// Initiales affichées dans l'avatar (ex. "Yassine Hassane" → "YH")
const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function UserCard({ user, weeklyResults, isAdmin, isCurrentUser }: Props) {
  return (
    <Card className="gap-3 p-4 transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary-gradient font-semibold text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <h4 className="truncate text-lg font-semibold">{user.name}</h4>
          {user.username && (
            <span className="flex items-center gap-1 truncate text-sm text-muted-foreground">
              <AtSignIcon className="size-3.5 shrink-0" />
              {user.username}
            </span>
          )}
        </div>

        {/* ACTIONS ADMIN */}
        {isAdmin && (
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/pages/personnals/${user.id}/edit`}
              aria-label="Modifier"
              className={cn(buttonVariants({ variant: "outline", size: "icon" }), "bg-indigo-200")}
            >
              <Pencil />
            </Link>
            {!isCurrentUser && (
              <ConfirmDeleteButton
                title={`Supprimer le compte de ${user.name} ?`}
                description="Le compte sera supprimé définitivement et la personne ne pourra plus se connecter. Un compte lié à des ventes ne peut pas être supprimé."
                action={deleteUser.bind(null, user.id)}
              />
            )}
          </div>
        )}
      </div>

      <span className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
        <MailIcon className="size-3.5 shrink-0" />
        {user.email}
      </span>

      {/* RESULTATS DE LA SEMAINE (télévendeurs) */}
      {weeklyResults && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Cette semaine</span>
          <div className="grid grid-cols-2 gap-2">
            <Badge className={badgeClassName} title="Ventes validées cette semaine">
              <ShoppingCartIcon className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate">
                {weeklyResults.totalSales} vente{weeklyResults.totalSales > 1 ? "s" : ""}
              </span>
            </Badge>
            <Badge className={badgeClassName} title="Commissions gagnées cette semaine">
              <HandCoinsIcon className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate">
                {weeklyResults.totalCommission.toLocaleString("fr-FR")} KMF
              </span>
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
