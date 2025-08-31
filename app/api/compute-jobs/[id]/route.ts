import { NextResponse } from "next/server"
import { getSupabaseAnonClient, getSupabaseServiceRoleClient, getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAnonClient()
    const { data, error } = await supabase.from("compute_jobs").select("*").eq("id", params.id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabaseRsc = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabaseRsc.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { status, result_url } = body || {}
    const updates: Record<string, any> = {}
    if (status) updates.status = status
    if (result_url) updates.result_url = result_url
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }
    const supabaseSrv = getSupabaseServiceRoleClient()
    const { data, error } = await supabaseSrv
      .from("compute_jobs")
      .update(updates)
      .eq("id", params.id)
      .select("*")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
