import ForgotPasswordForm from "@/components/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[url('/bg.png')] bg-cover bg-center p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-4xl">
            <ForgotPasswordForm />
          </div>
        </div>
  )
}
