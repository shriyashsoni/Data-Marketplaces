"use client"

import type { PropsWithChildren } from "react"
import { useState } from "react"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "@/lib/web3/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
