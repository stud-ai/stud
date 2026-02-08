"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Terminal,
  Blocks,
  Wrench,
  Shield,
  Github,
  User,
} from "lucide-react"

type FeatureKey = "assistant" | "roblox" | "tools" | "permissions" | "opensource"

interface Feature {
  key: FeatureKey
  icon: typeof Terminal
  title: string
  subtitle?: string
  description: string
  accentColor: string
  accentBg: string
  accentBorder: string
  accentBar: string
}

const CYCLE_MS = 6000
const TICK_MS = 30

const features: Feature[] = [
  {
    key: "assistant",
    icon: Terminal,
    title: "AI Assistant",
    description:
      "Natural language coding powered by AI. Describe what you want and Stud writes production-ready Luau code directly in your terminal.",
    accentColor: "text-emerald-600",
    accentBg: "bg-emerald-500/8",
    accentBorder: "border-emerald-500/25",
    accentBar: "bg-emerald-500",
  },
  {
    key: "roblox",
    icon: Blocks,
    title: "Roblox Studio",
    description:
      "27+ specialized tools for deep Roblox Studio integration. Edit scripts, manipulate instances, query DataStores, and search the Toolbox.",
    accentColor: "text-violet-600",
    accentBg: "bg-violet-500/8",
    accentBorder: "border-violet-500/25",
    accentBar: "bg-violet-500",
  },
  {
    key: "tools",
    icon: Wrench,
    title: "Smart Tools",
    description:
      "Read, write, edit, search, and execute with intelligent context awareness. Every tool understands your codebase structure.",
    accentColor: "text-amber-600",
    accentBg: "bg-amber-500/8",
    accentBorder: "border-amber-500/25",
    accentBar: "bg-amber-500",
  },
  {
    key: "permissions",
    icon: Shield,
    title: "Permission System",
    description:
      "Granular, transparent permission controls for every action. You decide what Stud can read, write, and execute.",
    accentColor: "text-blue-600",
    accentBg: "bg-blue-500/8",
    accentBorder: "border-blue-500/25",
    accentBar: "bg-blue-500",
  },
  {
    key: "opensource",
    icon: Github,
    title: "Open Source",
    subtitle: "Community Driven",
    description:
      "Fully open source and community-driven. Inspect every line, contribute features, and build extensions. No vendor lock-in.",
    accentColor: "text-rose-600",
    accentBg: "bg-rose-500/8",
    accentBorder: "border-rose-500/25",
    accentBar: "bg-rose-500",
  },
]

const featureKeys = features.map((f) => f.key)

function AssistantDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground/60">
          <User className="h-3.5 w-3.5" />
        </div>
        <div className="rounded-lg rounded-tl-sm bg-secondary/80 px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
          Add a health bar GUI to the player
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
          <img src="/assets/logo_transparent_bg.png" alt="" className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="rounded-lg rounded-tl-sm bg-secondary/50 px-3.5 py-2.5">
            <p className="text-sm leading-relaxed text-foreground/70">
              I&apos;ll create a health bar UI. Let me set up the files...
            </p>
            <div className="mt-3 space-y-1.5 font-mono text-[13px]">
              <div className="flex items-center gap-2.5 text-emerald-600">
                <span>&#10003;</span>
                <span className="text-muted-foreground/50">Created</span>
                <span className="text-foreground/70">StarterGui/HealthBar.lua</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600">
                <span>&#10003;</span>
                <span className="text-muted-foreground/50">Edited</span>
                <span className="text-foreground/70">PlayerSetup.lua</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-600">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                <span className="text-muted-foreground/50">Syncing to Studio...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RobloxDemo() {
  const [hovered, setHovered] = useState<string | null>(null)
  const tools = [
    { icon: "\ud83d\udcdc", name: "Scripts", count: "8", items: "Read, Write, Create, Delete" },
    { icon: "\ud83e\uddf1", name: "Instances", count: "7", items: "Get, Set, Create, Move" },
    { icon: "\ud83d\udcbe", name: "DataStore", count: "6", items: "Get, Set, List, Remove" },
    { icon: "\ud83d\udd0d", name: "Toolbox", count: "4", items: "Search, Insert, Info" },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Connected Tools</span>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-600">27+</span>
      </div>
      <div className="space-y-1.5">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 cursor-pointer ${
              hovered === tool.name ? "bg-secondary scale-[1.01]" : "bg-secondary/30"
            }`}
            onMouseEnter={() => setHovered(tool.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="text-lg">{tool.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/80">{tool.name}</span>
                <span className="text-[11px] text-muted-foreground/40">{tool.count} tools</span>
              </div>
              <span className="text-[11px] text-muted-foreground/40">{tool.items}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-t border-border/60 pt-2.5">
        <div className="flex items-center gap-2.5 text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground/50">Edited</span>
          <span className="text-foreground/60 font-mono">&quot;ServerScriptService.Main&quot;</span>
        </div>
        <div className="flex items-center gap-2.5 text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground/50">Created</span>
          <span className="text-foreground/60 font-mono">&quot;ReplicatedStorage.Config&quot;</span>
        </div>
      </div>
    </div>
  )
}

function ToolsDemo() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const rows = [
    { icon: "\u2192", tool: "Read", file: "src/server/Main.lua", result: "847 lines", done: true },
    { icon: "\u2190", tool: "Write", file: "src/shared/Config.lua", result: "+124 lines", done: true },
    { icon: "\u270e", tool: "Edit", file: "src/server/PlayerData.lua", result: "+18 \u22124", done: true },
    { icon: "\u2731", tool: "Glob", file: "**/*.lua", result: "47 files", done: true },
    { icon: "\u2315", tool: "Grep", file: "\"PlayerData\"", result: "23 matches", done: true },
    { icon: "$", tool: "Bash", file: "rojo build -o game.rbxl", result: "", done: false },
  ]

  return (
    <div className="rounded-md border border-border bg-secondary/50 font-mono text-[13px]">
      {rows.map((row, i) => (
        <div
          key={row.tool}
          className={`flex items-center justify-between px-3.5 py-2.5 transition-all duration-150 cursor-default ${
            i < rows.length - 1 ? "border-b border-border/60" : ""
          } ${hoveredIdx === i ? "bg-secondary/80" : ""}`}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-amber-600/70 w-3.5 text-center">{row.icon}</span>
            <span className="text-foreground/40 w-11 shrink-0">{row.tool}</span>
            <span className="text-foreground/70 truncate">{row.file}</span>
          </div>
          {row.done ? (
            <span className="ml-3 shrink-0 text-[11px] text-muted-foreground/50">{row.result}</span>
          ) : (
            <span className="ml-3 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
          )}
        </div>
      ))}
    </div>
  )
}

function PermissionsDemo() {
  const [hoveredRule, setHoveredRule] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState(0)

  const rules = [
    { icon: "\u2713", label: "Read files", status: "Always", color: "bg-emerald-500", textColor: "text-emerald-600" },
    { icon: "\u2713", label: "Glob & Grep", status: "Always", color: "bg-emerald-500", textColor: "text-emerald-600" },
    { icon: "\u25B3", label: "Write files", status: "Ask", color: "bg-blue-500", textColor: "text-blue-600" },
    { icon: "\u25B3", label: "Bash commands", status: "Ask", color: "bg-amber-500", textColor: "text-amber-600" },
    { icon: "\u2715", label: "Destructive ops", status: "Deny", color: "bg-rose-500", textColor: "text-rose-500" },
  ]

  const actions = ["Allow once", "Allow always", "Deny"]

  return (
    <div className="space-y-3">
      {/* Policy overview */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Permission Policy</span>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">Active</span>
      </div>
      <div className="space-y-0.5">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`flex items-center justify-between rounded-md px-3 py-2 transition-all duration-150 cursor-default ${
              hoveredRule === rule.label ? "bg-secondary/80" : ""
            }`}
            onMouseEnter={() => setHoveredRule(rule.label)}
            onMouseLeave={() => setHoveredRule(null)}
          >
            <div className="flex items-center gap-2.5">
              <div className={`h-2 w-2 rounded-full ${rule.color}`} />
              <span className="text-sm text-foreground/60">{rule.label}</span>
            </div>
            <span className={`text-[11px] font-medium ${rule.textColor}`}>{rule.status}</span>
          </div>
        ))}
      </div>

      {/* Active request */}
      <div className="border-t border-border/60 pt-3">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[12px] font-medium text-blue-600">Write Request</span>
          </div>
          <p className="font-mono text-[12px] text-muted-foreground/50 mb-3">src/server/PlayerData.lua</p>
          <div className="flex gap-2">
            {actions.map((action, i) => (
              <button
                key={action}
                onClick={() => setSelectedAction(i)}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                  selectedAction === i
                    ? i === 2 ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                    : "bg-secondary/50 text-muted-foreground/50 hover:bg-secondary"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function OpenSourceDemo() {
  const contributors = ["SG", "AR", "JL", "TK", "MN"]
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <img src="/assets/logo_transparent_bg.png" alt="" className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">stud-dev/stud</div>
          <div className="text-[12px] text-muted-foreground/50">Open Source AI for Roblox</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[12px] text-muted-foreground/50">
        <span>MIT License</span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          Stars
        </span>
        <span>TypeScript</span>
      </div>
      <div className="border-t border-border/60 pt-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Contributors</span>
        <div className="mt-2 flex items-center -space-x-1.5">
          {contributors.map((c) => (
            <div key={c} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-secondary text-[10px] font-bold text-foreground/60 transition-transform hover:scale-110 hover:z-10 cursor-pointer">{c}</div>
          ))}
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-secondary text-[9px] text-muted-foreground/40">+12</div>
        </div>
      </div>
      <div className="border-t border-border/60 pt-3 space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Releases</span>
        {[
          { v: "v1.2.0", label: "DataStore tools" },
          { v: "v1.1.0", label: "Subagent system" },
          { v: "v1.0.0", label: "Initial release" },
        ].map((r) => (
          <div key={r.v} className="flex items-center gap-2.5 text-[12px]">
            <span className="text-rose-500">&#10003;</span>
            <span className="font-mono text-foreground/50">{r.v}</span>
            <span className="text-muted-foreground/40">&mdash; {r.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const demoComponents: Record<FeatureKey, () => React.JSX.Element> = {
  assistant: AssistantDemo,
  roblox: RobloxDemo,
  tools: ToolsDemo,
  permissions: PermissionsDemo,
  opensource: OpenSourceDemo,
}

const windowTitles: Record<FeatureKey, string> = {
  assistant: "Stud Terminal",
  roblox: "Studio Tools",
  tools: "Tool Output",
  permissions: "Permissions",
  opensource: "Community",
}

// Blur + fade + slide animation variants
const previewVariants = {
  initial: { opacity: 0, filter: "blur(10px)", scale: 0.97, y: 16 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
  exit: { opacity: 0, filter: "blur(6px)", scale: 0.98, y: -10 },
}

const textVariants = {
  initial: { opacity: 0, filter: "blur(6px)", y: 8 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  exit: { opacity: 0, filter: "blur(4px)", y: -6 },
}

export default function FeaturesSection() {
  const [active, setActive] = useState<FeatureKey>("assistant")
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = features.find((f) => f.key === active)!
  const DemoComponent = demoComponents[active]
  const unicornRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advanceFeature = useCallback(() => {
    const currentIdx = featureKeys.indexOf(active)
    const nextIdx = (currentIdx + 1) % featureKeys.length
    setActive(featureKeys[nextIdx])
    setProgress(0)
  }, [active])

  // Auto-cycle timer
  useEffect(() => {
    if (paused) return

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_MS / CYCLE_MS) * 100
        if (next >= 100) {
          advanceFeature()
          return 0
        }
        return next
      })
    }, TICK_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, advanceFeature])

  const handleFeatureClick = (key: FeatureKey) => {
    setActive(key)
    setProgress(0)
  }

  useEffect(() => {
    const initUnicorn = () => {
      const u = (window as any).UnicornStudio
      if (u && u.init) {
        u.init()
      }
    }

    if ((window as any).UnicornStudio?.isInitialized !== undefined) {
      initUnicorn()
    } else {
      ;(window as any).UnicornStudio = { isInitialized: false }
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
      script.onload = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            ;(window as any).UnicornStudio.init()
          })
        } else {
          ;(window as any).UnicornStudio.init()
        }
      }
      ;(document.head || document.body).appendChild(script)
    }
  }, [])

  return (
    <section className="py-20 lg:py-28">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 mb-10">
        <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
          Everything you need,{" "}
          <br className="hidden sm:block" />
          nothing you don&apos;t.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed md:text-base">
          A complete toolkit for Roblox development. Every feature is free and open source.
        </p>
      </div>

      {/* Feature showcase card */}
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left sidebar - light */}
            <div className="w-full border-b border-border bg-secondary/50 p-5 lg:w-[280px] lg:border-b-0 lg:border-r lg:p-6">
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                Features
              </h3>
              <nav className="flex flex-wrap gap-1 pb-2 lg:flex-col lg:gap-0.5 lg:pb-0">
                {features.map((feature) => {
                  const Icon = feature.icon
                  const isActive = active === feature.key
                  return (
                    <button
                      key={feature.key}
                      onClick={() => handleFeatureClick(feature.key)}
                      className={`group relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all duration-200 overflow-hidden ${
                        isActive
                          ? `${feature.accentBg} ${feature.accentBorder} border`
                          : "border border-transparent hover:bg-muted/50"
                      }`}
                    >
                      <Icon
                        className={`h-[16px] w-[16px] shrink-0 transition-colors ${
                          isActive ? feature.accentColor : "text-muted-foreground/50 group-hover:text-muted-foreground"
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[13px] font-medium whitespace-nowrap transition-colors ${
                            isActive ? "text-foreground" : "text-foreground/60 group-hover:text-foreground/80"
                          }`}
                        >
                          {feature.title}
                        </span>
                        {feature.subtitle && (
                          <span className="hidden text-[10px] text-muted-foreground/50 lg:inline">{feature.subtitle}</span>
                        )}
                      </div>
                      {/* Progress bar */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/5">
                          <motion.div
                            className={`h-full ${feature.accentBar} opacity-40`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.05, ease: "linear" }}
                          />
                        </div>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Right content */}
            <div className="flex flex-1 flex-col min-h-[420px] lg:min-h-[520px]">
              {/* Preview area with Unicorn Studio background */}
              <div className="relative flex-1 overflow-hidden">
                {/* Unicorn Studio animated background */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                  <div
                    ref={unicornRef}
                    data-us-project="cGcmyYCBaX00HUG4UFac"
                    style={{ width: "100%", height: "100%", transform: "scale(1.6)", transformOrigin: "center center" }}
                  />
                </div>

                {/* Floating light window */}
                <div className="relative z-10 flex h-full items-center justify-center p-5 lg:p-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      variants={previewVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="w-full max-w-md"
                    >
                      <div className="rounded-lg border border-border/80 bg-white/95 p-5 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2.5 mb-4">
                          <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-4.5 w-4.5" />
                          <span className="text-foreground text-sm font-semibold">{windowTitles[active]}</span>
                        </div>
                        <DemoComponent />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Description area - light */}
              <div className="border-t border-border bg-secondary/30 px-5 py-5 lg:px-8 lg:py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg tracking-tight text-foreground lg:text-xl">
                        {current.title}
                      </h3>
                      <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Free
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted-foreground lg:text-sm">
                      {current.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
