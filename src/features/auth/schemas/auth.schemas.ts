import { z } from "zod";

/* Schémas partagés entre les formulaires et les services : la validation
   vit à un seul endroit et les types en sont déduits. */

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "L'identifiant est obligatoire.")
    .max(60, "L'identifiant est trop long."),

  password: z.string().min(1, "Le mot de passe est obligatoire."),
});

export type LoginValues = z.infer<typeof loginSchema>;

const passwordRules = z
  .string()
  .min(8, "8 caractères minimum.")
  .regex(/[a-z]/, "Au moins une minuscule.")
  .regex(/[A-Z]/, "Au moins une majuscule.")
  .regex(/[0-9]/, "Au moins un chiffre.");

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Le prénom est trop court."),

    lastName: z.string().trim().min(2, "Le nom est trop court."),

    email: z
      .string()
      .trim()
      .min(1, "L'email est obligatoire.")
      .email("Format d'email invalide."),

    username: z
      .string()
      .trim()
      .min(3, "3 caractères minimum.")
      .regex(
        /^[A-Za-z0-9._-]+$/,
        "Lettres, chiffres, point, tiret et souligné uniquement.",
      ),

    password: passwordRules,

    confirmPassword: z.string(),
  })
  // Validation croisée : l'erreur est rattachée au champ de confirmation
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les deux mots de passe ne correspondent pas.",
  })
  .refine(
    (values) =>
      values.password.toLowerCase() !== values.username.toLowerCase(),
    {
      path: ["password"],
      message: "Le mot de passe ne peut pas reprendre l'identifiant.",
    },
  );

export type RegisterValues = z.infer<typeof registerSchema>;
