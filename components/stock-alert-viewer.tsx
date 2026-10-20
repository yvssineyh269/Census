"use client";

import Link from "next/link";
import { AlertTriangleIcon, Bell, BellDot, PackageXIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StockAlertDto } from "@/lib/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

// Panneau des alertes de stock (admin, manager) : s'ouvre à droite, en bas sur mobile
export function StockAlertViewer({ alerts }: { alerts: StockAlertDto[] }) {
  const isMobile = useIsMobile();
  const hasAlerts = alerts.length > 0;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="relative size-8 group-data-[collapsible=icon]:opacity-0"
          variant="outline"
        >
          {hasAlerts ? <BellDot className="text-red-600" /> : <Bell />}
          {hasAlerts && (
            <span className="absolute -top-1.5 -right-1.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {alerts.length}
            </span>
          )}
          <span className="sr-only">Alertes de stock</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Alertes de stock</DrawerTitle>
          <DrawerDescription>
            {hasAlerts
              ? `${alerts.length} produit${alerts.length > 1 ? "s ont" : " a"} atteint le seuil d'alerte.`
              : "Aucun produit n'a atteint son seuil d'alerte."}
          </DrawerDescription>
        </DrawerHeader>

        {/* MESSAGES D'ALERTE */}
        <div className="flex flex-col gap-2 overflow-y-auto px-4">
          {alerts.map((product) => {
            const isOut = product.quantity === 0;
            return (
              <div
                key={product.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  isOut
                    ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                    : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
                }`}
              >
                {isOut ? (
                  <PackageXIcon className="mt-0.5 size-4 shrink-0 text-red-600" />
                ) : (
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-medium">{product.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {isOut
                      ? "Rupture de stock : plus aucun article disponible."
                      : `Il ne reste que ${product.quantity} article${product.quantity > 1 ? "s" : ""} en stock.`}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {product.quantity} / {product.stockAlert}
                </Badge>
              </div>
            );
          })}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button asChild>
              <Link href="/pages/inventory">Voir l&apos;inventaire</Link>
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
