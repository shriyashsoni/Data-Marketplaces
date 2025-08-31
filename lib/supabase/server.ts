import { cookies, headers } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function buildAdapters() {
  return {
    cookies: {
      get(name: string) {
        try {
          return cookies().get(name)?.value
        } catch {
          return undefined
        }
      },
      set(name: string, value: string, options: any) {
        try {
          cookies().set({ name, value, ...options })
        } catch {}
      },
      remove(name: string, options: any) {
        try {
          cookies().set({ name, value: "", ...options })
        } catch {}
      },
    },
    headers: {
      get(name: string) {
        try {
          return headers().get(name) ?? undefined
        } catch {
          return undefined
        }
      },
    },
  }
}

/**
 * Public (anon) server client - respects RLS and the current user's session.
 * Use in Route Handlers/Server Components for standard reads/writes.
 */
export function getSupabaseServerClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, buildAdapters())
}

/**
 * Explicit anon client alias - same as getSupabaseServerClient.
 * Useful when you want to be clear you’re using the anon key.
 */
export function getSupabaseAnonClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, buildAdapters())
}

/**
 * Service role client - bypasses RLS. Use ONLY in trusted server contexts
 * like secure Route Handlers for privileged operations.
 */
export function getSupabaseServiceRoleClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, buildAdapters())
}

export function getSupabaseServer() {
  // Use the privileged server client for trusted server-only contexts.
  return getSupabaseServiceRoleClient()
}
