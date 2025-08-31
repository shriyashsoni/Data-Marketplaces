import { JobForm } from "@/components/compute/job-form"
import { JobList } from "@/components/compute/job-list"

export default function ComputeJobsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Compute on Data</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Queue compute jobs that run directly against your datasets without exposing raw files. Create a job and
          monitor its status here.
        </p>
      </header>

      <section className="mb-10">
        <JobForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Jobs</h2>
        <JobList />
      </section>
    </main>
  )
}
