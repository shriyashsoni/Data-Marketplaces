"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export type Offer = {
  id: string
  title: string
  description?: string | null
  price_cents: number
  dataset_id?: string | null
  image_url?: string | null
}

export function OfferCard({ offer, onPurchased }: { offer: Offer; onPurchased?: () => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer_id: offer.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Checkout failed")
      toast({ title: "Purchase complete", description: `Access granted for "${offer.title}".` })
      onPurchased?.()
    } catch (e: any) {
      toast({ title: "Purchase failed", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-pretty text-base">{offer.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {offer.image_url ? (
          <img
            src={offer.image_url || "/placeholder.svg"}
            alt={offer.title}
            className="h-36 w-full rounded-md object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <img
            src={"/placeholder.svg?height=144&width=288&query=dataset%20image%20placeholder"}
            alt=""
            className="h-36 w-full rounded-md object-cover"
          />
        )}
        {offer.description ? (
          <p className="text-pretty text-muted-foreground">{offer.description}</p>
        ) : (
          <p className="text-muted-foreground">No description provided.</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-medium">${(offer.price_cents / 100).toFixed(2)}</span>
          <Button size="sm" onClick={handleBuy} disabled={loading}>
            {loading ? "Processing..." : "Purchase"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
