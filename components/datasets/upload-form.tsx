"use client"

import type React from "react"

import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

async function postForm(url: string, { arg }: { arg: FormData }) {
  const res = await fetch(url, { method: "POST", body: arg })
  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(txt || `Upload failed: ${res.status}`)
  }
  return res.json()
}

export function UploadForm({ onCreated }: { onCreated?: (id: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { trigger, isMutating } = useSWRMutation("/api/datasets", postForm)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.set("file", file)
    form.set("name", name || file.name)
    form.set("description", description)
    const result = await trigger(form)
    setFile(null)
    setName("")
    setDescription("")
    onCreated?.(result.id)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="file">File</Label>
        <Input id="file" type="file" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Dataset name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={!file || isMutating}>
        {isMutating ? "Uploading..." : "Upload"}
      </Button>
    </form>
  )
}
