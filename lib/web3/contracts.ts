export const ACCESS_NFT_ADDRESS = (process.env.NEXT_PUBLIC_ACCESS_NFT_ADDRESS || "") as `0x${string}`
export const MARKETPLACE_ADDRESS = (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "") as `0x${string}`

export const erc721Abi = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "owner", type: "address" }],
  },
] as const

export const marketplaceAbi = [
  {
    type: "function",
    name: "purchase",
    stateMutability: "payable",
    inputs: [{ name: "datasetId", type: "uint256" }],
    outputs: [],
  },
] as const
