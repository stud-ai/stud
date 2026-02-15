export default function SiteFooter() {
  return (
    <footer className="bg-background border-border mt-auto w-full border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
        {/* Top: Nav columns */}
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <a href="/" className="inline-flex items-center gap-2.5">
              <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-8 w-8" />
              <span className="font-tech text-lg leading-none tracking-tight text-foreground">STUD</span>
            </a>
            <p className="text-muted-foreground text-sm max-w-[240px] leading-relaxed">
              Open-source AI coding assistant built for Roblox developers.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-16 sm:gap-20">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">Product</span>
              <a href="/docs/getting-started" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</a>
              <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
              <a href="/docs/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tools</a>
              <a href="/docs/roblox" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roblox Guide</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">Community</span>
              <a href="https://github.com/stud-ai/stud" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
              <a href="https://github.com/stud-ai/stud/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Issues</a>
              <a href="https://github.com/stud-ai/stud/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">License</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-border mt-12 border-t" />

        {/* Bottom: giant STUD + copyright */}
        <div className="relative mt-8 overflow-hidden rounded-xl">
          <div className="relative z-10 flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-end sm:justify-between">
            <a aria-label="STUD" className="group" href="/">
              <span className="font-tech block text-[clamp(3rem,14vw,8rem)] leading-none tracking-[-0.02em] text-foreground/10 transition-colors duration-300 group-hover:text-foreground/25">
                STUD
              </span>
            </a>
            <p className="text-muted-foreground/50 text-xs pb-1">
              &copy; {new Date().getFullYear()} Stud. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
