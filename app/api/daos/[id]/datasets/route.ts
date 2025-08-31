import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { dataset_id } = await req.json()
    if (!dataset_id) return NextResponse.json({ error: "dataset_id is required" }, { status: 400 })

    const supabase = getSupabaseServer()
    const { error } = await supabase.from("dao_datasets").insert({ dao_id: params.id, dataset_id })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Attach failed" }, { status: 500 })
  }
}
