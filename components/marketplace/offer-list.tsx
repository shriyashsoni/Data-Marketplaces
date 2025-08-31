"use client"

import useSWR from "swr"
import { DatasetCard, type Dataset } from "@/components/datasets/dataset-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function OfferList() {
  const { data, error, isLoading } = useSWR<{ datasets: Dataset[] }>("/api/marketplace", fetcher)

  if (isLoading) return <p className="px-4 py-2 text-sm text-muted-foreground">Loading offers…</p>
  if (error) return <p className="px-4 py-2 text-sm text-red-600">Failed to load marketplace.</p>

  const items = data?.datasets ?? []

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((d) => (
        <DatasetCard key={d.id} d={d} href={`/datasets/${d.id}`} cta="View details" />
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">No marketplace offers yet.</p>}
    </div>
  )
}
