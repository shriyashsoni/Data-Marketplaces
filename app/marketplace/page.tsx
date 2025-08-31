import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OfferList } from "@/components/marketplace/offer-list"

export default function MarketplacePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold">Research Marketplace</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          License access to verified datasets for research and analytics.
        </p>
        <div className="mt-6">
          <OfferList />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
