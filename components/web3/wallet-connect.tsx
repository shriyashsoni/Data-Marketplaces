"use client"

import { WagmiConfig } from "wagmi"
import { injected } from "wagmi/connectors"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { wagmiConfig } from "@/lib/web3/config"
import { Button } from "@/components/ui/button"

export function WalletConnectButton() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletInner />
    </WagmiConfig>
  )
}

function WalletInner() {
  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <Button
        onClick={() => connect({ connector: injected() })}
        disabled={isConnecting}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </Button>
    )
  }

  const short = `${address?.slice(0, 6)}…${address?.slice(-4)}`
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{short}</span>
      <Button variant="outline" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  )
}
