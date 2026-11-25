"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronRight,
  Ban,
  CalendarClock,
  Check,
  Loader,
  MoreVertical,
  ReceiptText,
  Trash,
} from "lucide-react";
import type { ExpenseListDto } from "@/lib/types";
import { ROLE_LABELS, isRole } from "@/lib/roles";
import { EXPENSE_STATUS_LABELS } from "@/lib/expense-status";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import {
  cancelExpenseSchema,
  EXPENSE_STATUSES,
  type ActiveExpenseStatus,
} from "@/schemas/zod/expense.schema";
import { cancelExpense, deleteExpense, updateExpenseStatus } from "@/server/expense-action";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ExpenseStatusBadge } from "./expense-status-badge";

// Les dates de dépense sont stockées à minuit UTC : on les affiche en UTC pour ne pas décaler le jour
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const longDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_ICONS = {
  scheduled: CalendarClock,
  in_progress: Loader,
  done: Check,
} satisfies Record<ActiveExpenseStatus, typeof Check>;

// Action (annuler / supprimer) en attente de confirmation
type AdminAction = { type: "cancel" | "delete"; expense: ExpenseListDto };

type ActionResult = { status: string; message: string };

const formatAmount = (amount: number) => `${amount.toLocaleString("fr-FR")} KMF`;

const imageUrl = (key: string) => `/api/s3/image?key=${encodeURIComponent(key)}`;

function ExpenseThumbnail({ expense, className }: { expense: ExpenseListDto; className?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg bg-muted", className)}>
      {expense.image ? (
        <Image
          src={imageUrl(expense.image)}
          alt={expense.title}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <ReceiptText className="absolute inset-0 m-auto size-6 text-muted-foreground" />
      )}
    </div>
  );
}

