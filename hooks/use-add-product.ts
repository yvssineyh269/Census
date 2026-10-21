import { tryCatch } from "@/lib/try-catch";
import type { GetProductDetail, ProductSchemaDataForm } from "@/lib/types";
import { productShcema } from "@/schemas/zod/product.schema";
import { addProduct } from "@/server/add-product-action";
import { updateProduct } from "@/server/product-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Date -> "AAAA-MM-JJ" pour les champs <input type="date">
const toInputDate = (date: Date | null) => (date ? new Date(date).toISOString().slice(0, 10) : "");

// Sans produit : ajout. Avec un produit : modification de ce produit (admin).
export function useAddProduct(product?: GetProductDetail) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<ProductSchemaDataForm>({
        resolver: zodResolver(productShcema),
        defaultValues: product
            ? {
                image: product.image,
                productName: product.productName,
                description: product.description ?? "",
                purchasePrice: product.purchasePrice,
                sellingPrice: product.sellingPrice,
                commission: product.commission,
                quantity: product.quantity,
                producedAt: toInputDate(product.producedAt),
                expiresAt: toInputDate(product.expiresAt),
            }
            : {
                image: "",
                productName: "",
                description: "",
                purchasePrice: 0,
                sellingPrice: 0,
                commission: 0,
                quantity: 0,
            }
    })

    const handleAddProduct = (values: ProductSchemaDataForm) => {
        startTransition(async () => {
            const result = await tryCatch(product ? updateProduct(product.id, values) : addProduct(values));

            if (result.error || result.data.status !== "success") {
                toast.error(result.error ? "Une erreur a eu lieu lors de l'enregistrement du produit" : result.data.message)
                return;
            }

            toast.success(product ? "Le produit a été modifié avec succès" : "Produit a été ajouté à l'inventaire avec succès")
            router.push("/pages/inventory")
            router.refresh();
        });
    }
    return { form, isPending, handleAddProduct };
}