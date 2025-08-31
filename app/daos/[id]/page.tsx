import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

async function getDao(id: string) {
  const base = process.env.NEXT_PUBLIC_V0_URL || ""
  const res = await fetch(`${base}/api/daos/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function DaoDetailPage({ params }: { params: { id: string } }) {
  const data = await getDao(params.id)
  const dao = data?.dao
  const datasets = data?.datasets || []

  return (
    <div className="min-h-dvh flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {!dao ? (
            <p className="text-sm text-muted-foreground">DAO not found.</p>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">{dao.name}</h1>
                {dao.description && <p className="text-muted-foreground">{dao.description}</p>}
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Datasets</h2>
                <Link href="/submit" className="text-sm underline">
                  Attach a dataset
                </Link>
              </div>
              {datasets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No datasets linked yet.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {datasets.map((d: any) => (
                    <li key={d.id} className="border rounded-lg p-4">
                      <Link href={`/datasets/${d.id}`} className="font-medium hover:underline">
                        {d.name}
                      </Link>
                      {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
