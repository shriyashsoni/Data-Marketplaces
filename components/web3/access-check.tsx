"use client"

import { WagmiConfig } from "wagmi"
import { useAccount, useReadContract } from "wagmi"
import { wagmiConfig } from "@/lib/web3/config"
import { erc721Abi, ACCESS_NFT_ADDRESS } from "@/lib/web3/contracts"

export function AccessCheck({ datasetId }: { datasetId: number }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <AccessInner datasetId={datasetId} />
    </WagmiConfig>
  )
}

function AccessInner({ datasetId }: { datasetId: number }) {
  const { address, isConnected } = useAccount()
  const { data, error } = useReadContract({
    address: ACCESS_NFT_ADDRESS,
    abi: erc721Abi,
    functionName: "ownerOf",
    args: [BigInt(datasetId)],
  })

  if (!isConnected) {
    return <p className="text-sm text-muted-foreground">Connect wallet to check access.</p>
  }
  if (!ACCESS_NFT_ADDRESS) {
    return <p className="text-sm text-muted-foreground">Access NFT not configured.</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">Unable to verify access.</p>
  }
  const owns = (data as `0x${string}` | undefined)?.toLowerCase() === address?.toLowerCase()
  return owns ? (
    <p className="text-sm text-emerald-600">Access granted via NFT.</p>
  ) : (
    <p className="text-sm text-amber-600">No access NFT found for this dataset.</p>
  )
}
