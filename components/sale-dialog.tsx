"use client";

import type { AvailableProductType, SalepersonSaleDto } from "@/lib/types"
import { useCreateSale } from "@/hooks/use-create-sale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import Image from "next/image";
import { ArchiveX, BoxIcon, Loader, PlusIcon, SearchIcon, TagPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Props {
    products: AvailableProductType[]
    onSaleCreated?: (sale: SalepersonSaleDto) => void
}


export function SalesDialog({ products, onSaleCreated }: Props) {
    const { open, setOpen, search, setSearch, pendingId, filtered, handleSale } = useCreateSale(products, onSaleCreated);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className="flex items-center gap-2 bg-primary-gradient text-white hover:bg-primary-gradient-hover"
                >
                    <PlusIcon className="size-4" />
                    <span className="hidden lg:inline">Clauser une vente</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-3xl lg:max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold leading-snug tracking-tight text-primary sm:text-xl">
                        Clauser votre vente en sélectionnant le produit vendu
                    </DialogTitle>
                    <DialogDescription>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt harum sequi ab sunt numquam tempora placeat maxime! Iure, saepe, ex non quod expedita, perspiciatis quis alias corrupti dolorum distinctio tempore.
                    </DialogDescription>
                </DialogHeader>
                {/* BARRE DE RECHERCHE */}
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un produit..." />
                </div>

                {/* LISTE DES PRODUITS */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {filtered.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 px-6 py-8 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/30 text-destructive">
                                <ArchiveX className="size-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-foreground">Aucun produit n'a été trouvé</h3>
                                <p className="text-sm text-muted-foreground">
                                    Essayez avec un autre nom de produit.
                                </p>
                            </div>
                        </div>
                    ) : (
                        filtered.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                {/* LIGNE HAUTE : image + infos */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {/* IMAGE */}
                                    {product.image ? (
                                        <div className="relative size-12 overflow-hidden rounded-md shrink-0">
                                            <Image
                                                src={`/api/s3/image?key=${encodeURIComponent(product.image)}`}
                                                alt={product.productName}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="size-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                                            <BoxIcon className="size-5 text-muted-foreground" />
                                        </div>
                                    )}

                                    {/* INFOS */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{product.productName}</p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-sm text-muted-foreground">
                                                {product.sellingPrice.toLocaleString("fr-FR")} KMF
                                            </span>
                                            <span className="text-xs text-green-600">
                                                +{product.commission.toLocaleString("fr-FR")} KMF comm.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* LIGNE BASSE (mobile) / droite (desktop) : stock + bouton */}
                                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                    <Badge variant="outline" className="text-xs">
                                        {product.quantity} en stock
                                    </Badge>
                                    <Button
                                        
                                        disabled={pendingId === product.id}
                                        onClick={() => handleSale(product.id)}
                                    >
                                        {pendingId === product.id ? (
                                            <>
                                                <Loader className="size-5 animate-spin" />
                                                <span className="text-sm">
                                                    Clôture de la vente...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <TagPlus className="size-5" />
                                                <span className="text-sm">
                                                    Clôturer
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}