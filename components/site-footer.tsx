export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="text-pretty">
          © {new Date().getFullYear()} Data Marketplaces. Built for privacy-preserving analytics.
        </p>
      </div>
    </footer>
  )
}
