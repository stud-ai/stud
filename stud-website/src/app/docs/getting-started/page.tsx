import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Installation & Setup",
  description:
    "Get up and running with Stud in under five minutes. Install, configure your API key, set up the Roblox Studio plugin, and write your first prompt.",
  alternates: { canonical: "/docs/getting-started" },
}

export default function GettingStartedPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/40">Getting Started</p>
      <h1 className="font-display mt-3 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
        Installation & Setup
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Get up and running with Stud in under five minutes.
      </p>

      {/* Prerequisites */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Prerequisites</h2>
        <ul className="mt-4 space-y-2 text-base text-foreground/80">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-foreground/30" />
            <span><strong className="text-foreground">Node.js 18+</strong> — Stud requires a modern Node.js runtime</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-foreground/30" />
            <span><strong className="text-foreground">Roblox Studio</strong> — For Roblox integration features (optional for general coding)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-foreground/30" />
            <span><strong className="text-foreground">An API key</strong> — From your preferred LLM provider</span>
          </li>
        </ul>
      </div>

      {/* Step 1: Install */}
      <div className="mt-12 border-t border-border pt-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">1</span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Install Stud</h2>
        </div>
        <p className="mt-3 text-base text-foreground/80">
          Clone the repository and install dependencies:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <span className="font-mono text-xs text-foreground/40">Terminal</span>
          </div>
          <pre className="overflow-x-auto bg-foreground p-4 font-mono text-sm leading-relaxed text-white/85">
            <code>{`git clone https://github.com/improdead/stud.git
cd stud
bun install`}</code>
          </pre>
        </div>
      </div>

      {/* Step 2: Configure */}
      <div className="mt-12 border-t border-border pt-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">2</span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Configure your API key</h2>
        </div>
        <p className="mt-3 text-base text-foreground/80">
          Set your API key as an environment variable:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <span className="font-mono text-xs text-foreground/40">Terminal</span>
          </div>
          <pre className="overflow-x-auto bg-foreground p-4 font-mono text-sm leading-relaxed text-white/85">
            <code>{`export ANTHROPIC_API_KEY="your-api-key-here"`}</code>
          </pre>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-amber-600">△</span>
            <div>
              <p className="text-sm font-medium text-amber-900">Keep your API key secure</p>
              <p className="mt-1 text-sm text-amber-800/80">
                Add your API key to your shell profile (<code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.bashrc</code> or <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.zshrc</code>) so it persists across sessions. Never commit API keys to version control.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Install Plugin */}
      <div className="mt-12 border-t border-border pt-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">3</span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Install the Roblox Studio plugin</h2>
        </div>
        <p className="mt-3 text-base text-foreground/80">
          To use Roblox integration features, install the companion plugin:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <span className="font-mono text-xs text-foreground/40">Terminal</span>
          </div>
          <pre className="overflow-x-auto bg-foreground p-4 font-mono text-sm leading-relaxed text-white/85">
            <code>{`# The plugin file is included in the repo
# Copy it to your Roblox Studio plugins folder:

cp plugins/stud-plugin.rbxm ~/Documents/Roblox/Plugins/`}</code>
          </pre>
        </div>
        <p className="mt-4 text-sm text-foreground/60">
          After copying, restart Roblox Studio. You should see the Stud plugin appear in the Plugins tab. Enable <strong>HTTP Requests</strong> in Game Settings → Security for the plugin to communicate with Stud.
        </p>
      </div>

      {/* Step 4: Launch */}
      <div className="mt-12 border-t border-border pt-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">4</span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Launch Stud</h2>
        </div>
        <p className="mt-3 text-base text-foreground/80">
          Start Stud in your project directory:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <span className="font-mono text-xs text-foreground/40">Terminal</span>
          </div>
          <pre className="overflow-x-auto bg-foreground p-4 font-mono text-sm leading-relaxed text-white/85">
            <code>{`bun run start`}</code>
          </pre>
        </div>
      </div>

      {/* First prompt */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Your first prompt</h2>
        <p className="mt-3 text-base text-foreground/80">
          Once Stud is running, try a simple prompt to explore your codebase:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-3.5 w-3.5" />
            <span className="font-mono text-xs text-foreground/40">stud</span>
          </div>
          <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
            <div className="text-white/50">{">"} <span className="text-white/90">Read my project structure and summarize what each file does</span></div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✱</span>
                <span className="text-white/70">Glob &quot;**/*&quot;</span>
                <span className="ml-auto text-xs text-white/30">23 files</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">→</span>
                <span className="text-white/70">Read src/server/init.lua</span>
                <span className="ml-auto text-xs text-white/30">142 lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">→</span>
                <span className="text-white/70">Read src/client/PlayerGui.lua</span>
                <span className="ml-auto text-xs text-white/30">89 lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">~</span>
                <span className="text-white/40">Reading remaining files...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="mt-16 rounded-xl border border-border bg-secondary p-6">
        <h3 className="text-base font-semibold text-foreground">Next Steps</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href="/docs/tools" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Tools Reference →</span>
            <p className="mt-1 text-xs text-muted-foreground">Learn about all available tools</p>
          </a>
          <a href="/docs/roblox" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Roblox Integration →</span>
            <p className="mt-1 text-xs text-muted-foreground">Set up Roblox Studio tools</p>
          </a>
        </div>
      </div>
    </div>
  )
}
