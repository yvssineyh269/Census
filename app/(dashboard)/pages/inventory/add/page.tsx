import AddProductForm from '@/components/add-product-form'

export default function AddProductPage() {
  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Ajouter un nouveau produit</h1>
            <p className="text-muted-foreground mt-3">
          Renseignez les informations du produit en remplissant les champs ci-dessous puis importez l'image principale du produit
            </p>
          </div>
          {/* Cartes des produits */}
          <AddProductForm />
    </div>
  )
}
