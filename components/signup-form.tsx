"use client";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Loader, Plus } from "lucide-react";
import { Controller } from "react-hook-form";
import { useSignUp } from "@/hooks/use-signup";

export function SignupForm() {
  const {
    form,
    isPending,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSignUp,
  } = useSignUp();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className={cn("flex flex-col gap-6")}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Créez votre compte</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Remplissez le formulaire ci-dessous pour créer votre compte
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Nom & Prénom</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Le nom complet"
            required
            {...register("name")}
            className="bg-background"
          />
          {errors.name && (
            <FieldDescription className="text-destructive">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Adresse Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...register("email")}
            className="bg-background"
          />
          {errors.email && (
            <FieldDescription>{errors.email.message}</FieldDescription>
          )}
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="username">Nom d'utilisateur</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="Nom d'utilisateur"
              required
              {...register("username")}
              className="bg-background"
            />
            {errors.username && (
              <FieldDescription className="text-destructive">
                {errors.username.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Rôle</FieldLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="role"
                    className="w-full"
                    aria-invalid={!!errors.role}
                  >
                    <SelectValue placeholder="Choisit un rôle parmi les 4 rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Administrateur(se)</SelectItem>
                      <SelectItem value="assist">Assisant(e)</SelectItem>
                      <SelectItem value="accountant">Comptable</SelectItem>
                      <SelectItem value="saleperson">Télévendeur(se)</SelectItem>
                      <SelectItem value="manager">Manageur(se)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <FieldDescription className="text-destructive">
                {errors.role.message}
              </FieldDescription>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              {...register("password")}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmer le mot de passe</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              {...register("confirmPassword")}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={
                  showConfirmPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.confirmPassword && (
            <FieldDescription className="text-destructive">
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isPending} className="bg-primary-gradient">
            {isPending ? (
              <>
                <Loader className="animate-spin" />
                Création du compte...
              </>
            ) : (
              <>
                <Plus />
                Créer le compte
              </>
            )}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            J'ai déjà un compte <Link href="/login">se connecter</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
