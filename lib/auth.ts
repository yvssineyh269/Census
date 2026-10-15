import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { resend } from "./resend";
import VerifyEmail from "@/components/email/verify-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Vérifiez votre email",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
  },

  plugins: [username(), nextCookies()],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "saleperson",
        input: true,
      },
    },
  },
});
