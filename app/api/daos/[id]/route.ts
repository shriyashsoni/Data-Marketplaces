import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServer()
    const [{ data: dao, error: e1 }, { data: links, error: e2 }] = await Promise.all([
      supabase.from("daos").select("*").eq("id", params.id).single(),
      supabase
        .from("dao_datasets")
        .select("dataset_id, datasets(*)")
        .eq("dao_id", params.id)
        .order("created_at", { ascending: false }),
    ])
    if (e1) return NextResponse.json({ error: e1.message }, { status: 404 })
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })

    const datasets = (links || []).map((r: any) => r.datasets)
    return NextResponse.json({ dao, datasets })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}
