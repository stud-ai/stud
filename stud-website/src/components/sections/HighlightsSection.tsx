export default function HighlightsSection() {
  return (
    <div className="bg-tertiary mt-12 py-12">
      <section className="mx-auto w-full max-w-7xl">
        <h2 className="font-base text-muted-foreground mb-4 text-left text-base text-balance md:text-3xl">
          Stud is an open-source AI coding assistant built to{" "}
          <span className="text-foreground">
            make developers more productive, especially those building on Roblox.
          </span>
        </h2>
        <div className="mt-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-muted-foreground text-sm md:text-base">
              Get started
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-col gap-6">
              <a
                className="bg-tertiary hover:bg-secondary/40 block rounded-sm border p-3 transition-colors"
                href="/docs/getting-started"
              >
                <div className="text-foreground text-sm font-medium md:text-base">
                  Getting Started with Stud
                </div>
                <p className="text-muted-foreground mt-0.5 text-[13px]">
                  Install and start coding with AI assistance
                </p>
                <p className="text-muted-foreground mt-1 text-[13px]">
                  Set up Stud in your terminal and connect to your favorite AI provider in minutes.
                </p>
                <div className="text-muted-foreground mt-2 text-[11px]">
                  Documentation
                </div>
              </a>
              <a
                className="bg-tertiary hover:bg-secondary/40 block rounded-sm border p-3 transition-colors"
                href="/docs/roblox"
              >
                <div className="text-foreground text-sm font-medium md:text-base">
                  Roblox Integration Guide
                </div>
                <p className="text-muted-foreground mt-1 text-[13px]">
                  Learn how to use Stud&apos;s 27+ specialized tools for Roblox Studio development.
                </p>
                <div className="text-muted-foreground mt-2 text-[11px]">
                  Tutorial
                </div>
              </a>
              <a
                className="bg-tertiary hover:bg-secondary/40 block rounded-sm border p-3 transition-colors"
                href="/docs/subagents"
              >
                <div className="text-foreground text-sm font-medium md:text-base">
                  Building with Subagents
                </div>
                <p className="text-muted-foreground mt-1 text-[13px]">
                  Delegate complex tasks to background agents for parallel workflows and faster results.
                </p>
                <div className="text-muted-foreground mt-2 text-[11px]">
                  Advanced
                </div>
              </a>
            </div>
            <div className="mt-4">
              <a className="text-foreground text-sm hover:underline" href="/docs">
                View documentation →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
