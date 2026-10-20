import { tryCatch } from "@/lib/try-catch";
import { cancelSale, deleteSale, validateSale } from "@/server/sale-status-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ActionResult = { status: string; message: string };

export function useSaleStatus() {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);

    // Exécute une action serveur, affiche le résultat et rafraîchit la page en cas de succès
    const run = async (saleId: string, action: () => Promise<ActionResult>) => {
        setPendingId(saleId);
        const { data, error } = await tryCatch(action());
        setPendingId(null);

        if (error || data.status !== "success") {
            toast.error(error ? "Une erreur est survenue, réessayez." : data.message);
            return false;
        }

        toast.success(data.message);
        router.refresh();
        return true;
    };

    const handleValidate = (saleId: string) => run(saleId, () => validateSale(saleId));
    const handleCancel = (saleId: string, note: string) => run(saleId, () => cancelSale(saleId, note));
    const handleDelete = (saleId: string) => run(saleId, () => deleteSale(saleId));

    return { pendingId, handleValidate, handleCancel, handleDelete };
}
