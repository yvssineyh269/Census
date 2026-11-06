"use client";

import { ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  ColumnFiltersState,
  ColumnVisibilityState,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { columns, features } from "./columns/product-column-table";
import type { AvailableProductType, ProductSchemaDataForm } from "@/lib/types";
import { SalesDialog } from "../sale-dialog";

export default function SalepersonDataTable({
  data: initialData = [],
  products = [],
}: {
  data?: ProductSchemaDataForm[];
  products?: AvailableProductType[];
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
    getRowId: (_row, index) => `product-row-${index}`,
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
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl sm:text-4xl font-semibold">
            Mes ventes
          </h3>
        
        </div>

        {/* Filtres & Bouton de clause */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"outline"} className="flex items-center gap-2 hover:bg-primary-hover">
              <ListFilter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="gap-4">
              {/* Filtres du tableau */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Bouton de clausing */}
          <SalesDialog products={products} />
        </div>
      </div>
    </Tabs>
  );
}
