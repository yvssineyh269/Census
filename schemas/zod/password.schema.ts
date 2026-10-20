import { z } from "zod";

// Réutilisable pour (reset password, changement de mot de passe, etc.)
export const passwordSchema = z
  .string("Le mot de passe est requis")
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(72, "Le mot de passe ne peut pas dépasser 72 caractères") // limite bcrypt
  .regex(/[a-z]/, "Ajoutez au moins une minuscule")
  .regex(/[A-Z]/, "Ajoutez au moins une majuscule")
  .regex(/\d/, "Ajoutez au moins un chiffre");

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string("La confirmation est requise")
      .min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaDataForm = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string("L'email est requis")
    .trim()
    .toLowerCase()
    .min(1, "L'email est requis")
    .pipe(z.email("Adresse e-mail invalide")),
});

export type ForgotPasswordSchemaDataForm = z.infer<typeof forgotPasswordSchema>;
