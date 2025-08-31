"use client"

import { WagmiConfig } from "wagmi"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { wagmiConfig } from "@/lib/web3/config"
import { marketplaceAbi, MARKETPLACE_ADDRESS } from "@/lib/web3/contracts"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function PurchaseButton({ datasetId, priceEth }: { datasetId: number; priceEth: string }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <PurchaseInner datasetId={datasetId} priceEth={priceEth} />
    </WagmiConfig>
  )
}

function PurchaseInner({ datasetId, priceEth }: { datasetId: number; priceEth: string }) {
  const { data: hash, isPending, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const [clicked, setClicked] = useState(false)

  if (!MARKETPLACE_ADDRESS) {
    return (
      <Button disabled variant="secondary" title="Configure NEXT_PUBLIC_MARKETPLACE_ADDRESS">
        Configure Marketplace
      </Button>
    )
  }

  const onPurchase = async () => {
    setClicked(true)
    try {
      await writeContract({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "purchase",
        args: [BigInt(datasetId)],
        value: parseEther(priceEth),
      })
    } catch {
      // surfaced below
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={onPurchase} disabled={isPending || isConfirming} className="bg-blue-600 hover:bg-blue-700">
        {isPending ? "Confirm in Wallet…" : isConfirming ? "Waiting for Confirmations…" : `Purchase • ${priceEth} ETH`}
      </Button>
      {error && clicked ? <p className="text-xs text-red-600">Transaction failed: {error.message}</p> : null}
      {isSuccess ? <p className="text-xs text-emerald-600">Purchase complete!</p> : null}
    </div>
  )
}
