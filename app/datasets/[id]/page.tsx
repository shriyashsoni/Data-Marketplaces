import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AccessCheck } from "@/components/web3/access-check"

async function getDataset(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_V0_URL || ""}/api/datasets?id=${id}`, { cache: "no-store" })
  try {
    const data = await res.json()
    const d = (data?.datasets || []).find((x: any) => x.id === id)
    return d
  } catch {
    return null
  }
}

export default async function DatasetDetailPage({ params }: { params: { id: string } }) {
  const dataset = await getDataset(params.id)

  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {dataset ? (
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold">{dataset.name}</h1>
            <p className="text-muted-foreground">{dataset.summary}</p>
            <div className="text-sm text-muted-foreground">Size: {dataset.sizeGB} GB</div>
            {Number.isFinite(Number(dataset.id)) ? (
              <div className="pt-2">
                <AccessCheck datasetId={Number(dataset.id)} />
              </div>
            ) : null}
            <div className="pt-4 flex gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/compute-jobs?dataset=${dataset.id}`}>Request Compute</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/marketplace">View in Marketplace</Link>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Dataset not found.</p>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
