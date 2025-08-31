export async function jsonFetcher<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Request failed ${res.status}: ${body || res.statusText}`)
  }
  return res.json()
}
