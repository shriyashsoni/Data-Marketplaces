import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>
      <SiteFooter />
    </div>
  )
}
