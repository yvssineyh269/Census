import InventorySearch from "@/components/inventory-search";
import { getAllProducts } from "@/query/product.query";
import { getCurrentSession } from "@/server/current-session";
import Image from "next/image";
import noProductInInventory from "@/public/no-product-in-inventory.svg"

export default async function InventoryPage() {
  const [session, products] = await Promise.all([getCurrentSession(), getAllProducts()]);
  const isAdmin = session.user.role === "admin";
  // Mêmes rôles que l'entrée "Nouveau produit" du menu (lib/menu.ts)
  const canAddProduct = isAdmin || session.user.role === "manager";
  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Inventaire des produits
        </h1>
        <p className="text-muted-foreground mt-3">
          Consultez et gérez l'ensemble de vos produits. Ajustez vos stocks en quelques clics et gardez une visibilité constante sur votre catalogue.
        </p>
      </div>
      {/* Cartes des produits */}
      {products.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center text-muted-foreground">
          <Image
            src={noProductInInventory}
            alt="Aucun produit dans l’inventaire"
            className="mb-5 h-32 w-32 object-contain rounded-full"
          />
          <h2 className="text-lg font-semibold text-foreground">
            Aucun produit dans l’inventaire
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed">
            Vous n’avez pas encore ajouté de produit à votre inventaire. Les
            produits que vous ajouterez apparaîtront ici.
          </p>
        </div>
      ) : (
        <InventorySearch products={products} isAdmin={isAdmin} canAddProduct={canAddProduct} />
      )}
    </div>
  );
}
