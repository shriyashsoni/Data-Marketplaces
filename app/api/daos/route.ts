import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("daos").select("*").order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ daos: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json()
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("daos").insert({ name, description }).select("*").single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ dao: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Create failed" }, { status: 500 })
  }
}
