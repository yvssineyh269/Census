import {
  getAvailableProducts,
  getProductById,
  getAllProducts,
  getStockAlerts,
} from "@/query/product.query";
import {
  getSalepersonMetrics,
  salepersonGetSales,
} from "@/query/saleperson.query";
import { getSalesHistoric } from "@/query/historic.query";
import { productShcema } from "@/schemas/zod/product.schema";
import z from "zod";

// TYPE POUR LES DONNEES D'UN PRODUIT
export type ProductSchemaDataForm = z.infer<typeof productShcema>;

// TYPE POUR LA LISTE DE TOUS LES PRODUITS
export type GetAllProductsType = Awaited<ReturnType<typeof getAllProducts>>[0];

// TYPE POUR LES DETAILS D'UN PRODUIT
export type GetProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductById>>
>;

// TYPE D'UN PRODUIT DISPONIBLE (QUANTITY > 0)
export type AvailableProductType = Awaited<
  ReturnType<typeof getAvailableProducts>
>[0];

// TYPE D'UNE VENTE : Représente la structure d'une seule ligne de vente dans la liste.
export type SalepersonSaleDto = Awaited<
  ReturnType<typeof salepersonGetSales>
>[0];

// TYPE POUR LES METRICS D'UN VENDEUR : Représente les statistiques d'un vendeur, incluant le nombre total de ventes, le chiffre d'affaires total, la commission totale et le nombre de produits vendus.
export type SalespersonMetricsDto = Awaited<
  ReturnType<typeof getSalepersonMetrics>
>;

// TYPE D'UNE VENTE DANS L'HISTORIQUE : vente avec le vendeur, le validateur et la note d'annulation
export type SaleHistoricDto = Awaited<
  ReturnType<typeof getSalesHistoric>
>[0];

// TYPE D'UNE ALERTE DE STOCK : produit dont la quantité a atteint son seuil d'alerte
export type StockAlertDto = Awaited<
  ReturnType<typeof getStockAlerts>
>[0];
