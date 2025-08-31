import { NextResponse } from "next/server"
import { getSupabaseAnonClient, getSupabaseServiceRoleClient, getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getSupabaseAnonClient()
    const { data, error } = await supabase
      .from("marketplace_offers")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data || [])
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabaseRsc = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabaseRsc.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { title, description, price_cents, dataset_id, image_url, active = true } = body || {}
    if (!title || typeof price_cents !== "number") {
      return NextResponse.json({ error: "title and price_cents are required" }, { status: 400 })
    }
    const supabaseSrv = getSupabaseServiceRoleClient()
    const { data, error } = await supabaseSrv
      .from("marketplace_offers")
      .insert([{ title, description, price_cents, dataset_id, image_url, active }])
      .select("*")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 })
  }
}
