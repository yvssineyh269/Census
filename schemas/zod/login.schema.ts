import z from "zod";

export const loginSchema = z
  .object({
    emailOrUsername: z
      .string()
      .trim()
      .min(1, { message: "L'email ou le nom d'utilisateur est requis" }),

    password: z.string().min(1, { message: "Le mot de passe est requis" }),
  })
  .refine(
    (values) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrUsername) ||
      /^[a-zA-Z0-9_.]+$/.test(values.emailOrUsername),
    {
      message: "EMail ou nom d'utilisateur invalide",
      path: ["emailOrUsername"],
    },
  );

export type LoginSchemaDataForm = z.infer<typeof loginSchema>;
