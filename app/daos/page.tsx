"use client"

import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

async function fetcher(url: string) {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed")
  return res.json()
}

async function createDao(url: string, { arg }: { arg: { name: string; description?: string } }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error("Create failed")
  return res.json()
}

export default function DaosPage() {
  const { data, mutate, isLoading } = useSWR<{ daos: any[] }>("/api/daos", fetcher)
  const { trigger, isMutating } = useSWRMutation("/api/daos", createDao)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  return (
    <div className="min-h-dvh flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          <h1 className="text-2xl font-semibold">Data DAOs</h1>
          <Card className="p-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="grid gap-2 md:col-span-1">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Genomics Cooperative" />
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label>Description</Label>
                <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief purpose..." />
              </div>
              <div className="flex items-end">
                <Button
                  disabled={!name || isMutating}
                  onClick={async () => {
                    await trigger({ name, description: desc || undefined })
                    setName("")
                    setDesc("")
                    mutate()
                  }}
                >
                  {isMutating ? "Creating..." : "Create DAO"}
                </Button>
              </div>
            </div>
          </Card>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !data || data.daos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No DAOs yet. Create one above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.daos.map((d) => (
                <Link key={d.id} href={`/daos/${d.id}`} className="border rounded-lg p-4 hover:bg-accent transition">
                  <h3 className="font-medium">{d.name}</h3>
                  {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
