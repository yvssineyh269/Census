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
import { getAllUsers } from "@/query/user.query";
import { getDailyMarginTotals, getMarginChartData, getMonthlyMarginTotals } from "@/query/margin.query";
import { getAllExpenses } from "@/query/expense.query";
import { expenseSchema } from "@/schemas/zod/expense.schema";
import { productShcema } from "@/schemas/zod/product.schema";
import z from "zod";

// TYPE POUR LES UTILISATEURS : un utilisateur dans la liste du personnel
export type UserListDto = Awaited<
  ReturnType<typeof getAllUsers>
>[0];

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

// TYPE DES DONNEES DU GRAPHIQUE DES MARGES (brute / nette) sur une période
export type MarginChartDto = Awaited<
  ReturnType<typeof getMarginChartData>
>;

// TOTAUX D'UNE JOURNEE (et de la veille) pour les cartes d'analyse
export type DailyMarginDto = Awaited<
  ReturnType<typeof getDailyMarginTotals>
>;

// MARGES BRUTE / NETTE PAR MOIS sur une année
export type MonthlyMarginDto = Awaited<
  ReturnType<typeof getMonthlyMarginTotals>
>;

// TYPE DES DONNEES DU FORMULAIRE D'UNE DEPENSE
export type ExpenseSchemaDataForm = z.infer<typeof expenseSchema>;

// TYPE D'UNE DEPENSE DANS LA LISTE (avec la personne qui l'a créée)
export type ExpenseListDto = Awaited<
  ReturnType<typeof getAllExpenses>
>[0];
