import "server-only";

import VerifyEmail from "@/components/email/verify-email";
import { resend } from "./resend";

const from = `${process.env.EMAIL_SENDER_NAME ?? "Census App"} <${process.env.EMAIL_SENDER_ADDRESS ?? "onboarding@resend.dev"}>`;

// Resend ne lève pas d'exception en cas d'échec : on la lève nous-mêmes
// pour que l'appelant puisse réagir (ex. annuler la création du compte).
async function send(to: string, subject: string, react: React.ReactElement) {
  const { error } = await resend.emails.send({ from, to, subject, react });

  if (error) {
    throw new Error(`Échec de l'envoi de l'email à ${to} : ${error.message}`);
  }
}

// Email envoyé au nouvel employé créé par l'admin
export async function sendInvitationEmail({
  to,
  username,
  url,
}: {
  to: string;
  username: string;
  url: string;
}) {
  await send(
    to,
    "Activez votre compte Census App",
    VerifyEmail({
      username,
      verifyUrl: url,
      preview: "Votre compte Census App a été créé",
      title: `Bienvenue ${username} !`,
      message:
        "Un compte Census App vient d'être créé pour vous. Cliquez sur le bouton ci-dessous pour confirmer votre adresse e-mail et choisir votre mot de passe. Ce lien est valable 72 heures.",
      buttonLabel: "Activer mon compte",
    }),
  );
}

// Email "mot de passe oublié"
export async function sendResetPasswordEmail({
  to,
  username,
  url,
}: {
  to: string;
  username: string;
  url: string;
}) {
  await send(
    to,
    "Réinitialisez votre mot de passe",
    VerifyEmail({
      username,
      verifyUrl: url,
      preview: "Réinitialisation de votre mot de passe",
      title: `Bonjour ${username}`,
      message:
        "Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau. Ce lien est valable 1 heure.",
      buttonLabel: "Réinitialiser mon mot de passe",
    }),
  );
}
