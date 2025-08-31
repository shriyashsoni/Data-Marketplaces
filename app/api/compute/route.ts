import { type NextRequest, NextResponse } from "next/server"
import { store, type Job } from "../_data"
import crypto from "crypto"

export async function GET() {
  return NextResponse.json({ jobs: store.jobs })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<Job, "id" | "status">
  const job: Job = {
    id: crypto.randomUUID(),
    status: "queued",
    ...body,
  }
  store.jobs.unshift(job)
  // Simulate async status update
  ;(async () => {
    await new Promise((r) => setTimeout(r, 800))
    const target = store.jobs.find((j) => j.id === job.id)
    if (target) target.status = "succeeded"
  })()
  return NextResponse.json({ id: job.id, status: job.status })
}
