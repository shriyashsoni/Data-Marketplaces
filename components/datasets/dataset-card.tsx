import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type Dataset = {
  id: string
  name: string
  summary: string
  sizeGB: number
  tags: string[]
  verified: boolean
  priceUSD?: number
}

export function DatasetCard({ d, cta = "View", href }: { d: Dataset; cta?: string; href: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{d.name}</h3>
          {d.verified && <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{d.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {d.tags?.slice(0, 4).map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Size: {d.sizeGB} GB {d.priceUSD ? `• $${d.priceUSD}` : ""}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link href={href}>{cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
