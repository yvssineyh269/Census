import { ROLES } from "@/lib/roles";
import { z } from "zod";

// Création d'un employé par l'admin : pas de mot de passe ici,
// l'employé le choisit lui-même via le lien reçu par email.
export const addUserSchema = z.object({
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
});

export type AddUserSchemaDataForm = z.infer<typeof addUserSchema>;
