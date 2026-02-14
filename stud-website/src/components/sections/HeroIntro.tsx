import {ArrowRight, Check} from "lucide-react";

export default function HeroIntro() {
  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-12 items-start gap-6">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
          <h1 className="font-base text-foreground text-3xl tracking-tight text-balance md:text-4xl lg:text-5xl">
            AI Support and QA agents that triage and test every ticket.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
            Built to solve and prevent hard problems in hard codebases.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#first-product-section"
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-10 px-6"
            >
              Learn more
            </a>
            <a
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 px-6"
              href="/request-demo"
            >
              Book a demo
              <ArrowRight className="ml-2 h-4 w-4 text-[#e65532]" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-muted-foreground mt-6 flex w-full items-center justify-between text-base tracking-tight md:text-lg">
          {[
            "Triage",
            "RCA",
            "Fix",
            "Test",
          ].map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
            >
              <div className="bg-foreground flex h-5 w-5 items-center justify-center rounded-full">
                <Check className="h-3 w-3 text-[#c3efc9]" strokeWidth={3} />
              </div>
              <span className="text-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
