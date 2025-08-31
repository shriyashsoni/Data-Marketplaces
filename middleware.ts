import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  // Create a response early so we can modify cookies (refresh)
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // anon is correct in middleware
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 })
        },
      },
    },
  )

  // Touch session to refresh if needed
  await supabase.auth.getUser().catch(() => null)

  return res
}

// Optionally scope, but default all paths ensures sessions refresh broadly
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
