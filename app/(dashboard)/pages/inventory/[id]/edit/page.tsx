import { notFound } from 'next/navigation'
import AddProductForm from '@/components/add-product-form'
import { requireRole } from '@/lib/authorization'
import { getProductById } from '@/query/product.query'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("admin");
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Modifier le produit</h1>
            <p className="text-muted-foreground mt-3">
                Modifiez les informations de « {product.productName} ». Les ventes déjà enregistrées gardent leur prix et leur commission d&apos;origine.
            </p>
          </div>
          {/* Formulaire de modification */}
          <AddProductForm product={product} />
    </div>
  )
}
