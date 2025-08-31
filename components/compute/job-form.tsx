"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

type Dataset = { id: string; name: string }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function JobForm() {
  const { data } = useSWR<{ datasets: Dataset[] }>("/api/datasets", fetcher)
  const [datasetId, setDatasetId] = useState("")
  const [jobName, setJobName] = useState("")
  const [model, setModel] = useState("summary")
  const [params, setParams] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ id: string; status: string } | null>(null)

  async function submit() {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datasetId, jobName, model, params }),
      })
      const json = await res.json()
      setResult(json)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jobName">Job name</Label>
        <Input id="jobName" value={jobName} onChange={(e) => setJobName(e.target.value)} placeholder="Genome QC run" />
      </div>

      <div className="space-y-2">
        <Label>Dataset</Label>
        <Select value={datasetId} onValueChange={setDatasetId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a dataset" />
          </SelectTrigger>
          <SelectContent>
            {(data?.datasets ?? []).map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Model</Label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summary">Summary Stats</SelectItem>
            <SelectItem value="anonymize">Anonymize</SelectItem>
            <SelectItem value="inference">ML Inference</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="params">Parameters</Label>
        <Textarea
          id="params"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          placeholder="e.g. target=age, k=10"
        />
      </div>

      <Button
        disabled={submitting || !datasetId || !jobName}
        onClick={submit}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {submitting ? "Submitting…" : "Submit Job"}
      </Button>

      {result && (
        <p className="text-sm text-emerald-600">
          Submitted job {result.id}. Status: {result.status}
        </p>
      )}
    </div>
  )
}
