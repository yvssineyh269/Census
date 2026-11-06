"use client";

import { useState } from "react";
import Link from "next/link";
import { PackagePlusIcon, SearchIcon } from "lucide-react";

import InventoryCardProduct from "@/components/inventory_card_product";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { GetAllProductsType } from "@/lib/types";

// Minuscules et sans accents : "Crème" est trouvé en tapant "creme"
const normalize = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export default function InventorySearch({
  products,
  isAdmin,
  canAddProduct,
}: {
  products: GetAllProductsType[];
  isAdmin: boolean;
  canAddProduct: boolean;
}) {
  const [search, setSearch] = useState("");
  const query = normalize(search);

  const filtered = query
    ? products.filter((product) =>
        normalize(`${product.productName} ${product.description ?? ""}`).includes(query),
      )
    : products;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* BARRE DE RECHERCHE */}
      <div className="flex items-center justify-between gap-2">
        <InputGroup className="flex-1 sm:max-w-sm">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Rechercher un produit…"
            aria-label="Rechercher un produit"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>
        {canAddProduct && (
          <Button asChild className="shrink-0 max-sm:size-8 max-sm:px-0 bg-primary-gradient text-white" variant={"outline"}>
            <Link href="/pages/inventory/add" aria-label="Nouveau produit">
              <PackagePlusIcon />
              <span className="hidden sm:inline">Nouveau produit</span>
            </Link>
          </Button>
        )}
      </div>

      {/* Cartes des produits */}
      {filtered.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center text-muted-foreground">
          <SearchIcon className="mb-4 size-10 opacity-50" />
          <h2 className="text-lg font-semibold text-foreground">Aucun produit trouvé</h2>
          <p className="mt-2 max-w-md text-sm">
            Aucun produit ne correspond à « {search.trim()} ». Vérifiez l’orthographe ou essayez un autre mot.
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <InventoryCardProduct key={item.id} products={item} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
