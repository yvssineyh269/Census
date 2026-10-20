import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaDataForm,
} from "@/schemas/zod/password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useForgotPassword() {
  const [isPending, startTransition] = useTransition();
  // Adresse à laquelle le lien a été envoyé (null tant que rien n'est envoyé)
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordSchemaDataForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = (values: ForgotPasswordSchemaDataForm) => {
    startTransition(async () => {
      try {
        const { error } = await authClient.requestPasswordReset({
          email: values.email,
          redirectTo: "/reset-password",
        });

        if (error) {
          toast.error("Impossible d'envoyer le lien", {
            description: "Une erreur s'est produite, veuillez réessayer",
          });
          return;
        }

        // Même message que l'email existe ou non (évite de révéler les comptes existants)
        setSentTo(values.email);
      } catch {
        toast.error("Connexion impossible", {
          description:
            "Veuillez vérifier votre connexion internet puis réessayez",
        });
      }
    });
  };

  // Revenir au formulaire pour saisir une autre adresse
  const resetSent = () => setSentTo(null);

  return { form, isPending, sentTo, resetSent, handleForgotPassword };
}
