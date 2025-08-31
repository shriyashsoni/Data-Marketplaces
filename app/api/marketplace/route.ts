import { NextResponse } from "next/server"
import { store } from "../_data"

export async function GET() {
  const items = store.datasets.filter((d) => d.verified && typeof d.priceUSD === "number")
  return NextResponse.json({ datasets: items })
}
