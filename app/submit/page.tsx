"use client"

import { useState } from "react"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { UploadForm } from "@/components/datasets/upload-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

async function fetcher(url: string) {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed")
  return res.json()
}

async function attach(url: string, { arg }: { arg: { dataset_id: string } }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error("Attach failed")
  return res.json()
}

export default function SubmitPage() {
  const { data: daoRes } = useSWR<{ daos: any[] }>("/api/daos", fetcher)
  const [lastDatasetId, setLastDatasetId] = useState<string | null>(null)
  const [selectedDao, setSelectedDao] = useState<string | null>(null)
  const [attachState, setAttachState] = useState<"idle" | "attaching" | "done">("idle")
  const { trigger: attachTrigger } = useSWRMutation(`/api/daos/${selectedDao || ""}/datasets`, attach)

  return (
    <div className="min-h-dvh flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-8 space-y-8">
          <h1 className="text-2xl font-semibold">Submit Data</h1>
          <UploadForm onCreated={(id?: string) => setLastDatasetId(id || null)} />
          <Card className="p-4 space-y-4">
            <div className="grid gap-2">
              <Label>Attach to DAO (optional)</Label>
              <Select value={selectedDao || ""} onValueChange={(v) => setSelectedDao(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a DAO" />
                </SelectTrigger>
                <SelectContent>
                  {(daoRes?.daos || []).map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={!selectedDao || !lastDatasetId || attachState === "attaching"}
              onClick={async () => {
                if (!selectedDao || !lastDatasetId) return
                setAttachState("attaching")
                try {
                  await attachTrigger({ dataset_id: lastDatasetId })
                  setAttachState("done")
                } finally {
                  setAttachState("idle")
                }
              }}
            >
              {attachState === "attaching" ? "Attaching..." : "Attach Dataset to DAO"}
            </Button>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
