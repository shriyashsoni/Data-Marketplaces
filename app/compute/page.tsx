import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { JobForm } from "@/components/compute/job-form"

export default function ComputePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold">Request Compute</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Submit a compute job to run models against a dataset. Raw data remains private; only approved outputs are
          returned.
        </p>
        <div className="mt-6">
          <JobForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
