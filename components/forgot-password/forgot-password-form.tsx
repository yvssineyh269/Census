"use client";

import Link from "next/link";
import { Field, FieldLabel, FieldDescription, FieldGroup, FieldError } from "../ui/field";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import logo from "@/public/next-step-logo.jpeg"
import forgotPasswordImage from "@/public/forgot-password.svg"
import { ArrowRight, Loader, MailCheck } from "lucide-react";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

export default function ForgotPasswordForm() {
    const { form, isPending, sentTo, resetSent, handleForgotPassword } = useForgotPassword();
    const { register, handleSubmit, formState: { errors } } = form;
    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(handleForgotPassword)}>
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

                                <h1 className="mt-6 text-2xl font-bold">Oups, Mot de passe oublié</h1>
                                <p className="text-balance text-muted-foreground">
                                    saisissez votre adresse email pour rénitialiser votre mot de passe
                                </p>
                            </div>

                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">
                                    Votre adresse email
                                </FieldLabel>
                                <Input
                                    id="emailOrUsername"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Saisir votre adresse email ou votre nom d'utilisateur"
                                    aria-invalid={!!errors.email}
                                    {...register("email")}
                                />
                                <FieldError>{errors.email?.message}</FieldError>
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
                                            Suivant...
                                        </>
                                    ) : (
                                        <>
                                            Suivant
                                            <ArrowRight />
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
                            src={forgotPasswordImage}
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

            {/* Confirmation d'envoi du lien de réinitialisation */}
            <Dialog open={!!sentTo} onOpenChange={(open) => !open && resetSent()}>
                <DialogContent>
                    <DialogHeader>
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <MailCheck className="size-6 text-primary" />
                        </div>
                        <DialogTitle className="text-center">Vérifiez votre boîte mail</DialogTitle>
                        <DialogDescription className="text-center">
                            Si un compte est associé à <span className="font-medium text-foreground">{sentTo}</span>,
                            un email contenant un lien pour réinitialiser votre mot de passe vient de lui être envoyé.
                            Pensez à vérifier vos courriers indésirables.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button variant="outline" onClick={resetSent}>
                            Utiliser une autre adresse
                        </Button>
                        <Button asChild className="bg-primary-gradient">
                            <Link href="/login">Retour à la connexion</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
