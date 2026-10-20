"use client";

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '../ui/card'
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from '../ui/field'
import logo from "@/public/slogan.png"
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group'
import { useResetPassword } from '@/hooks/use-reset-password'
import { Eye, EyeOff, Loader, LogIn } from 'lucide-react'
import resetImage from "@/public/reset-password.svg"

export default function ResetPasswordForm({ token }: { token: string }) {

  const {form, isPending, showPassword, setShowPassword, handleResetPassword } = useResetPassword(token);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(handleResetPassword)}>
            <FieldGroup>
              <div className="flex flex-col items-start gap-2 text-left">
                <div className="flex justify-start gap-2">
                  <Link href="#" className="flex items-center gap-2 font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-white text-primary-foreground">
                      <Image src={logo} alt="logo" className="size-6!" />
                    </div>
                    <span className="flex flex-col">
                      <span>Census App</span>
                      <span className="text-xs text-muted-foreground">by Next Step</span>
                    </span>
                  </Link>
                </div>

                <h1 className="mt-6 text-2xl font-bold">
                  Réinitialiser votre mot de passe
                </h1>
                <p className="text-balance text-muted-foreground">
                  Saisissez votre nouveau mot de passe et confirme le
                </p>
              </div>

              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                </div>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Saisir votre mot de passe"
                    aria-invalid={!!errors.password}
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
                      title={
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
                <FieldError>{errors.password?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
                </div>
                <InputGroup>
                  <InputGroupInput
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Saisir votre mot de passe"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
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
                      title={
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
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>
              

              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary-gradient"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin" />
                      Modification en cours...
                    </>
                  ) : (
                    <>
                      <LogIn />
                      Modifier
                    </>
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <Link href="/login">Retour à la connexion</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src={resetImage}
              alt="Illustration de rénitialisation de mot de passe"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        En continuant, vous acceptez nos{" "}
        <Link href="#">Conditions d&apos;utilisation</Link> et notre{" "}
        <Link href="#">Politique de confidentialité</Link>.
      </FieldDescription>
    </div>
  )
}
