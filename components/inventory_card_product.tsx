import {
  Boxes,
  Eye,
  FilePieChart,
  Pencil,
  Tag,
  TagPlus,
  Wallet2,
} from "lucide-react";
import { Card } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import image from "@/public/bg.png";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { GetAllProductsType } from "@/lib/types";
import { deleteProduct } from "@/server/product-action";
import { ConfirmDeleteButton } from "./confirm-delete-button";

const actionButtonClass = {
  variant: "outline" as const,
  size: "icon" as const,
};

interface ProductProps {
  products: GetAllProductsType;
  // Modifier / Supprimer réservés à l'admin
  isAdmin: boolean;
}

const badgeClassName =
  "bg-primary-gradient flex h-7 w-full min-w-0 justify-start gap-1 tabular-nums";

export default function InventoryCardProduct({ products, isAdmin }: ProductProps) {
  return (
      <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
        <div className="flex items-stretch gap-3 p-2">
          {products.image && !products.image.startsWith("[object Object]") ? (
            <Image
              src={`/api/s3/image?key=${encodeURIComponent(products.image)}`}
              alt={products.productName}
              width={144}
              height={164}
              unoptimized
              className="h-41 w-36 min-h-36 shrink-0 self-stretch rounded-sm object-cover object-center"
            />
          ) : (
            <div>
              <Image
                src={image}
                alt="image"
                className="h-36 w-36 min-h-36 shrink-0 self-stretch rounded-sm object-cover object-center"
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <h4 className="truncate text-xl font-semibold">{products.productName}</h4>
            <p className="text-sm dark:text-gray-600 truncate mt-3">{products.description}</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {/* Badge du Prix d'achat */}
              <Badge className={badgeClassName}>
                <Tag className="size-3.5 shrink-0" />
                <span className="min-w-0 ">{products.purchasePrice}</span>
              </Badge>

              {/* Badge du prix de revente */}
              <Badge className={badgeClassName}>
                <TagPlus className="size-3.5 shrink-0" />
                <span className="min-w-0 ">{products.sellingPrice}</span>
              </Badge>
              {/* Badge d */}
              <Badge className={badgeClassName}>
                <Boxes className="size-3.5 shrink-0" />
                <span className="min-w-0 ">{products.commission}</span>
              </Badge>
              {/* Badge de la commission */}
              <Badge className={badgeClassName}>
                <Wallet2 className="size-3.5 shrink-0" />
                <span className="min-w-0 ">{products.quantity}</span>
              </Badge>
            </div>

            <div className={cn("mt-auto grid gap-2 pt-3", isAdmin ? "grid-cols-4" : "grid-cols-2")}>
              <Link
                href="#"
                aria-label="Voir"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  actionButtonClass,
                  "bg-indigo-200",
                )}
              >
                <Eye />
              </Link>

              {isAdmin && (
                <Link
                  href={`/pages/inventory/${products.id}/edit`}
                  aria-label="Modifier"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    actionButtonClass,
                    "bg-indigo-200",
                  )}
                >
                  <Pencil />
                </Link>
              )}

              <Link
                href="#"
                aria-label="Historique"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  actionButtonClass,
                  "bg-indigo-200",
                )}
              >
                <FilePieChart />
              </Link>

              {isAdmin && (
                <ConfirmDeleteButton
                  title={`Supprimer « ${products.productName} » ?`}
                  description="Le produit sera retiré de l'inventaire et ne pourra plus être vendu. L'historique de ses ventes est conservé."
                  action={deleteProduct.bind(null, products.id)}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
  );
}
