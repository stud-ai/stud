export default function HighlightsSection() {
  return (
    <section className="bg-tertiary mt-12 border-y border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-foreground/45 text-xs font-medium uppercase tracking-[0.16em]">
            Start Building
          </p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Ship your next Roblox update with Stud.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base md:text-lg">
            Luau edits, instance actions, and toolbox workflows from one AI-powered terminal.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            className="btn-metal inline-flex w-fit items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground"
            href="/docs/getting-started"
          >
            Get Started
          </a>
          <a
            className="btn-metal inline-flex w-fit items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-foreground"
            href="/docs/roblox"
          >
            Roblox Guide
          </a>
          <a
            className="btn-metal-dark inline-flex w-fit items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors"
            href="https://github.com/improdead/stud"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
