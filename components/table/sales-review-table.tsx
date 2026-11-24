"use client";

import { useState } from "react";
import {
  BanIcon,
  CheckIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PackageIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import type { SaleHistoricDto } from "@/lib/types";
import { COMOROS_TIME_ZONE } from "@/lib/week-range";
import type { Role } from "@/lib/roles";
import { useSaleStatus } from "@/hooks/use-sale-status";
import { CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
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

const PAGE_SIZE = 10;

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

// Icône affichée avant le libellé du statut (même principe que les badges des dépenses)
const STATUS_ICON = {
  pending: ClockIcon,
  validated: CheckIcon,
  cancelled: BanIcon,
} as const;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "validated", label: "Validées" },
  { value: "cancelled", label: "Annulées" },
  { value: "all", label: "Toutes" },
];

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("fr-FR", {
        timeZone: COMOROS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function SalesReviewTable({
  sales,
  role,
  readOnly = false,
}: {
  sales: SaleHistoricDto[];
  role: Role;
  // Masque la colonne des actions (consultation seule)
  readOnly?: boolean;
}) {
  const isAdmin = role === "admin";
  const isValidator = role === "manager" || role === "accountant" || role === "assistant";
  // Le télévendeur ne voit que ses propres ventes : la colonne "Vendeur" est inutile
  const isSaleperson = role === "saleperson";
  const showActions = !isSaleperson && !readOnly;
  // Montant d'origine barré (vente ajustée) : prix visible par l'admin, le manager et le télévendeur ;
  // le télévendeur ne voit pas l'ancienne commission, seulement la commission ajustée
  const showOriginal = isAdmin || role === "manager" || isSaleperson;
  const showOriginalCommission = isAdmin || role === "manager";
  const [filter, setFilter] = useState<StatusFilter>(isValidator ? "pending" : "all");
  const { pendingId, handleValidate, handleCancel, handleDelete, handleAdjust } = useSaleStatus();

  const [page, setPage] = useState(0);

  const filteredSales =
    filter === "all" ? sales : sales.filter((sale) => sale.status === filter);
  const pageCount = Math.ceil(filteredSales.length / PAGE_SIZE);
  // Après une validation / annulation, la liste filtrée peut raccourcir : on reste sur une page existante
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));
  const visibleSales = filteredSales.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4 mt-10">
      {/* FILTRES PAR STATUT */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={filter === item.value ? "default" : "outline"}
            className={filter === item.value ? "bg-primary-gradient text-white" : "bg-transparent"}
            onClick={() => {
              setFilter(item.value);
              setPage(0);
            }}
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
              <TableHead>
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Produit</TableHead>
              {!isSaleperson && <TableHead>Vendeur</TableHead>}
              <TableHead>Prix de revente</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Traitée par</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
              {showActions && <TableHead className="text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          {/* Données du tableau */}
          <TableBody>
            {visibleSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={(isSaleperson ? 8 : 9) + (showActions ? 1 : 0)} className="py-14 text-center">
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
                    <TableCell className="w-0">
                      <ProductThumbnail image={sale.product.image} name={sale.product.productName} />
                    </TableCell>
                    <TableCell className="font-medium">{sale.product.productName}</TableCell>
                    {!isSaleperson && <TableCell>{sale.saleperson.name}</TableCell>}
                    <TableCell className="whitespace-nowrap">
                      <Amount value={sale.sellingPrice} original={showOriginal ? sale.originalSellingPrice : null} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Amount value={sale.commission} original={showOriginalCommission ? sale.originalCommission : null} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sale.status} />
                    </TableCell>
                    <TableCell>{handledBy ?? "—"}</TableCell>
                    <TableCell className="max-w-48 truncate" title={sale.note ?? undefined}>
                      {sale.note ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(sale.createdAt)}</TableCell>
                    {showActions && (
                    <TableCell>
                      <div className="flex justify-center gap-2">
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

                        {/* ADMIN : ajuster le dernier prix (prix réellement encaissé) et la commission */}
                        {isAdmin && sale.status !== "cancelled" && (
                          <AdjustSaleDialog
                            disabled={isBusy}
                            sale={sale}
                            onConfirm={(values) => handleAdjust(sale.id, values)}
                          />
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

      {/* PAGINATION */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredSales.length} vente{filteredSales.length > 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <span>
            Page {pageCount === 0 ? 0 : currentPage + 1} sur {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Page précédente</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRightIcon />
            <span className="sr-only">Page suivante</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Montant en KMF ; si la vente a été ajustée, le montant d'origine est affiché barré en dessous
function Amount({ value, original }: { value: number; original?: number | null }) {
  const isAdjusted = original != null && original !== value;
  return (
    <div className="flex flex-col">
      <span>
        {value.toLocaleString("fr-FR")}{" "}
        <span className="bg-clip-text text-transparent bg-primary-gradient text-[0.6rem] align-bottom">KMF</span>
      </span>
      {isAdjusted && (
        <span className="text-xs text-muted-foreground line-through" title="Montant d'origine (prix fixé)">
          {original.toLocaleString("fr-FR")} KMF
        </span>
      )}
    </div>
  );
}

// Badge de statut avec son icône
function StatusBadge({ status }: { status: keyof typeof STATUS_LABEL }) {
  const Icon = STATUS_ICON[status];
  return (
    <Badge className={STATUS_CLASS[status]}>
      <Icon aria-hidden="true" />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

// Miniature de l'image du produit (icône de repli si l'image est absente)
function ProductThumbnail({ image, name }: { image: string | null; name: string }) {
  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
      {image ? (
        <Image
          src={`/api/s3/image?key=${encodeURIComponent(image)}`}
          alt={name}
          fill
          sizes="40px"
          unoptimized
          className="object-cover"
        />
      ) : (
        <PackageIcon className="absolute inset-0 m-auto size-4 text-muted-foreground" />
      )}
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

// Ajustement du dernier prix (admin) : prix réellement encaissé et commission du télévendeur
function AdjustSaleDialog({
  sale,
  disabled,
  onConfirm,
}: {
  sale: SaleHistoricDto;
  disabled: boolean;
  onConfirm: (values: { sellingPrice: number; commission: number }) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(String(sale.sellingPrice));
  const [commission, setCommission] = useState(String(sale.commission));
  const [submitting, setSubmitting] = useState(false);

  const fixedPrice = sale.originalSellingPrice ?? sale.sellingPrice;
  const fixedCommission = sale.originalCommission ?? sale.commission;
  const priceValue = Number(price);
  const commissionValue = Number(commission);

  const priceError =
    price.trim() === "" || !Number.isFinite(priceValue) || priceValue <= 0
      ? "Le prix doit être supérieur à 0"
      : null;
  const commissionError =
    commission.trim() === "" || !Number.isFinite(commissionValue) || commissionValue < 0
      ? "La commission ne peut pas être négative"
      : !priceError && commissionValue > priceValue
        ? "La commission ne peut pas dépasser le prix"
        : null;
  const isUnchanged = priceValue === sale.sellingPrice && commissionValue === sale.commission;
  const canSubmit = !priceError && !commissionError && !isUnchanged && !submitting;

  // Écart du prix par rapport au prix fixé, multiplié par la quantité (impact sur le CA)
  const revenueDelta = priceError ? 0 : (priceValue - fixedPrice) * sale.quantity;

  // Le formulaire repart des valeurs actuelles de la vente à chaque ouverture
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setPrice(String(sale.sellingPrice));
      setCommission(String(sale.commission));
    }
    setOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    const success = await onConfirm({ sellingPrice: priceValue, commission: commissionValue });
    setSubmitting(false);
    if (success) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="bg-primary/10" title="Ajuster le dernier prix">
          <PencilIcon className="text-primary" />
          <span className="sr-only">Ajuster le dernier prix</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Ajuster le dernier prix</DialogTitle>
            <DialogDescription>
              {sale.product.productName} — vendu par {sale.saleperson.name}
              {sale.quantity > 1 ? ` (×${sale.quantity})` : ""}. Saisissez le prix réellement encaissé et la
              commission due : le chiffre d&apos;affaires et les marges seront recalculés.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prix fixé</span>
              <span>{fixedPrice.toLocaleString("fr-FR")} KMF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission d&apos;origine</span>
              <span>{fixedCommission.toLocaleString("fr-FR")} KMF</span>
            </div>
            {sale.adjustedAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Déjà ajustée le {formatDate(sale.adjustedAt)}
                {sale.adjustedBy ? ` par ${sale.adjustedBy.name}` : ""}.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`adjust-price-${sale.id}`}>Dernier prix (KMF)</FieldLabel>
              <Input
                id={`adjust-price-${sale.id}`}
                type="number"
                inputMode="numeric"
                min={0}
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {priceError && <FieldDescription className="text-destructive">{priceError}</FieldDescription>}
            </Field>
            <Field>
              <FieldLabel htmlFor={`adjust-commission-${sale.id}`}>Commission (KMF)</FieldLabel>
              <Input
                id={`adjust-commission-${sale.id}`}
                type="number"
                inputMode="numeric"
                min={0}
                step="any"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
              />
              {commissionError && (
                <FieldDescription className="text-destructive">{commissionError}</FieldDescription>
              )}
            </Field>
          </div>

          {revenueDelta !== 0 && (
            <p className="text-sm text-muted-foreground">
              Écart sur le chiffre d&apos;affaires par rapport au prix fixé :{" "}
              <span className={revenueDelta < 0 ? "text-destructive" : "text-green-600"}>
                {revenueDelta > 0 ? "+" : ""}
                {revenueDelta.toLocaleString("fr-FR")} KMF
              </span>
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Retour
            </Button>
            <Button type="submit" disabled={!canSubmit} className="bg-primary-gradient text-white">
              {submitting ? "Enregistrement..." : "Enregistrer"}
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
