import {
  getAvailableProducts,
  getProductById,
  getAllProducts,
} from "@/query/product.query";
import {
  getSalepersonMetrics,
  salepersonGetSales,
} from "@/query/saleperson.query";

// TYPE DE QUERIES
export type GetAllProductsType = Awaited<ReturnType<typeof getAllProducts>>[0];

// TYPE POUR LES DETAILS D'UN PRODUIT
export type GetProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductById>>
>;

// TYPE D'UN PRODUIT DISPONIBLE (QUANTITY > 0)
export type AvailableProductType = Awaited<
  ReturnType<typeof getAvailableProducts>
>[0];

// Type d'une commande : Représente la structure d'une seule ligne de commande dans la liste ci-dessus.
export type SalepersonSaleDto = Awaited<
  ReturnType<typeof salepersonGetSales>
>[0];

// Type des stats : Le format de retour contenant les 4 chiffres calculés par la fonction précédente.
export type SalespersonMetricsDto = Awaited<
  ReturnType<typeof getSalepersonMetrics>
>;
