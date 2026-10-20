"use client";

import { useState } from "react";
import {
  ColumnFiltersState,
  FlexRender,
  PaginationState,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import type { SaleHistoricDto } from "@/lib/types";
import { historicColumns, historicFeatures } from "./columns/historic-column-table";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type StatusFilter = "all" | "validated" | "cancelled";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "validated", label: "Validées" },
  { value: "cancelled", label: "Annulées" },
];

export default function HistoricDataTable({ sales }: { sales: SaleHistoricDto[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "handledAt", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 15 });

  const table = useTable({
    features: historicFeatures,
    data: sales,
    columns: historicColumns,
    state: { sorting, columnFilters, globalFilter, pagination },
    globalFilterFn: "includesString",
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  const statusFilter = (columnFilters.find((filter) => filter.id === "status")?.value ?? "all") as StatusFilter;

  const setStatusFilter = (value: StatusFilter) => {
    setColumnFilters(value === "all" ? [] : [{ id: "status", value }]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* BARRE DE RECHERCHE : produit, télévendeur(se), personne ayant traité la vente */}
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            placeholder="Rechercher un produit, un vendeur..."
          />
        </div>

        {/* FILTRES PAR STATUT */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant={statusFilter === item.value ? "default" : "outline"}
              onClick={() => setStatusFilter(item.value)}
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
      </div>

      <CardContent className="overflow-x-auto rounded-lg border p-0">
        <Table className="w-full">
          {/* En-têtes du tableau */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : <FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Données du tableau */}
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={historicColumns.length} className="h-24 text-center text-muted-foreground">
                  Aucune activité à afficher.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* PAGINATION */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredCount} vente{filteredCount > 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <span>
            Page {table.getPageCount() === 0 ? 0 : pagination.pageIndex + 1} sur {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Page précédente</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRightIcon />
            <span className="sr-only">Page suivante</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
