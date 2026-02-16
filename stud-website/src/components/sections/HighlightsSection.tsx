import Link from "next/link"

export default function HighlightsSection() {
  return (
    <section className="bg-tertiary mt-12 border-y border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-foreground/45 text-xs font-medium uppercase tracking-[0.16em]">Waitlist Access</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Get early access to Stud for Roblox.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
            Join the waitlist to get launch updates, private demos, and first access to new Roblox workflows.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            className="btn-metal inline-flex w-fit items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground"
            href={{ pathname: "/", hash: "waitlist" }}
          >
            Join Waitlist
          </Link>
          <Link
            className="btn-metal inline-flex w-fit items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground"
            href={{ pathname: "/", hash: "watch-demo" }}
          >
            Watch Demo
          </Link>
          <Link
            className="btn-metal-dark inline-flex w-fit items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors"
            href="/docs"
          >
            Read Docs
          </Link>
        </div>
      </div>
    </section>
  )
}
