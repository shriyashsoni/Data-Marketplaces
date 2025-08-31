import { NextResponse } from "next/server"
import { getSupabaseAnonClient } from "@/lib/supabase/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAnonClient()
    const { data, error } = await supabase.from("marketplace_offers").select("*").eq("id", params.id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 })
  }
}
