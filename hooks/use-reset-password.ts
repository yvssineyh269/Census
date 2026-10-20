import { authClient } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  ResetPasswordSchemaDataForm,
} from "@/schemas/zod/password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useResetPassword(token: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ResetPasswordSchemaDataForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = (values: ResetPasswordSchemaDataForm) => {
    startTransition(async () => {
      try {
        const { error } = await authClient.resetPassword({
          newPassword: values.password,
          token,
        });

        if (error) {
          toast.error("Impossible de modifier le mot de passe", {
            description:
              error.code === "INVALID_TOKEN"
                ? "Ce lien a expiré ou a déjà été utilisé. Demandez un nouveau lien."
                : "Une erreur s'est produite, veuillez réessayer",
          });
          return;
        }

        toast.success("Mot de passe enregistré", {
          description:
            "Vous pouvez maintenant vous connecter avec votre email ou votre nom d'utilisateur",
        });
        router.replace("/login");
      } catch {
        toast.error("Connexion impossible", {
          description:
            "Veuillez vérifier votre connexion internet puis réessayez",
        });
      }
    });
  };

  return { form, isPending, showPassword, setShowPassword, handleResetPassword };
}
