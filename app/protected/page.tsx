import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Protected</h1>
      <p className="mt-2 text-sm text-muted-foreground">You are signed in as {user.email}.</p>
      <form
        className="mt-6"
        action={async () => {
          "use server"
          const supabase = getSupabaseServerClient()
          await supabase.auth.signOut()
          redirect("/login")
        }}
      >
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
        >
          Sign out
        </button>
      </form>
    </main>
  )
}
