import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
    const router = useRouter();
  
    const handleLogout = async function logout() {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success("Déconnexion", {
              description: "Vous êtes désormais déconnecté",
            });
          },
          onError: () => {
            toast.error("Echec de la déconnexion", {
              description:
                "Une erreur s'est produite lors de la déconnexion. Veuillez Reéssayer",
            });
          },
        },
      });
    };
    return handleLogout;
}
