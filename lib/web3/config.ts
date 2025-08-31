import { createConfig } from "wagmi"
import { mainnet, sepolia, polygonAmoy } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { http } from "viem"

const DEFAULT_CHAIN = sepolia
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || DEFAULT_CHAIN.id)
const knownChains = [mainnet, sepolia, polygonAmoy] as const
export const activeChain = knownChains.find((c) => c.id === CHAIN_ID) || DEFAULT_CHAIN

const RPC_FALLBACK =
  activeChain.rpcUrls?.public?.http?.[0] ?? activeChain.rpcUrls?.default?.http?.[0] ?? "https://rpc.sepolia.org"

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || RPC_FALLBACK

export const wagmiConfig = createConfig({
  chains: [activeChain],
  transports: { [activeChain.id]: http(RPC_URL) },
  connectors: [injected()],
})
