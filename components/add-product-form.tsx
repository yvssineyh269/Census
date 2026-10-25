"use client";

import { Loader, Plus, Save } from "lucide-react";
import ImageUploader from "./image-uploader";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAddProduct } from "@/hooks/use-add-product";
import type { GetProductDetail } from "@/lib/types";

// Sans "product" : formulaire d'ajout. Avec "product" : formulaire de modification (admin).
export default function AddProductForm({ product }: { product?: GetProductDetail }) {
  const { form, isPending, handleAddProduct } = useAddProduct(product);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleAddProduct)}>
          <FieldGroup>
            {/* IMAGE DU PRODUIT */}
            <Field>
              <ImageUploader
                data={product?.image}
                onChange={(image) =>
                  setValue("image", image, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {errors.image && (
                <FieldDescription className="text-sm text-destructive mt-1">
                  {errors.image.message}
                </FieldDescription>
              )}
            </Field>

            {/* NOM DU PRODUIT */}
            <Field>
              <FieldLabel htmlFor="productName">Nom du produit</FieldLabel>
              <Input
                id="productName"
                type="text"
                placeholder="Saisir le nom du produit"
                {...register("productName")}
                required
              />
              {errors.productName && (
                <FieldDescription className="text-sm text-destructive mt-1">
                  {errors.productName.message}
                </FieldDescription>
              )}
            </Field>

            {/* DESCRIPTION DU PRODUIT */}
            <Field>
              <FieldLabel htmlFor="description">
                Description du produit
              </FieldLabel>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Saisir la description du produit et son mode d'emploi"
              />
              {errors.description && (
                <FieldDescription>
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>

            {/* PRIX D'ACHAT & PRIX DE REVENTE */}
            <div className="grid md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="purchase-price">
                  Prix d'achat du produit
                </FieldLabel>
                <Input
                  id="purchase-price"
                  type="number"
                  {...register("purchasePrice", {valueAsNumber: true})}
                  placeholder="Saisir le prix d'achat du produit"
                />
                {errors.purchasePrice && (
                  <FieldDescription>
                    {errors.purchasePrice.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="selling-price">
                  Prix de revente du produit
                </FieldLabel>
                <Input
                  id="selling-price"
                  type="number"
                  {...register("sellingPrice", {valueAsNumber: true})}
                  placeholder="Saisir le prix de revente du produit"
                />
                {errors.sellingPrice && (
                  <FieldDescription>
                    {errors.sellingPrice.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="commission">
                  Commission du produit
                </FieldLabel>
                <Input
                  id="commission"
                  type="number"
                  {...register("commission", {valueAsNumber: true})}
                  placeholder="Saisir la commission du produit"
                />
                {errors.commission && (
                  <FieldDescription>
                    {errors.commission.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="quantity">Quantité du produit</FieldLabel>
                <Input
                  id="quantity"
                  type="number"
                  {...register("quantity", {valueAsNumber: true})}
                  placeholder="Saisir la quantité du produit"
                />
                {errors.quantity && (
                  <FieldDescription>{errors.quantity.message}</FieldDescription>
                )}
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="date-produced">
                  Date de production du produit
                </FieldLabel>
                <Input
                  id="date-produced"
                  type="date"
                  {...register("producedAt")}
                />
                {errors.producedAt && (
                  <FieldDescription>
                    {errors.producedAt.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="date-expire">
                  Date d'expiration du produit
                </FieldLabel>
                <Input
                  id="date-expire"
                  type="date"
                  {...register("expiresAt")}
                />
                {errors.expiresAt && (
                  <FieldDescription>
                    {errors.expiresAt.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </FieldGroup>

          {/* Bouton de soumission du produit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-8 bg-primary-gradient w-full"
          >
            {isPending ? (
              <>
                <Loader className="animate-spin" />
                {product ? "Enregistrement des modifications..." : "Ajout du nouveau produit en cours..."}
              </>
            ) : (
              <>
                {product ? <Save /> : <Plus />}
                {product ? "Enregistrer les modifications" : "Ajouter un nouveau produit"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
