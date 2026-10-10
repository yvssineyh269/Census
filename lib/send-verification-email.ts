import VerifyEmail from "@/components/email/verify-email";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail({
  to,
  username,
  verifyUrl,
}: {
  to: string;
  username: string;
  verifyUrl: string;
}) {
  await resend.emails.send({
    from: "Census by Next Step <onboarding@resend.dev>",
    to,
    subject: "Vérifiez votre adresse email",
    react: VerifyEmail({
      username,
      verifyUrl,
      companyName: "Census App",
    }),
  });
}
