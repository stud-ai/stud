export default function HighlightsSection() {
  return (
    <div className="bg-tertiary mt-12 py-12">
      <section className="mx-auto w-full max-w-7xl">
        <h2 className="font-base text-muted-foreground mb-4 text-left text-base text-balance md:text-3xl">
          PlayerZero is an applied team focused on building AI to{" "}
          <span className="text-foreground">
            maintain and support software with exceptional quality.
          </span>
        </h2>
        <div className="mt-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-muted-foreground text-sm md:text-base">
              Recent highlights
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-col gap-6">
              <a
                className="bg-tertiary hover:bg-secondary/40 block rounded-sm border p-3 transition-colors"
                href="https://playerzero.ai/research/sim-1"
              >
                <div className="text-foreground text-sm font-medium md:text-base">
                  Introducing Sim-1
                </div>
                <p className="text-muted-foreground mt-0.5 text-[13px]">
                  Our smartest models capable of simulating how code runs
                </p>
                <p className="text-muted-foreground mt-1 text-[13px]">
                  A new category of models built to understand and predict how
                  large codebases behave in complex, real-world scenarios
                </p>
                <div className="text-muted-foreground mt-2 text-[11px]">
                  Research
                </div>
              </a>
              <a
                className="bg-tertiary hover:bg-secondary/40 block rounded-sm border p-3 transition-colors"
                href="/resources/case-study-cayuse"
              >
                <div className="text-foreground text-sm font-medium md:text-base">
                  &gt;80% Reduction in the average time to resolution by running
                  tickets through PlayerZero
                </div>
                <p className="text-muted-foreground mt-1 text-[13px]">
                  Cayuse achieves significant efficiency gains by automating
                  ticket triage and resolution workflows.
                </p>
                <div className="text-muted-foreground mt-2 text-[11px]">
                  Case Study
                </div>
              </a>
              <a
                className="bg-tertiary hover:bg-secondary/40 block rounded-sm border p-3 transition-colors"
                href="https://playerzero.ai/resources/what-is-predictive-software-quality-rethinking-reliable-software-operations-in-the-ai-era"
              >
                <div className="text-foreground text-sm font-medium md:text-base">
                  What is Predictive Software Quality? Software Operations in
                  the AI Era
                </div>
                <p className="text-muted-foreground mt-1 text-[13px]">
                  A new, AI-powered approach to operating software reliably
                  that anticipates how code will behave before deployment.
                </p>
                <div className="text-muted-foreground mt-2 text-[11px]">
                  Resources
                </div>
              </a>
            </div>
            <div className="mt-4">
              <a className="text-foreground text-sm hover:underline" href="/resources">
                View more posts →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
