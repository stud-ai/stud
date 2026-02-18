import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  KeyRound,
  Radar,
  Shield,
  Sparkles,
  TerminalSquare,
  Wrench,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Comprehensive Stud documentation for setup, tools, permissions, and Roblox Studio workflows. Learn how to ship faster with a terminal-native AI coding assistant.",
  alternates: { canonical: "/docs" },
}

const guides = [
  {
    title: "Getting Started",
    description: "Install Stud, connect your model provider, and run your first session in under five minutes.",
    href: "/docs/getting-started",
    icon: BookOpen,
    accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
    points: ["Requirements and setup", "Plugin installation", "First prompt walkthrough"],
  },
  {
    title: "Tools Reference",
    description: "Understand every core tool: read, write, edit, search, shell execution, and subagent workflows.",
    href: "/docs/tools",
    icon: Wrench,
    accent: "text-blue-700 bg-blue-50 border-blue-200",
    points: ["Tool-by-tool examples", "Parameters and outputs", "When to use each tool"],
  },
  {
    title: "Permissions",
    description: "Learn how approvals work so you can keep full control over file edits, commands, and Studio actions.",
    href: "/docs/permissions",
    icon: Shield,
    accent: "text-amber-700 bg-amber-50 border-amber-200",
    points: ["Allow once vs always", "Safe defaults", "Session best practices"],
  },
  {
    title: "Roblox Integration",
    description: "Go deep with 27+ Studio-aware tools for scripts, instances, DataStores, and Toolbox workflows.",
    href: "/docs/roblox",
    icon: Gamepad2,
    accent: "text-indigo-700 bg-indigo-50 border-indigo-200",
    points: ["Studio plugin connection", "Roblox tool families", "Real-world command examples"],
  },
] as const

const path = [
  {
    step: "1",
    title: "Install and launch",
    detail: "Clone the repo, install dependencies, and start Stud in your project directory.",
    href: "/docs/getting-started",
    cta: "Setup guide",
  },
  {
    step: "2",
    title: "Learn your core tools",
    detail: "Master Read, Edit, Glob, Grep, and Bash so your prompts translate into precise execution.",
    href: "/docs/tools",
    cta: "Tools reference",
  },
  {
    step: "3",
    title: "Tune permissions",
    detail: "Configure approval behavior for safer automation and smoother day-to-day sessions.",
    href: "/docs/permissions",
    cta: "Permission model",
  },
  {
    step: "4",
    title: "Connect Roblox Studio",
    detail: "Enable the plugin and unlock script edits, instance actions, DataStore access, and toolbox flows.",
    href: "/docs/roblox",
    cta: "Roblox docs",
  },
] as const

const prompts = [
  {
    title: "Explore a codebase",
    description: "Use this when onboarding to an unfamiliar project.",
    icon: Radar,
    accent: "text-blue-700 bg-blue-50 border-blue-200",
    list: [
      "Map this project structure and summarize each directory.",
      "Find where authentication is implemented and explain the flow.",
      "List every API endpoint and show where each is used.",
    ],
  },
  {
    title: "Implement features",
    description: "Guide Stud with intent, constraints, and expected output.",
    icon: Sparkles,
    accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
    list: [
      "Add a cooldown system for abilities and include tests.",
      "Create a reusable health bar component with mobile support.",
      "Refactor this module for readability without changing behavior.",
    ],
  },
  {
    title: "Ship Roblox updates",
    description: "Blend CLI code edits with Studio-side operations.",
    icon: TerminalSquare,
    accent: "text-indigo-700 bg-indigo-50 border-indigo-200",
    list: [
      "Create a round manager in ServerScriptService and wire RemoteEvents.",
      "Search Toolbox for a medieval village set and insert top two results.",
      "Inspect DataStore key user_123 and add migration logic if needed.",
    ],
  },
] as const

const commands = [
  {
    label: "Install",
    text: `git clone https://github.com/stud-ai/stud.git\ncd stud\nbun install`,
  },
  {
    label: "Set API key",
    text: `export ANTHROPIC_API_KEY="your-api-key"`,
  },
  {
    label: "Start session",
    text: `bun run start`,
  },
] as const

