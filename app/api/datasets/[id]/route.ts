import { NextResponse } from "next/server"
import { getSupabaseAnonClient } from "@/lib/supabase/server"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAnonClient()
    const { data, error } = await supabase.from("datasets").select("*").eq("id", params.id).single()
    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ dataset: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}
