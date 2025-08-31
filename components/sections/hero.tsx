import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const pillars = [
  {
    title: "Data DAOs",
    desc: "Pool datasets and manage access via simple policies.",
    href: "/datasets",
  },
  {
    title: "Compute on Data",
    desc: "Run ML jobs without exposing raw files.",
    href: "/compute-jobs",
  },
  {
    title: "Research Marketplace",
    desc: "Discover and license verified datasets.",
    href: "/marketplace",
  },
]

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="max-w-2xl">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Data & Compute Marketplaces, without the web3 complexity
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Upload, curate, and monetize datasets. Allow vetted models to compute securely on your data. License access
          through a streamlined marketplace.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/datasets">Explore Datasets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/compute-jobs">Request Compute</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title} className="border">
            <CardContent className="p-5">
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4">
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Link href={p.href}>Open</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
