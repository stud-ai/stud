import { BookOpen, Wrench, Shield, Gamepad2 } from "lucide-react"

const cards = [
  {
    title: "Getting Started",
    description: "Install Stud and start coding in minutes. Set up your environment and write your first prompt.",
    href: "/docs/getting-started",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Tools Reference",
    description: "Read, write, search, and execute. A complete reference for every tool in your arsenal.",
    href: "/docs/tools",
    icon: Wrench,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Permissions",
    description: "Understand how Stud keeps you in control with granular, transparent permission prompts.",
    href: "/docs/permissions",
    icon: Shield,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Roblox Integration",
    description: "27+ specialized tools for Roblox Studio. Edit scripts, manipulate instances, query DataStores.",
    href: "/docs/roblox",
    icon: Gamepad2,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
]

export default function DocsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/40">Documentation</p>
        <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
          Learn Stud
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Stud is an open-source AI coding assistant with deep Roblox Studio integration. It lives in your terminal and gives you the tools to read, write, search, and execute across your entire codebase.
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <a
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-border bg-white p-6 transition-all hover:border-foreground/20 hover:shadow-sm"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <h3 className="text-base font-semibold text-foreground group-hover:text-foreground">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </a>
          )
        })}
      </div>

      {/* Quick overview */}
      <div className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is Stud?</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
          <p>
            Stud is a terminal-native AI coding assistant purpose-built for Roblox developers. It combines the power of large language models with 27+ specialized tools that connect directly to Roblox Studio through a companion plugin.
          </p>
          <p>
            Unlike general-purpose AI tools, Stud understands the Roblox ecosystem. It can read and edit Luau scripts, manipulate instances in your game tree, query DataStores, search the Toolbox, and much more — all from natural language prompts in your terminal.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-secondary p-6">
          <h3 className="text-sm font-semibold text-foreground">Key Capabilities</h3>
          <ul className="mt-4 space-y-3">
            {[
              { icon: "→", label: "File Operations", desc: "Read, write, and edit files with full codebase context" },
              { icon: "✱", label: "Smart Search", desc: "Glob patterns and regex search across your project" },
              { icon: ">_", label: "Shell Execution", desc: "Run bash commands with intelligent output parsing" },
              { icon: "◆", label: "Roblox Tools", desc: "27+ tools for scripts, instances, DataStores, and more" },
              { icon: "◉", label: "Subagents", desc: "Delegate tasks to background agents for parallel work" },
              { icon: "△", label: "Permissions", desc: "Granular control over every action Stud takes" },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-md bg-tertiary font-mono text-xs text-foreground/60">
                  {item.icon}
                </span>
                <div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground"> — {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Architecture overview */}
      <div className="mt-12 border-t border-border pt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Architecture</h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/80">
          Stud runs as a terminal application on your machine. It connects to Roblox Studio through a companion plugin that exposes a local HTTP API. This architecture means your code never leaves your machine — Stud reads and writes files directly, and communicates with Studio locally.
        </p>
        <div className="mt-6 rounded-xl border border-border bg-foreground p-5 font-mono text-sm text-white/80">
          <div className="text-white/40">{"// How Stud connects"}</div>
          <div className="mt-2 flex items-center gap-3">
            <span className="rounded bg-white/10 px-2 py-0.5 text-emerald-400">Terminal</span>
            <span className="text-white/30">→</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-blue-400">Stud Core</span>
            <span className="text-white/30">→</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-amber-400">Plugin API</span>
            <span className="text-white/30">→</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-purple-400">Roblox Studio</span>
          </div>
          <div className="mt-3 text-white/40">{"// Local only — your code stays on your machine"}</div>
        </div>
      </div>
    </div>
  )
}
