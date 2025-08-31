import { NextResponse } from "next/server"
import { getSupabaseAnonClient, getSupabaseServiceRoleClient, getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const datasetId = searchParams.get("dataset_id")
    const supabase = getSupabaseAnonClient()
    let query = supabase.from("compute_jobs").select("*").order("created_at", { ascending: false })
    if (datasetId) query = query.eq("dataset_id", datasetId)
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data || [])
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
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
    const { dataset_id, job_name, params } = body || {}
    if (!dataset_id || !job_name) {
      return NextResponse.json({ error: "dataset_id and job_name are required" }, { status: 400 })
    }
    const supabaseSrv = getSupabaseServiceRoleClient()
    const { data, error } = await supabaseSrv
      .from("compute_jobs")
      .insert([{ dataset_id, job_name, params: params ?? {}, status: "queued" }])
      .select("*")
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
