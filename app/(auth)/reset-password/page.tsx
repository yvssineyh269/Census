import Link from "next/link";
import ResetPasswordForm from "@/components/forgot-password/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";

// Better-Auth redirige ici après le clic sur le lien reçu par email :
// /reset-password?token=... si le lien est valide, ?error=INVALID_TOKEN sinon.
export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const { token, error } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-[url('/bg.png')] bg-cover bg-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {typeof token === "string" && !error ? (
          <ResetPasswordForm token={token} />
        ) : (
          <Card>
            <CardContent className="space-y-3 p-6 text-center md:p-8">
              <h1 className="text-2xl font-bold">Lien invalide ou expiré</h1>
              <p className="text-muted-foreground">
                Ce lien n&apos;est plus valable ou a déjà été utilisé. Demandez
                un nouveau lien ou contactez votre administrateur.
              </p>
              <div className="flex justify-center gap-4 text-sm underline underline-offset-2">
                <Link href="/forgot-password">Demander un nouveau lien</Link>
                <Link href="/login">Retour à la connexion</Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
