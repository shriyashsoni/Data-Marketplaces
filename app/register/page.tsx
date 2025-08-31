import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-4 py-10">
      <div className="w-full">
        <RegisterForm />
      </div>
    </main>
  )
}
