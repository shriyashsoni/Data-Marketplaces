"use client"

import useSWR from "swr"
import { useEffect } from "react"
import { jsonFetcher } from "@/lib/fetcher"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Job = {
  id: string
  dataset_id: string
  job_name: string
  status: string
  result_url?: string | null
  created_at: string
}

export function JobList({ datasetId }: { datasetId?: string }) {
  const key = datasetId ? `/api/compute-jobs?dataset_id=${datasetId}` : "/api/compute-jobs"
  const { data, error, mutate } = useSWR<Job[]>(key, jsonFetcher)

  useEffect(() => {
    const i = setInterval(() => mutate(), 5000)
    return () => clearInterval(i)
  }, [mutate])

  if (error) return <div className="text-sm text-red-600">Failed to load jobs</div>
  const jobs = data || []
  if (jobs.length === 0) {
    return <div className="text-sm text-muted-foreground">No compute jobs yet.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <Card key={job.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">{job.job_name}</CardTitle>
              <CardDescription className="text-xs">
                Job: {job.id.slice(0, 8)} • Dataset: {job.dataset_id.slice(0, 8)} •{" "}
                {new Date(job.created_at).toLocaleString()}
              </CardDescription>
            </div>
            <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
          </CardHeader>
          <CardContent className="text-sm">
            {job.result_url ? (
              <a href={job.result_url} target="_blank" rel="noreferrer" className="text-primary underline">
                View result
              </a>
            ) : (
              <span className="text-muted-foreground">No result yet</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "queued":
      return "secondary"
    case "running":
      return "default"
    case "succeeded":
      return "outline"
    case "failed":
    case "canceled":
      return "destructive"
    default:
      return "secondary"
  }
}
