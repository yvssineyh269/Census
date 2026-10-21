import InventoryCardProduct from "@/components/inventory_card_product";
import { getAllProducts } from "@/query/product.query";
import { getCurrentSession } from "@/server/current-session";
import Image from "next/image";
import noProductInInventory from "@/public/no-product-in-inventory.svg"

export default async function InventoryPage() {
  const [session, products] = await Promise.all([getCurrentSession(), getAllProducts()]);
  const isAdmin = session.user.role === "admin";
  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Inventaire des produits
        </h1>
        <p className="text-muted-foreground mt-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi
          mollitia blanditiis perspiciatis in voluptates ipsam harum, obcaecati
          reiciendis aut quasi quas, odio velit itaque cumque dolorem eos.
          Quibusdam, velit repellat?
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
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <InventoryCardProduct key={item.id} products={item} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
