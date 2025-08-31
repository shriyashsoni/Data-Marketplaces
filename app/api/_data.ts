import crypto from "crypto"

export type Dataset = {
  id: string
  name: string
  summary: string
  sizeGB: number
  tags: string[]
  verified: boolean
  priceUSD?: number
}

export type Job = {
  id: string
  jobName: string
  datasetId: string
  model: string
  params?: string
  status: "queued" | "running" | "succeeded" | "failed"
}

export const store = {
  datasets: [] as Dataset[],
  jobs: [] as Job[],
}

// seed with a couple datasets
if (store.datasets.length === 0) {
  store.datasets.push(
    {
      id: crypto.randomUUID(),
      name: "Genomics Cohort v1",
      summary: "De-identified cohort with demographic features for population studies.",
      sizeGB: 180,
      tags: ["genomics", "health", "cohort"],
      verified: true,
      priceUSD: 1999,
    },
    {
      id: crypto.randomUUID(),
      name: "Earth Observation (Q2)",
      summary: "Multi-spectral satellite tiles for agricultural monitoring.",
      sizeGB: 520,
      tags: ["satellite", "imagery", "agriculture"],
      verified: true,
      priceUSD: 1499,
    },
  )
}