export default function ExpenseList({
  expenses,
  canManage,
  canDelete,
}: {
  expenses: ExpenseListDto[];
  // Admin et comptable : changer le statut et annuler. Manager : création uniquement (pas de statut ni d'annulation).
  canManage: boolean;
  // Admin uniquement : suppression définitive
  canDelete: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // On garde l'id (et non une copie) : après router.refresh(), le panneau affiche les données à jour
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ActiveExpenseStatus | null>(null);
  const [adminAction, setAdminAction] = useState<AdminAction | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const openAdminAction = (action: AdminAction) => {
    setCancelReason("");
    setReasonError(null);
    setAdminAction(action);
  };

  const selected = expenses.find((expense) => expense.id === selectedId) ?? null;

  const openDetails = (expense: ExpenseListDto) => {
    setSelectedId(expense.id);
    setOpen(true);
  };

  const runAction = (action: () => Promise<ActionResult>, onDone?: () => void) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(action());

      if (error || data.status !== "success") {
        toast.error(error ? "Une erreur est survenue, réessayez." : data.message);
      } else {
        toast.success(data.message);
        router.refresh();
      }
      onDone?.();
    });
  };

  const changeStatus = (expense: ExpenseListDto, status: ActiveExpenseStatus) => {
    if (expense.status === status) return;
    setPendingStatus(status);
    runAction(() => updateExpenseStatus(expense.id, status), () => setPendingStatus(null));
  };

  const confirmAdminAction = () => {
    if (!adminAction) return;
    const { type, expense } = adminAction;

    if (type === "delete") {
      // La dépense va disparaître de la liste : on ferme son panneau s'il est ouvert
      if (selectedId === expense.id) setOpen(false);
      runAction(() => deleteExpense(expense.id), () => setAdminAction(null));
    } else {
      // Motif obligatoire, vérifié ici pour un retour immédiat puis à nouveau côté serveur
      const validation = cancelExpenseSchema.safeParse({ reason: cancelReason });
      if (!validation.success) {
        setReasonError(validation.error.issues[0].message);
        return;
      }
      runAction(() => cancelExpense(expense.id, validation.data.reason), () => setAdminAction(null));
    }
  };

  return (
    <>
      {/* @container : la mise en page suit la largeur réelle du contenu (sidebar ouverte ou fermée), pas celle de l'écran */}
      <div className="@container rounded-xl border bg-card px-2 py-1 @lg:px-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-normal tracking-wide text-muted-foreground uppercase">
                Titre
              </TableHead>
              <TableHead className="hidden text-xs font-normal tracking-wide text-muted-foreground uppercase @2xl:table-cell">
                Montant
              </TableHead>
              <TableHead className="hidden text-xs font-normal tracking-wide text-muted-foreground uppercase @2xl:table-cell">
                Statut
              </TableHead>
              <TableHead>
                <span className="sr-only">Détails</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                {/* TITRE : image + titre + auteur et date */}
                <TableCell className="py-3 whitespace-normal">
                  <div className="flex min-w-0 items-center gap-3 @lg:gap-4">
                    <ExpenseThumbnail
                      expense={expense}
                      className="hidden h-14 w-20 @sm:block @2xl:h-20 @2xl:w-28"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-base font-medium @2xl:text-lg">
                        {expense.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Par {expense.createdBy.name}
                        <span className="mx-1.5" aria-hidden="true">•</span>
                        {dateFormatter.format(expense.spentAt)}
                      </p>
                      {/* En largeur réduite, montant et statut passent sous le titre */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 @2xl:hidden">
                        <span className="font-semibold tabular-nums">
                          {formatAmount(expense.amount)}
                        </span>
                        <ExpenseStatusBadge status={expense.status} className="px-2 py-0.5 text-xs" />
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* MONTANT */}
                <TableCell className="hidden text-base tabular-nums @2xl:table-cell">
                  {formatAmount(expense.amount)}
                </TableCell>

                {/* STATUT */}
                <TableCell className="hidden @2xl:table-cell">
                  <ExpenseStatusBadge status={expense.status} />
                </TableCell>

                {/* DETAILS (+ menu d'actions admin / comptable) */}
                <TableCell className="w-0 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto gap-1 rounded-none bg-bottom bg-no-repeat px-0 pb-0.5 text-foreground hover:underline"
                      onClick={() => openDetails(expense)}
                    >
                      <span className="hidden @md:inline">Détails</span>
                      <ChevronRight aria-hidden="true" />
                      <span className="sr-only @md:hidden">Détails de {expense.title}</span>
                    </Button>

                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" size="icon-sm" disabled={isPending}>
                            <MoreVertical />
                            <span className="sr-only">Actions sur {expense.title}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            disabled={expense.status === "cancelled"}
                            onSelect={() => openAdminAction({ type: "cancel", expense })}
                          >
                            <Ban />
                            Annuler la dépense
                          </DropdownMenuItem>
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => openAdminAction({ type: "delete", expense })}
                              >
                                <Trash />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PANNEAU DE DETAILS A DROITE */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="pr-12">
                <SheetTitle className="text-xl font-semibold">{selected.title}</SheetTitle>
                <SheetDescription>Détails de la dépense</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                <ExpenseThumbnail expense={selected} className="aspect-video w-full rounded-xl" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-2xl font-bold tabular-nums">{formatAmount(selected.amount)}</p>
                  <ExpenseStatusBadge status={selected.status} />
                </div>

                {/* CHANGEMENT DE STATUT (admin / comptable) */}
                {canManage && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Changer le statut</h3>
                    {selected.status === "cancelled" ? (
                      <p className="rounded-lg border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
                        Cette dépense a été annulée, son statut ne peut plus être modifié.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Statut de la dépense">
                        {EXPENSE_STATUSES.map((status) => {
                          const Icon = STATUS_ICONS[status];
                          const isCurrent = selected.status === status;
                          const isLoading = pendingStatus === status;
                          return (
                            <Button
                              key={status}
                              type="button"
                              variant={isCurrent ? "default" : "outline"}
                              aria-pressed={isCurrent}
                              disabled={isPending}
                              onClick={() => changeStatus(selected, status)}
                              className={cn(
                                "h-auto flex-col gap-1 px-2 py-2 text-xs whitespace-normal",
                                isCurrent && "bg-primary-gradient text-white",
                              )}
                            >
                              {isLoading ? <Loader className="animate-spin" /> : <Icon />}
                              {EXPENSE_STATUS_LABELS[status]}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <dl className="divide-y rounded-lg border text-sm">
                  <DetailRow label="Date de la dépense">
                    <span className="first-letter:uppercase">
                      {longDateFormatter.format(selected.spentAt)}
                    </span>
                  </DetailRow>
                  <DetailRow label="Créée par">
                    {selected.createdBy.name}
                    {isRole(selected.createdBy.role) && (
                      <span className="block text-xs text-muted-foreground">
                        {ROLE_LABELS[selected.createdBy.role]}
                      </span>
                    )}
                  </DetailRow>
                  <DetailRow label="Enregistrée le">
                    {dateTimeFormatter.format(selected.createdAt)}
                  </DetailRow>
                  {selected.cancelledAt && (
                    <DetailRow label="Annulée le">
                      {dateTimeFormatter.format(selected.cancelledAt)}
                      {selected.cancelledBy && (
                        <span className="block text-xs text-muted-foreground">
                          par {selected.cancelledBy.name}
                        </span>
                      )}
                    </DetailRow>
                  )}
                </dl>

                {selected.cancelReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                    <h3 className="mb-1 text-sm font-medium text-destructive">Motif de l'annulation</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{selected.cancelReason}</p>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 text-sm font-medium">Description</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {selected.description || "Aucune description pour cette dépense."}
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* CONFIRMATION DES ACTIONS (annuler : admin / comptable, supprimer : admin) */}
      <AlertDialog
        open={!!adminAction}
        onOpenChange={(isOpen) => !isOpen && !isPending && setAdminAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminAction?.type === "delete" ? "Supprimer la dépense ?" : "Annuler la dépense ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminAction?.type === "delete"
                ? `« ${adminAction.expense.title} » et son image seront définitivement supprimées. Cette action est irréversible.`
                : `« ${adminAction?.expense.title} » restera visible avec le statut « Annulée » et son statut ne pourra plus être modifié.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {adminAction?.type === "cancel" && (
            <Field>
              <FieldLabel htmlFor="cancel-reason">Motif de l'annulation</FieldLabel>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(event) => {
                  setCancelReason(event.target.value);
                  setReasonError(null);
                }}
                placeholder="Expliquez pourquoi cette dépense est annulée"
                maxLength={500}
                disabled={isPending}
                aria-invalid={!!reasonError}
                autoFocus
              />
              {reasonError && (
                <FieldDescription className="text-sm text-destructive">{reasonError}</FieldDescription>
              )}
            </Field>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Retour</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={(event) => {
                // On garde la boîte ouverte pendant l'action pour afficher le chargement
                event.preventDefault();
                confirmAdminAction();
              }}
            >
              {isPending && <Loader className="animate-spin" />}
              {adminAction?.type === "delete" ? "Supprimer" : "Annuler la dépense"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-3 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
