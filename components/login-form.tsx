"use client";

import Link from "next/link";
import slogan from "@/public/slogan.png";
import logo from "@/public/next-step-logo.jpeg";

import { Eye, EyeOff, Loader, LogIn, TowelRack } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useLogin } from "@/hooks/use-login";
import Image from "next/image";

export function LoginForm() {
  const { form, isPending, showPassword, setShowPassword, handleLogin } =
    useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(handleLogin)}>
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

                <h1 className="mt-6 text-2xl font-bold">Bon retour, connectez vous à votre compte</h1>
                <p className="text-balance text-muted-foreground">
                  saisissez vos identifiants de connexion
                </p>
              </div>

              <Field data-invalid={!!errors.emailOrUsername}>
                <FieldLabel htmlFor="emailOrUsername">
                  Email ou nom d&apos;utilisateur
                </FieldLabel>
                <Input
                  id="emailOrUsername"
                  type="text"
                  autoComplete="username"
                  placeholder="Saisir votre adresse email ou votre nom d'utilisateur"
                  aria-invalid={!!errors.emailOrUsername}
                  {...register("emailOrUsername")}
                />
                <FieldError>{errors.emailOrUsername?.message}</FieldError>
              </Field>

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
              <div className="flex items-center">
                <Link
                  href="#"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
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
                      Connexion...
                    </>
                  ) : (
                    <>
                      <LogIn />
                      Se connecter
                    </>
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Je n&apos;ai pas de compte <Link href="/signup">S&apos;inscrire</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src={slogan}
              alt="Illustration de connexion"
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
  );
}
