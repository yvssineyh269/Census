import { tryCatch } from "@/lib/try-catch";
import {
  addUserSchema,
  AddUserSchemaDataForm,
} from "@/schemas/zod/add.user.schema";
import { createUser } from "@/server/create-user-action";
import { updateUser } from "@/server/user-action";
import type { UserListDto } from "@/lib/types";
import { isRole } from "@/lib/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Sans utilisateur : création. Avec un utilisateur : modification de ce compte (admin).
export function useAddUser(user?: UserListDto) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddUserSchemaDataForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          username: user.username ?? "",
          role: isRole(user.role) ? user.role : "saleperson",
        }
      : {
          name: "",
          email: "",
          username: "",
          role: "saleperson",
        },
  });

  const handleAddUser = (values: AddUserSchemaDataForm) => {
    startTransition(async () => {
      const result = await tryCatch(user ? updateUser(user.id, values) : createUser(values));

      if (result.error || result.data.status !== "success") {
        toast.error(
          result.error
            ? "Une erreur a eu lieu lors de l'enregistrement de l'utilisateur"
            : result.data.message,
        );
        return;
      }

      toast.success(user ? "Utilisateur modifié" : "Utilisateur créé", { description: result.data.message });
      if (!user) form.reset();
      router.push("/pages/personnals");
      router.refresh();
    });
  };

  return { form, isPending, handleAddUser };
}
