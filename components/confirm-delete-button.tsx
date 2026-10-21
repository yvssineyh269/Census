"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/lib/try-catch";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Props {
  title: string;
  description: string;
  action: () => Promise<{ status: string; message: string }>;
  className?: string;
}

// Bouton de suppression avec confirmation, pour les actions réservées à l'admin
export function ConfirmDeleteButton({ title, description, action, className }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(action());

      if (error || data.status !== "success") {
        toast.error(error ? "Une erreur est survenue, réessayez." : data.message);
        return;
      }

      toast.success(data.message);
      router.refresh();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          aria-label="Supprimer"
          disabled={isPending}
          className={cn("bg-red-200", className)}
        >
          {isPending ? <Loader className="animate-spin" /> : <Trash />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Retour</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
