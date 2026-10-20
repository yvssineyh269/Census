import { tryCatch } from "@/lib/try-catch";
import {
  addUserSchema,
  AddUserSchemaDataForm,
} from "@/schemas/zod/add.user.schema";
import { createUser } from "@/server/create-user-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useAddUser() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddUserSchemaDataForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "saleperson",
    },
  });

  const handleAddUser = (values: AddUserSchemaDataForm) => {
    startTransition(async () => {
      const result = await tryCatch(createUser(values));

      if (result.error || result.data.status !== "success") {
        toast.error(
          result.error
            ? "Une erreur a eu lieu lors de la création de l'utilisateur"
            : result.data.message,
        );
        return;
      }

      toast.success("Utilisateur créé", { description: result.data.message });
      form.reset();
      router.push("/pages/personnals");
      router.refresh();
    });
  };

  return { form, isPending, handleAddUser };
}
