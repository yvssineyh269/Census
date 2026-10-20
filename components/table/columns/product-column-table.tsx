import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";
import { DragHandle } from "../drag/drag-table";
import { TableCellViewer } from "../table-cell-viewer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { ProductSchemaDataForm } from "@/lib/types";

export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

export const columnHelper = createColumnHelper<typeof features, ProductSchemaDataForm>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.index} />,
  }),

  // -- NOM DU PRODUIT
  columnHelper.accessor("productName", {
    header: "Nom du produit",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  }),

  // -- PRIX D'ACHAT
  columnHelper.accessor("purchasePrice", {
    header: "Prix d'achat",
    cell: ({ row }) => (
      <div className="w-full gap-1 flex">
        {row.original.purchasePrice}
        <span className="text-orange-600 text-sm">KMF</span>
      </div>
    ),
  }),

  // -- PRIX DE REVENTE
  columnHelper.accessor("sellingPrice", {
    header: () => <div className="w-full text-left">Prix de revente</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Enregistrement... ${row.original.productName}`,
            success: "Enregistrer",
            error: "Erreur",
          });
        }}
        className="items-start justify-items-start"
      >
        <div className="flex gap-1 items-center justify-center">
          <Input
            className="h-8 w-16 border-transparent bg-transparent text-left shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
            defaultValue={row.original.sellingPrice}
            id={`${row.index}-sellingPrice`}
          />
          <span className="text-orange-600 text-sm">KMF</span>
        </div>
      </form>
    ),
  }),

  // -- COMMISSION
  columnHelper.accessor("commission", {
    header: () => <div className="w-full text-left">Commission</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Enregistrement... ${row.original.productName}`,
            success: "Enregistrer avec succès",
            error: "Erreur d'enregistrement",
          });
        }}
        className="items-start justify-items-start"
      >
        <div className="flex gap-1 items-center justify-center">
          <Input
            className="h-8 w-16 border-transparent bg-transparent text-left shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
            defaultValue={row.original.commission}
            id={`${row.index}-commission`}
          />
          <span className="text-orange-600">KMF</span>
        </div>
      </form>
    ),
  }),

  // -- STOCK
  columnHelper.accessor("quantity", {
    header: () => <div className="w-full text-left">En Stock</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Enregistrement... ${row.original.productName}`,
            success: "Enregistrer",
            error: "Erreur",
          });
        }}
        className="items-start justify-items-start"
      >
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-left shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
          defaultValue={row.original.quantity}
          id={`${row.index}-quantity`}
          readOnly
        />
      </form>
    ),
  }),

  // -- BOUTON D'ELLIPSIS VERTICAL POUR LES ACTIONS (MODIFIER / SUPPRIMER)
  columnHelper.display({
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground"
            size="icon"
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Plus d'option</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Modifier</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]);
