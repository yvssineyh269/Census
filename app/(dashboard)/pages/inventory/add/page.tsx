import AddProductForm from '@/components/add-product-form'

export default function AddProductPage() {
  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Formulaire d'ajout d'un nouveau produit</h1>
            <p className="text-muted-foreground mt-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi mollitia blanditiis perspiciatis in voluptates ipsam harum, obcaecati reiciendis aut quasi quas, odio velit itaque cumque dolorem eos. Quibusdam, velit repellat?
            </p>
          </div>
          {/* Cartes des produits */}
          <AddProductForm />
    </div>
  )
}
