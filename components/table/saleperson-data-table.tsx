"use client";

import { ListFilter, PlusIcon } from "lucide-react";
import { CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Tabs, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ColumnFiltersState,
  ColumnVisibilityState,
  FlexRender,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { ProductSchemaDataForm } from "@/schemas/zod/product.schema";
import { useId, useMemo, useState } from "react";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { columns, features } from "./columns/product-column-table";

export default function SalepersonDataTable({
  data: initialData = [],
}: {
  data?: ProductSchemaDataForm[];
}) {
  const [data, setData] = useState<ProductSchemaDataForm[]>(() => initialData);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map((item, index) => item.id ?? `product-row-${index}`),
    [data],
  );

  const table = useTable({
    features,
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) => row.id ?? `product-row-${index}`,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });
  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* BARRE DE RECHERCHE */}
        <div className="flex flex-col gap-4">
          <Input id="search" placeholder="Rechercher un produit..." />
        </div>

        {/* Filtres & Bouton de clause */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ListFilter size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Filtres du tableau */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Bouton de clausing */}
          <Button
            variant={"outline"}
            className="flex items-center gap-2 bg-primary-gradient text-white hover:bg-primary-gradient-hover"
          >
            <PlusIcon />
            <span className="hidden lg:inline">Clauser une vente</span>
          </Button>
        </div>
      </div>

      {/* Contenu du tableau */}
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <CardContent className="overflow-hidden rounded-lg border">
          <Table className="w-full">
            {/* En-têtes du tableau */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Données du tableau */}
            <TableBody></TableBody>
          </Table>
        </CardContent>
      </TabsContent>
    </Tabs>
  );
}
