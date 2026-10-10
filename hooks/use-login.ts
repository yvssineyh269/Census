import { authClient, signIn } from "@/lib/auth-client";
import { isRole, ROLE_HOME } from "@/lib/roles";
import { loginSchema, LoginSchemaDataForm } from "@/schemas/zod/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchemaDataForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const handleLogin = (values: LoginSchemaDataForm) => {
    startTransition(async () => {
      try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          values.emailOrUsername,
        );

        if (isEmail) {
          const result = await signIn.email({
            email: values.emailOrUsername,
            password: values.password,
          });

          if (result.error) {
            toast.error("Email ou mot de passe incorrect, réessayez encore", {
              description:
                "Assurez-vous de bien saisir votre adresse email et votre mot de passe",
            });
            return;
          }
        } else {
          const result = await signIn.username({
            username: values.emailOrUsername,
            password: values.password,
          });

          if (result.error) {
            toast.error("Nom d'utilisateur ou mot de passe incorrect", {
              description:
                "Assurez-vous de bien saisir votre nom d'utilisateur et votre mot de passe",
            });
            return;
          }
        }

        toast.success("Vous êtes connecté", {
          description: `Bienvenue ${values.emailOrUsername}`,
        });

        const { data: session } = await authClient.getSession();
        const role = session?.user.role;

        if (!isRole(role)) {
          toast.error("Impossible de déterminer le rôle de votre compte");
          return;
        }

        router.replace(ROLE_HOME[role]);
        router.refresh();
      } catch {
        toast.error(
          "Une erreur s'est produite lors de l'authentification (connexion)",
        );
      }
    });
  };
  return { form, isPending, showPassword, setShowPassword, handleLogin };
}
