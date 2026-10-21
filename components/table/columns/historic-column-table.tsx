import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SaleHistoricDto } from "@/lib/types";
import { COMOROS_TIME_ZONE } from "@/lib/week-range";

export const historicFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
  sortFns: { datetime: sortFn_datetime, text: sortFn_text },
});

const columnHelper = createColumnHelper<typeof historicFeatures, SaleHistoricDto>();

const formatDate = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("fr-FR", {
        timeZone: COMOROS_TIME_ZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const formatAmount = (amount: number) => (
  <div className="flex gap-1 whitespace-nowrap">
    {amount.toLocaleString("fr-FR")}
    <span className="text-sm text-orange-600">KMF</span>
  </div>
);

// En-tête cliquable pour trier la colonne
function SortableHeader({
  label,
  sorted,
  onToggle,
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onToggle: ((event: unknown) => void) | undefined;
}) {
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
  return (
    <Button variant="ghost" size="sm" className="-ml-2 h-8" onClick={onToggle}>
      {label}
      <Icon className="size-3.5 text-muted-foreground" />
    </Button>
  );
}

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

export const historicColumns = columnHelper.columns([
  // -- DATE DE LA CLAUSE (création de la vente par le télévendeur)
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    sortFn: "datetime",
    enableGlobalFilter: false,
    header: ({ column }) => (
      <SortableHeader label="Date de clause" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
    ),
    cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>,
  }),

  // -- PRODUIT
  columnHelper.accessor((row) => row.product.productName, {
    id: "product",
    filterFn: "includesString",
    sortFn: "text",
    header: ({ column }) => (
      <SortableHeader label="Produit" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),

  // -- TELEVENDEUR(SE)
  columnHelper.accessor((row) => row.saleperson.name, {
    id: "saleperson",
    filterFn: "includesString",
    sortFn: "text",
    header: ({ column }) => (
      <SortableHeader label="Télévendeur(se)" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
    ),
  }),

  // -- PRIX DE VENTE
  columnHelper.accessor("sellingPrice", {
    enableGlobalFilter: false,
    header: ({ column }) => (
      <SortableHeader label="Prix de vente" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
    ),
    cell: ({ row }) => formatAmount(row.original.sellingPrice),
  }),

  // -- COMMISSION
  columnHelper.accessor("commission", {
    enableGlobalFilter: false,
    header: ({ column }) => (
      <SortableHeader label="Commission" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
    ),
    cell: ({ row }) => formatAmount(row.original.commission),
  }),

  // -- STATUT (validée / annulée)
  columnHelper.accessor("status", {
    filterFn: "equalsString",
    enableGlobalFilter: false,
    enableSorting: false,
    header: "Statut",
    cell: ({ row }) => (
      <Badge className={STATUS_CLASS[row.original.status]}>{STATUS_LABEL[row.original.status]}</Badge>
    ),
  }),

  // -- TRAITEE PAR (validateur ou personne ayant annulé)
  columnHelper.accessor(
    (row) => (row.status === "validated" ? row.validatedBy?.name : row.cancelledBy?.name) ?? "—",
    {
      id: "handledBy",
      filterFn: "includesString",
      sortFn: "text",
      header: ({ column }) => (
        <SortableHeader label="Traitée par" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
      ),
    },
  ),

  // -- DATE DE TRAITEMENT (validation ou annulation)
  columnHelper.accessor(
    (row) => (row.status === "validated" ? row.validatedAt : row.cancelledAt),
    {
      id: "handledAt",
      sortFn: "datetime",
      sortUndefined: "last",
      enableGlobalFilter: false,
      header: ({ column }) => (
        <SortableHeader label="Date de traitement" sorted={column.getIsSorted()} onToggle={column.getToggleSortingHandler()} />
      ),
      cell: ({ getValue }) => <span className="whitespace-nowrap">{formatDate(getValue())}</span>,
    },
  ),

  // -- MOTIF D'ANNULATION
  columnHelper.accessor((row) => row.note ?? "", {
    id: "note",
    enableGlobalFilter: false,
    enableSorting: false,
    header: "Motif d'annulation",
    cell: ({ getValue }) => (
      <span className="block max-w-56 truncate" title={getValue() || undefined}>
        {getValue() || "—"}
      </span>
    ),
  }),
]);
