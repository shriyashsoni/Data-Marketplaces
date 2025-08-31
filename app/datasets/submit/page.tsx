"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function SubmitDatasetPage() {
  const [name, setName] = useState("")
  const [summary, setSummary] = useState("")
  const [tags, setTags] = useState("")
  const [sizeGB, setSizeGB] = useState<number | string>("")
  const [submitting, setSubmitting] = useState(false)
  const [ok, setOk] = useState(false)

  async function submit() {
    setSubmitting(true)
    setOk(false)
    try {
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          summary,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          sizeGB: Number(sizeGB || 0),
          verified: false,
        }),
      })
      if (res.ok) setOk(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold">Submit Dataset</h1>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Satellite Imagery Pack"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="What is inside, provenance, and typical uses."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="satellite,imagery,earth"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size (GB)</Label>
          <Input id="size" type="number" value={sizeGB} onChange={(e) => setSizeGB(e.target.value)} />
        </div>

        <Button disabled={submitting || !name} onClick={submit} className="bg-blue-600 hover:bg-blue-700">
          {submitting ? "Submitting…" : "Submit"}
        </Button>

        {ok && (
          <div className="text-sm">
            <Badge className="bg-emerald-500 hover:bg-emerald-600">Saved</Badge> Dataset submitted. It will appear in
            the list.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
