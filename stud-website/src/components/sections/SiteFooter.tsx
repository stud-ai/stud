import Logo from "../Logo";

export default function SiteFooter() {
  return (
    <footer className="bg-background border-border mt-auto w-full border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Product
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/docs"
              >
                Documentation
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/docs/roblox"
              >
                Roblox Integration
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/docs/tools"
              >
                Tools Reference
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Community
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="https://github.com/improdead/stud"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/changelog"
              >
                Changelog
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/contributing"
              >
                Contributing
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Legal
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/legal/terms-of-service"
              >
                Terms of service
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/legal/privacy-policy"
              >
                Privacy policy
              </a>
            </nav>
          </div>
        </div>
        <div className="border-border mt-8 flex flex-col items-start justify-between gap-4 border-t pt-6 md:flex-row md:items-center">
          <a className="flex items-center" href="/">
            <Logo className="text-foreground h-4 w-auto" />
          </a>
          <p className="text-muted-foreground text-sm">
            © 2026 Stud. Open Source AI Coding Assistant.
          </p>
        </div>
      </div>
    </footer>
  );
}
