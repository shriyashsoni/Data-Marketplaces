"use client"

import useSWR from "swr"
import { type Dataset, DatasetCard } from "./dataset-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DatasetList() {
  const { data, error, isLoading } = useSWR<{ datasets: Dataset[] }>("/api/datasets", fetcher)

  if (isLoading) return <p className="px-4 py-2 text-sm text-muted-foreground">Loading datasets…</p>
  if (error) return <p className="px-4 py-2 text-sm text-red-600">Failed to load datasets.</p>

  const items = data?.datasets ?? []

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((d) => (
        <DatasetCard key={d.id} d={d} href={`/datasets/${d.id}`} />
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">No datasets yet. Be the first to submit!</p>}
    </div>
  )
}
