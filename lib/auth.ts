import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendResetPasswordEmail } from "./account-emails";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    // Seul l'admin crée les comptes (voir server/create-user-action.ts)
    disableSignUp: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,

    // Lien "mot de passe oublié"
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ to: user.email, username: user.name, url });
    },

    // Le lien reçu par email prouve que l'utilisateur possède l'adresse :
    // une fois son mot de passe choisi, son email est considéré comme vérifié.
    onPasswordReset: async ({ user }) => {
      if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });
      }
    },
  },

  plugins: [username(), nextCookies()],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "saleperson",
        // Le rôle ne doit jamais venir du client (signUp / updateUser),
        // sinon n'importe qui peut s'inscrire en tant qu'admin.
        input: false,
      },
    },
  },
});
