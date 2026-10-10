import { authClient } from "@/lib/auth-client";
import {
  signUpSchema,
  SignUpSchemaDataForm,
} from "@/schemas/zod/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useSignUp() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const AUTH_ERROR_MESSAGES: Record<string, string> = {
    USER_ALREADY_EXISTS: "Un compte existe déjà avec cette adresse e-mail",
    INVALID_EMAIL: "L'adresse e-mail saisie n'est pas valide",
    PASSWORD_TOO_SHORT: "Le mot de passe est trop court",
    PASSWORD_TOO_LONG: "Le mot de passe est trop long",
  };

  const form = useForm<SignUpSchemaDataForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "saleperson",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = (values: SignUpSchemaDataForm) => {
    startTransition(async () => {
      try {
        const { error } = await authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          username: values.username,
          role: values.role,
        });

        if (error) {
          toast.error("Inscription impossible", {
            description:
              (error.code && AUTH_ERROR_MESSAGES[error.code]) ??
              "Une erreur s'est produite lors de l'inscription veuillez réessayer",
          });
          return;
        }

        toast.success("Compte crée avec succès", {
          description: "Bienvenue ! Vous pouvez maintenant vous connecter",
        });

        router.push("/login");
      } catch {
        toast.error("Connexion impossible", {
          description:
            "Veuillez vérifer votre connexion internet puis réessayez",
        });
      }
    });
  };
  return {
    form,
    isPending,
    handleSignUp,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
}