const faqs = [
  {
    q: "Do I need Roblox Studio to use Stud?",
    a: "No. Stud works as a general coding assistant for any project. Roblox Studio is only required if you want the Studio-specific tools.",
  },
  {
    q: "Does Stud run actions without me?",
    a: "Stud asks for approval before sensitive actions like writes, shell commands, and Studio mutations. You stay in control of every session.",
  },
  {
    q: "Can I use different model providers?",
    a: "Yes. Stud is model-flexible. Configure your provider key and settings, then choose the model workflow that fits your task and budget.",
  },
  {
    q: "What should I include in a great prompt?",
    a: "Describe the goal, constraints, and acceptance criteria. Add context like file paths, expected behavior, and whether tests should be updated.",
  },
] as const

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://trystud.me",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Documentation",
      item: "https://trystud.me/docs",
    },
  ],
}

export default function DocsPage() {
  return (
    <div className="max-w-5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white via-white to-secondary p-8 md:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-16 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/45">Documentation</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground md:text-6xl">
                Build faster with Stud, from first prompt to shipped update.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                This docs hub gives you everything: setup, tool behavior, permission controls, and Roblox Studio
                workflows. Use it as both a first-day guide and an everyday reference.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-foreground px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-foreground/90"
              >
                Start in 5 minutes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs/tools"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Browse tools
                <Wrench className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">Time to first run</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">~5 min</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">Roblox toolset</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">27+ tools</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">Control model</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Permission-first</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Choose your guide</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/75">
            Jump directly to what you need right now, then come back to fill in the rest. Each guide is written to be
            practical, not theoretical.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-xl border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${guide.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-foreground/35 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/65" />
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{guide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>

                <ul className="mt-4 space-y-2 text-sm text-foreground/70">
                  {guide.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-foreground/35" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-border bg-white p-6 md:p-7">
          <div className="flex items-center gap-2 text-foreground/55">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-medium uppercase tracking-[0.14em]">Recommended path</p>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Fast track to productive sessions
          </h2>
          <div className="mt-6 space-y-3">
            {path.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-secondary/70 p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-foreground text-xs font-semibold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/70">{item.detail}</p>
                    <Link
                      href={item.href}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-foreground"
                    >
                      {item.cta}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 md:p-7">
          <div className="flex items-center gap-2 text-foreground/55">
            <KeyRound className="h-4 w-4" />
            <p className="text-xs font-medium uppercase tracking-[0.14em]">Command quickstart</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">Copy-ready essentials</h2>
          <div className="mt-5 space-y-3">
            {commands.map((item) => (
              <div key={item.label} className="overflow-hidden rounded-lg border border-border">
                <div className="border-b border-border bg-secondary px-3 py-2">
                  <p className="font-mono text-xs text-foreground/55">{item.label}</p>
                </div>
                <pre className="overflow-x-auto bg-foreground px-3 py-3 font-mono text-xs leading-relaxed text-white/85">
                  <code>{item.text}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">What you can ask Stud</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/75">
            Strong prompts combine intent, constraints, and expected output. These examples are a solid starting point
            for common workflows.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {prompts.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-xl border border-border bg-white p-5">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${item.accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>

                <ul className="mt-4 space-y-2.5">
                  {item.list.map((line) => (
                    <li
                      key={line}
                      className="rounded-md border border-border bg-secondary/70 px-3 py-2 font-mono text-xs leading-relaxed text-foreground/70"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-5 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border bg-white p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                <span className="inline-flex items-start gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-foreground/30 transition-colors group-open:bg-foreground/65" />
                  {item.q}
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-foreground p-7 text-white md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to build with Stud?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
          Start with the setup guide, then move into tools and Roblox integration. Keep this page bookmarked as your
          docs command center.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/90"
          >
            Open setup guide
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/roblox"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Explore Roblox docs
            <Gamepad2 className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
