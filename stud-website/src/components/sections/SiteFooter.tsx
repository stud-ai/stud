import Logo from "../Logo";

export default function SiteFooter() {
  return (
    <footer className="bg-background border-border mt-auto w-full border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Platform
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/platform/agentic-debugging"
              >
                Agentic debugging
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/platform/code-simulations"
              >
                Code simulations
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/enterprise"
              >
                Enterprise
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Company
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/resources"
              >
                Resources
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/about-us"
              >
                About us
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/careers"
              >
                Careers
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
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/legal/acceptable-use-policy"
              >
                Acceptable use policy
              </a>
              <a
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                href="/report-ai-impact"
              >
                Report AI concerns
              </a>
            </nav>
          </div>
        </div>
        <div className="border-border mt-8 flex flex-col items-start justify-between gap-4 border-t pt-6 md:flex-row md:items-center">
          <a className="flex items-center" href="/">
            <Logo className="text-foreground h-4 w-auto" />
          </a>
          <p className="text-muted-foreground text-sm">
            © 2026 PlayerZero, Inc. ✓ SOC 2 Type II &amp; HIPAA Certified
          </p>
        </div>
      </div>
    </footer>
  );
}
