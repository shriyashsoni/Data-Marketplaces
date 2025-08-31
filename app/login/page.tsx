import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center px-4 py-10">
      <div className="w-full">
        <LoginForm />
      </div>
    </main>
  )
}
