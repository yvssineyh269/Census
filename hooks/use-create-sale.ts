import { tryCatch } from "@/lib/try-catch";
import type { AvailableProductType, SalepersonSaleDto } from "@/lib/types"
import { clauseSale } from "@/server/clause-sale-action";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCreateSale( products: AvailableProductType[], onSaleCreated?: (sale: SalepersonSaleDto) => void ) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [pendingId, setPendingId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Ouverture automatique depuis le menu "Ajout rapide" (?clause=1)
    useEffect(() => {
        if (searchParams.get("clause") === "1") {
            setOpen(true);
            router.replace(pathname);
        }
    }, [searchParams, pathname, router]);

    const filtered = products.filter((product) => product.productName.toLowerCase().includes(search.toLowerCase()));

    const handleSale = async (productId: string) => {
        setPendingId(productId);
        const {data, error} = await tryCatch(clauseSale(productId));
        setPendingId(null);
        if(error || !data) {
            toast.error("Une erreur est survenue lors de la création de la vente.");
            return;
        }

        toast.success("Vente créée avec succès !");
        onSaleCreated?.(data);
        setOpen(false);
        router.refresh();
    }
    return { open, setOpen, search, setSearch, pendingId, filtered, handleSale };

}
