"use client";

import { Loader, Plus } from "lucide-react";
import ImageUploader from "./image-uploader";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import { Textarea } from "./ui/textarea";
import { useAddExpense } from "@/hooks/use-add-expense";
import { EXPENSE_STATUS_LABELS } from "@/lib/expense-status";
import { EXPENSE_STATUSES } from "@/schemas/zod/expense.schema";

// "createdByName" : nom de l'utilisateur connecté, enregistré comme auteur de la dépense
export default function AddExpenseForm({ createdByName }: { createdByName: string }) {
  const { form, isPending, handleAddExpense } = useAddExpense();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleAddExpense)}>
          <FieldGroup>
            {/* IMAGE DE LA DEPENSE */}
            <Field>
              <ImageUploader
                folder="expenses"
                subject="de la dépense"
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

            {/* TITRE */}
            <Field>
              <FieldLabel htmlFor="title">Titre de la dépense</FieldLabel>
              <Input
                id="title"
                type="text"
                placeholder="Ex. : Achat de fournitures de bureau"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <FieldDescription className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </FieldDescription>
              )}
            </Field>

            {/* DESCRIPTION */}
            <Field>
              <FieldLabel htmlFor="description">Description de la dépense</FieldLabel>
              <Textarea
                id="description"
                placeholder="Détaillez la dépense : motif, fournisseur, mode de paiement..."
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <FieldDescription className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>

            {/* MONTANT & DATE */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="amount">Montant de la dépense (KMF)</FieldLabel>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="Saisir le montant en KMF"
                  {...register("amount", { valueAsNumber: true })}
                  aria-invalid={!!errors.amount}
                />
                {errors.amount && (
                  <FieldDescription className="text-sm text-destructive mt-1">
                    {errors.amount.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="spentAt">Date de la dépense</FieldLabel>
                <Input
                  id="spentAt"
                  type="date"
                  {...register("spentAt")}
                  aria-invalid={!!errors.spentAt}
                />
                {errors.spentAt && (
                  <FieldDescription className="text-sm text-destructive mt-1">
                    {errors.spentAt.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            {/* STATUT & AUTEUR */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="status">Statut de la dépense</FieldLabel>
                <NativeSelect id="status" className="w-full" {...register("status")}>
                  {EXPENSE_STATUSES.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {EXPENSE_STATUS_LABELS[status]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.status && (
                  <FieldDescription className="text-sm text-destructive mt-1">
                    {errors.status.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="createdBy">Dépense créée par</FieldLabel>
                <Input id="createdBy" type="text" value={createdByName} readOnly disabled />
                <FieldDescription>
                  La dépense est automatiquement attribuée au compte connecté.
                </FieldDescription>
              </Field>
            </div>
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-8 bg-primary-gradient w-full"
          >
            {isPending ? (
              <>
                <Loader className="animate-spin" />
                Ajout de la dépense en cours...
              </>
            ) : (
              <>
                <Plus />
                Ajouter la dépense
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
