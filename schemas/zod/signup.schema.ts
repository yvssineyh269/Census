import { ROLES } from "@/lib/roles";
import { z } from "zod";

// Réutilisable pour (reset password, changement de mot de passe, etc.)
export const passwordSchema = z
  .string("Le mot de passe est requis")
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(72, "Le mot de passe ne peut pas dépasser 72 caractères") // limite bcrypt
  .regex(/[a-z]/, "Ajoutez au moins une minuscule")
  .regex(/[A-Z]/, "Ajoutez au moins une majuscule")
  .regex(/\d/, "Ajoutez au moins un chiffre");

export const signUpSchema = z
  .object({
    name: z
      .string("Le nom est requis")
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(80, "Le nom ne peut pas dépasser 80 caractères"),

    email: z
      .string("L'email est requis")
      .trim()
      .toLowerCase()
      .min(1, "L'email est requis")
      .pipe(z.email("Adresse e-mail invalide")),

    username: z
      .string("Le nom d'utilisateur est requis")
      .trim()
      .toLowerCase()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères")
      .regex(
        /^[a-z0-9]+(?:[._][a-z0-9]+)*$/,
        "Lettres, chiffres, points et underscores uniquement (sans séparateurs au début, à la fin ou consécutifs)",
      ),

    role: z.enum(ROLES, { error: "Veuillez sélectionner un rôle" }),

    password: passwordSchema,

    confirmPassword: z
      .string("La confirmation est requise")
      .min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignUpSchemaDataForm = z.infer<typeof signUpSchema>;