import { NextResponse } from "next/server"
import { getSupabaseAnonClient, getSupabaseServiceRoleClient, getSupabaseServerClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const supabase = getSupabaseAnonClient()
    let query = supabase.from("datasets").select("*").order("created_at", { ascending: false })
    if (id) query = query.eq("id", id)
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ datasets: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabaseRsc = getSupabaseServerClient()
    const {
      data: { user },
    } = await supabaseRsc.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const contentType = req.headers.get("content-type") || ""
    let name: string | null = null
    let description: string | null = null
    let blobUrl: string | null = null
    let mime: string | null = null
    let size: number | null = null

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      const file = form.get("file") as File | null
      name = (form.get("name") as string) || (file?.name ?? null)
      description = (form.get("description") as string) || null

      if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })
      const { url } = await put(`datasets/${crypto.randomUUID()}-${file.name}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      blobUrl = url
      mime = file.type || null
      size = file.size || null
    } else {
      const body = await req.json().catch(() => ({}))
      name = body?.name ?? null
      description = body?.description ?? null
      blobUrl = body?.blob_url ?? null
      mime = body?.content_type ?? null
      size = typeof body?.size === "number" ? body.size : null
      if (!blobUrl || !name) {
        return NextResponse.json(
          { error: "name and either file (multipart) or blob_url (JSON) are required" },
          { status: 400 },
        )
      }
    }

    const supabaseSrv = getSupabaseServiceRoleClient()
    const { data, error } = await supabaseSrv
      .from("datasets")
      .insert([
        {
          name,
          description,
          blob_url: blobUrl,
          content_type: mime,
          size,
          owner_email: user.email ?? null,
        },
      ])
      .select("*")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}
