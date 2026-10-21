"use client";

import { Loader, Save, Send } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAddUser } from "@/hooks/use-add-user";
import { ROLE_LABELS } from "@/lib/roles";
import type { UserListDto } from "@/lib/types";

// Sans "user" : création d'un compte. Avec "user" : modification de ce compte (admin).
export default function AddUserForm({ user }: { user?: UserListDto }) {
  const { form, isPending, handleAddUser } = useAddUser(user);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleAddUser)}>
          <FieldGroup>
            {/* NOM COMPLET */}
            <Field>
              <FieldLabel htmlFor="name">Nom complet</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Saisir le nom complet de l'employé"
                {...register("name")}
                required
              />
              {errors.name && (
                <FieldDescription className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* EMAIL */}
            <Field>
              <FieldLabel htmlFor="email">Adresse e-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                required
              />
              {!user && (
                <FieldDescription>
                  Le lien d&apos;activation du compte sera envoyé à cette adresse.
                </FieldDescription>
              )}
              {errors.email && (
                <FieldDescription className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              {/* NOM D'UTILISATEUR */}
              <Field>
                <FieldLabel htmlFor="username">Nom d&apos;utilisateur</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  {...register("username")}
                  required
                />
                {errors.username && (
                  <FieldDescription className="text-sm text-destructive mt-1">
                    {errors.username.message}
                  </FieldDescription>
                )}
              </Field>

              {/* RÔLE */}
              <Field>
                <FieldLabel htmlFor="role">Rôle</FieldLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="role"
                        className="w-full"
                        aria-invalid={!!errors.role}
                      >
                        <SelectValue placeholder="Choisir un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <FieldDescription className="text-sm text-destructive mt-1">
                    {errors.role.message}
                  </FieldDescription>
                )}
              </Field>
            </div>

            <Field>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary-gradient"
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin" />
                    {user ? "Enregistrement..." : "Création en cours..."}
                  </>
                ) : (
                  <>
                    {user ? <Save /> : <Send />}
                    {user ? "Enregistrer les modifications" : "Créer et envoyer l'invitation"}
                  </>
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
