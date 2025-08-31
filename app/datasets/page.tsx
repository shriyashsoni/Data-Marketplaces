import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DatasetList } from "@/components/datasets/dataset-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DatasetsPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Datasets</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/datasets/submit">Submit Dataset</Link>
          </Button>
        </div>
        <div className="mt-6">
          <DatasetList />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
