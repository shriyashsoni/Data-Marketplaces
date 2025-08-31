import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { offer_id } = body || {}
    if (!offer_id) return NextResponse.json({ error: "offer_id is required" }, { status: 400 })

    // Stub: pretend we charged the user and issued a receipt
    const receipt = {
      id: crypto.randomUUID(),
      offer_id,
      status: "paid",
      amount_cents: undefined as number | undefined,
      created_at: new Date().toISOString(),
    }
    return NextResponse.json({ ok: true, receipt })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 })
  }
}
