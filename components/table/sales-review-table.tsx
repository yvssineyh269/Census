"use client";

import { useState } from "react";
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import type { SaleHistoricDto } from "@/lib/types";
import type { Role } from "@/lib/roles";
import { useSaleStatus } from "@/hooks/use-sale-status";
import { CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Image from "next/image";
import noSaleImage from "@/public/clause-a-sale.svg"

type StatusFilter = "pending" | "validated" | "cancelled" | "all";

const STATUS_LABEL = {
  pending: "En attente",
  validated: "Validée",
  cancelled: "Annulée",
} as const;

const STATUS_CLASS = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  validated: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as const;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "validated", label: "Validées" },
  { value: "cancelled", label: "Annulées" },
  { value: "all", label: "Toutes" },
];

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function SalesReviewTable({
  sales,
  role,
}: {
  sales: SaleHistoricDto[];
  role: Role;
}) {
  const isAdmin = role === "admin";
  const isValidator = role === "manager" || role === "accountant";
  // Le télévendeur ne voit que ses propres ventes : la colonne "Vendeur" est inutile
  const isSaleperson = role === "saleperson";
  const [filter, setFilter] = useState<StatusFilter>(isValidator ? "pending" : "all");
  const { pendingId, handleValidate, handleCancel, handleDelete } = useSaleStatus();

  const visibleSales =
    filter === "all" ? sales : sales.filter((sale) => sale.status === filter);

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* FILTRES PAR STATUT */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={filter === item.value ? "default" : "outline"}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
            <span className="text-xs opacity-70">
              {item.value === "all"
                ? sales.length
                : sales.filter((sale) => sale.status === item.value).length}
            </span>
          </Button>
        ))}
      </div>

      <CardContent className="overflow-x-auto rounded-lg border p-0">
        <Table className="w-full">
          {/* En-têtes du tableau */}
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit</TableHead>
              {!isSaleperson && <TableHead>Vendeur</TableHead>}
              <TableHead>Prix de revente</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Traitée par</TableHead>
              <TableHead>Note</TableHead>
              {!isSaleperson && <TableHead className="text-right"></TableHead>}
            </TableRow>
          </TableHeader>

          {/* Données du tableau */}
          <TableBody>
            {visibleSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSaleperson ? 7 : 9} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex size-28 items-center justify-center rounded-full bg-muted/60">
                      <Image
                        src={noSaleImage}
                        alt="Aucune vente à afficher"
                        className="size-24 object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Aucune vente trouvée</h3>
                      <p className="text-sm text-muted-foreground">
                        Aucune vente ne correspond à ce filtre.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              visibleSales.map((sale) => {
                const isBusy = pendingId === sale.id;
                const handledBy =
                  sale.status === "validated"
                    ? sale.validatedBy?.name
                    : sale.status === "cancelled"
                      ? sale.cancelledBy?.name
                      : null;

                return (
                  <TableRow key={sale.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(sale.createdAt)}</TableCell>
                    <TableCell className="font-medium">{sale.product.productName}</TableCell>
                    {!isSaleperson && <TableCell>{sale.saleperson.name}</TableCell>}
                    <TableCell className="whitespace-nowrap">
                      {sale.sellingPrice.toLocaleString("fr-FR")}{" "}
                      <span className="text-sm text-indigo-600">KMF</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {sale.commission.toLocaleString("fr-FR")}{" "}
                      <span className="text-sm text-orange-600">KMF</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_CLASS[sale.status]}>{STATUS_LABEL[sale.status]}</Badge>
                    </TableCell>
                    <TableCell>{handledBy ?? "—"}</TableCell>
                    <TableCell className="max-w-48 truncate" title={sale.note ?? undefined}>
                      {sale.note ?? "—"}
                    </TableCell>
                    {!isSaleperson && (
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {/* MANAGER / COMPTABLE : valider ou annuler une vente en attente */}
                        {isValidator && sale.status === "pending" && (
                          <>
                            <Button disabled={isBusy} onClick={() => handleValidate(sale.id)} className="bg-green-600/30">
                              <CheckIcon className="text-green-500"/>
                            </Button>
                            <CancelSaleDialog
                              noteRequired
                              disabled={isBusy}
                              onConfirm={(note) => handleCancel(sale.id, note)}
                            />
                          </>
                        )}

                        {/* ADMIN : corriger une vente validée à tort et supprimer */}
                        {isAdmin && sale.status === "validated" && (
                          <CancelSaleDialog
                            noteRequired={false}
                            disabled={isBusy}
                            onConfirm={(note) => handleCancel(sale.id, note)}
                          />
                        )}
                        {isAdmin && (
                          <DeleteSaleDialog
                            disabled={isBusy}
                            restoresStock={sale.status === "validated"}
                            onConfirm={() => handleDelete(sale.id)}
                          />
                        )}
                      </div>
                    </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}

// Dialog d'annulation avec la note de justification
function CancelSaleDialog({
  noteRequired,
  disabled,
  onConfirm,
}: {
  noteRequired: boolean;
  disabled: boolean;
  onConfirm: (note: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isNoteValid = !noteRequired || note.trim().length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNoteValid) return;
    setSubmitting(true);
    const success = await onConfirm(note);
    setSubmitting(false);
    if (success) {
      setNote("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="bg-destructive/30">
          <XIcon className="text-destructive"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Annuler la vente</DialogTitle>
            <DialogDescription>
              {noteRequired
                ? "Expliquez pourquoi cette vente est annulée. Cette note est obligatoire."
                : "La vente validée sera annulée et le produit remis en stock."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cancel-note">
              Motif de l&apos;annulation{noteRequired ? " *" : " (facultatif)"}
            </Label>
            <Textarea
              id="cancel-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex. : le client a renoncé à l'achat"
              maxLength={500}
            />
            {noteRequired && note.length > 0 && !isNoteValid && (
              <p className="text-sm text-destructive">La note doit contenir au moins 5 caractères.</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Retour
            </Button>
            <Button type="submit" variant="destructive" disabled={!isNoteValid || submitting}>
              {submitting ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Confirmation de suppression (admin)
function DeleteSaleDialog({
  disabled,
  restoresStock,
  onConfirm,
}: {
  disabled: boolean;
  restoresStock: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={disabled}>
          <Trash2Icon />
          <span className="sr-only">Supprimer</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette vente ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est définitive.
            {restoresStock && " La vente étant validée, le produit sera remis en stock."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Retour</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
