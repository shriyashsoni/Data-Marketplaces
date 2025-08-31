"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WalletConnectButton } from "@/components/web3/wallet-connect"

const links = [
  { href: "/datasets", label: "Datasets" },
  { href: "/compute-jobs", label: "Compute" },
  { href: "/marketplace", label: "Marketplace" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-blue-600">
          Data Marketplaces
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("text-sm text-muted-foreground hover:text-foreground transition-colors")}
            >
              {l.label}
            </Link>
          ))}
          <WalletConnectButton />
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </nav>
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-foreground">
            <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-sm">
                {l.label}
              </Link>
            ))}
            <div className="py-2">
              <WalletConnectButton />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  )
}
