"use client"

import type React from "react"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const redirect =
        (process as any).env?.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/protected`
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirect },
      })
      if (error) throw error
      toast({ title: "Check your inbox", description: "We sent a confirmation link to verify your email." })
      window.location.assign("/login")
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-pretty text-xl">Create account</CardTitle>
        <CardDescription>Verify your email to finish sign up.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Have an account?{" "}
          <a className="text-primary underline" href="/login">
            Sign in
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
