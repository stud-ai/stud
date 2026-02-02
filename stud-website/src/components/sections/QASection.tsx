import {
  Beaker,
  Check,
  CircleCheck,
  GitCommitHorizontal,
  ShieldCheck,
} from "lucide-react";

const qaRows = [
  "Entitlements: SAML group sync updates roles across services",
  "Billing: proration + FX rounding reconcile on invoice run",
  "Idempotency: payment webhook retry is side‑effect free",
  "Approvals: high‑value discount requires dual sign‑off",
];

export default function QASection() {
  return (
    <section className="mx-auto w-full max-w-7xl py-16">
      <div className="mb-8">
        <h2 className="font-base text-2xl tracking-tight md:text-3xl">
          Autonomous QA on every commit
        </h2>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          Continuous, code-aware simulations that run on each change and
          validate customer workflows before merge.
        </p>
      </div>
      <div className="grid grid-cols-12 items-stretch gap-12 md:gap-14 lg:gap-16">
        <div className="col-span-12 lg:col-span-6">
          <div className="overflow-hidden rounded-sm border shadow-sm">
            <div className="relative aspect-[4/3]">
              <div className="absolute inset-0 opacity-75 dark:opacity-60">
                <img
                  alt="Mountain"
                  className="object-cover"
                  src="/assets/mountain.png"
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="w-[92%] md:w-[86%] lg:w-[78%]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 inline-flex items-center gap-3 rounded-md border p-3 shadow backdrop-blur">
                      <GitCommitHorizontal className="text-muted-foreground h-4 w-4" />
                      <div className="text-foreground text-sm">
                        New commit validated • 4 simulations passed
                      </div>
                    </div>
                    <div className="bg-secondary w-full rounded-md border p-4 shadow-sm md:p-5">
                      <div className="flex items-center gap-2">
                        <div className="bg-foreground flex h-5 w-5 items-center justify-center rounded-full">
                          <Check
                            className="h-3 w-3 text-[#c3efc9]"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-foreground text-xs font-medium">
                          Testing ›
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Simulations complete
                        </span>
                      </div>
                      <div className="border-border bg-tertiary mt-4 divide-y rounded-sm border">
                        {qaRows.map((row) => (
                          <div
                            key={row}
                            className="flex items-center justify-between px-3 py-2"
                          >
                            <div className="mr-2 flex min-w-0 flex-1 items-center gap-2">
                              <div className="mt-0.5 flex-shrink-0 self-start">
                                <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#38af4b]">
                                  <Check className="h-2.5 w-2.5 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm">{row}</div>
                              </div>
                            </div>
                            <div className="ml-2 flex w-1/4 min-w-0 flex-shrink-0 items-center justify-end self-center">
                              <span className="rounded-full bg-[#38af4b]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#299039]">
                                Pass
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 flex flex-col lg:col-span-6">
          <ul className="space-y-6">
            <li className="flex items-start gap-3 py-3">
              <Beaker className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <div className="text-sm font-medium">
                  Generate test scenarios automatically
                </div>
                <div className="text-muted-foreground text-sm">
                  AI builds scenarios from PRDs, diffs, and tickets.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 py-3">
              <ShieldCheck className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Prevent regressions</div>
                <div className="text-muted-foreground text-sm">
                  Simulations proactively verify the most impactful areas of
                  your software.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 py-3">
              <CircleCheck className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Ship with confidence</div>
                <div className="text-muted-foreground text-sm">
                  Pass/fail gates and RCA on failures keep master stable.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 py-3">
              <GitCommitHorizontal className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <div className="text-sm font-medium">
                  Plug into CI &amp; PR Workflows
                </div>
                <div className="text-muted-foreground text-sm">
                  Insights and approvals appear in code review and pipelines.
                </div>
              </div>
            </li>
          </ul>
          <a
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 mt-auto w-fit"
            href="/platform/code-simulations"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
