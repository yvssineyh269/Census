import { tryCatch } from "@/lib/try-catch";
import { ProductSchemaDataForm, productShcema } from "@/schemas/zod/product.schema";
import { addProduct } from "@/server/add-product-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useAddProduct() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<ProductSchemaDataForm>({
        resolver: zodResolver(productShcema),
        defaultValues: {
            image: "",
            name: "",
            description: "",
            purchasePrice: 0,
            sellingPrice: 0,
            commission: 0,
            quantity: 0,
        }
    })

    const handleAddProduct = (values: ProductSchemaDataForm) => {
        startTransition(async () => {
            const result = await tryCatch(addProduct(values));

            if (result.error || result.data.status !== "success") {
                toast.error(result.error ? "Une erreur a eu lieu lors de l'ajout du produit" : result.data.message)
                return;
            }

            toast.success("Produit a été ajouté à l'inventaire avec succès")
            router.push("/admin/inventory")
            router.refresh();
        });
    }
    return { form, isPending, handleAddProduct };
}