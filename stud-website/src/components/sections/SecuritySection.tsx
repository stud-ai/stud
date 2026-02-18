"use client"

import { AlertTriangle, Eye, Lock, Settings, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type FeatureKey = "granular" | "transparency" | "deny" | "policies"

const CYCLE_MS = 7000
const TICK_MS = 30

const features = [
  {
    key: "granular" as FeatureKey,
    icon: Lock,
    title: "Granular Permissions",
    description:
      "Approve individual actions or grant session-wide access per tool type.",
  },
  {
    key: "transparency" as FeatureKey,
    icon: Eye,
    title: "Full Transparency",
    description:
      "See exactly what Stud will do before any action is taken, including full diffs.",
  },
  {
    key: "deny" as FeatureKey,
    icon: AlertTriangle,
    title: "Deny by Default",
    description:
      "Sensitive operations like file writes and bash commands require explicit approval.",
  },
  {
    key: "policies" as FeatureKey,
    icon: Settings,
    title: "Configurable Policies",
    description:
      "Set up permission rules and agent configurations that match your workflow.",
  },
]

const featureKeys = features.map((f) => f.key)

const demoVariants = {
  initial: { opacity: 0, filter: "blur(8px)", y: 12, scale: 0.97 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 },
  exit: { opacity: 0, filter: "blur(5px)", y: -8, scale: 0.98 },
}

function GranularDemo() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const options = ["Allow once", "Allow always", "Reject"]

  return (
    <div className="rounded-lg border-l-[3px] border-l-[#d29922] border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#d29922] text-sm">△</span>
        <span className="text-foreground text-xs font-semibold">
          Edit src/server/PlayerData.lua
        </span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 mb-3 overflow-hidden">
        <div className="font-mono text-[12px]">
          <div className="flex">
            <div className="w-8 text-right pr-2 py-1 text-muted-foreground/40 select-none bg-muted/20 text-[11px]">12</div>
            <div className="px-2.5 py-1 text-foreground/60">local Players = game:GetService(&quot;Players&quot;)</div>
          </div>
          <div className="flex bg-emerald-500/8">
            <div className="w-8 text-right pr-2 py-1 text-emerald-600/50 select-none bg-emerald-500/8 text-[11px]">13</div>
            <div className="px-2.5 py-1 text-emerald-700/80">+ local DataStoreService =</div>
          </div>
          <div className="flex bg-emerald-500/8">
            <div className="w-8 text-right pr-2 py-1 text-emerald-600/50 select-none bg-emerald-500/8 text-[11px]"></div>
            <div className="px-2.5 py-1 text-emerald-700/80 pl-7">game:GetService(&quot;DataStoreService&quot;)</div>
          </div>
          <div className="flex">
            <div className="w-8 text-right pr-2 py-1 text-muted-foreground/40 select-none bg-muted/20 text-[11px]">14</div>
            <div className="px-2.5 py-1 text-foreground/60">local function onPlayerAdded(player)</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {options.map((opt, i) => {
          const isActive = selected === i || hovered === i
          return (
            <button
              key={opt}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${isActive
                  ? "bg-[#d29922] text-white shadow-sm"
                  : "bg-secondary border border-border text-foreground/70 hover:bg-muted"
                }`}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {opt}
            </button>
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/40 font-mono">
        <span>⇆ select</span>
        <span>↵ confirm</span>
      </div>
    </div>
  )
}

function TransparencyDemo() {
  const rows = [
    { icon: "→", text: "Read src/server/PlayerData.lua", result: "847 lines", warn: false },
    { icon: "→", text: "Read src/shared/Config.lua", result: "124 lines", warn: false },
    { icon: "△", text: "Write src/server/DataManager.lua", result: "awaiting", warn: true },
    { icon: "~", text: "Waiting for approval...", result: null, warn: false },
  ]
  return (
    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Eye className="h-3.5 w-3.5 text-foreground/40" />
        <span className="text-foreground text-xs font-semibold">Action Preview</span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 font-mono text-[13px]">
        {rows.map((row, i) => (
          <div key={row.text} className={`flex items-center justify-between px-3 py-2.5 ${i < rows.length - 1 ? "border-b border-border/60" : ""} ${row.warn ? "bg-[#d29922]/6" : ""}`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className={row.warn ? "text-[#d29922]" : "text-foreground/40"}>{row.icon}</span>
              <span className={`truncate ${row.warn ? "text-[#d29922]" : row.result ? "text-foreground/70" : "text-muted-foreground/50"}`}>{row.text}</span>
            </div>
            {row.result ? (
              <span className={`ml-2 shrink-0 text-[11px] ${row.warn ? "text-[#d29922]" : "text-muted-foreground/50"}`}>{row.result}</span>
            ) : (
              <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DenyDemo() {
  return (
    <div className="rounded-lg border-l-[3px] border-l-rose-500 border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-rose-500 font-mono text-sm font-bold">{">_"}</span>
        <span className="text-foreground text-xs font-semibold">
          Bash: rm -rf node_modules/
        </span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 mb-3 p-3 font-mono text-[12px]">
        <div className="flex items-center gap-2 text-rose-500 mb-2">
          <span>△</span>
          <span className="font-medium">This command will delete files</span>
        </div>
        <div className="text-foreground/50 space-y-0.5">
          <div>Target: ./node_modules/</div>
          <div>Files: ~2,847 items</div>
          <div>Size: 312 MB</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary border border-border text-foreground/70 hover:bg-muted cursor-pointer transition-colors">
          Allow once
        </button>
        <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-rose-500 text-white cursor-pointer shadow-sm hover:bg-rose-600 transition-colors">
          Reject
        </button>
      </div>
      <div className="mt-3 text-[11px] text-rose-500/70 font-medium">
        Destructive commands are blocked by default
      </div>
    </div>
  )
}

function PoliciesDemo() {
  const rules = [
    { icon: "✓", label: "Read files", status: "always allow", color: "text-emerald-600", bg: "" },
    { icon: "✓", label: "Glob & Grep", status: "always allow", color: "text-emerald-600", bg: "" },
    { icon: "△", label: "Write files", status: "ask each time", color: "text-[#d29922]", bg: "" },
    { icon: "△", label: "Bash commands", status: "ask each time", color: "text-[#d29922]", bg: "" },
    { icon: "✕", label: "Destructive ops", status: "always deny", color: "text-rose-500", bg: "" },
  ]
  return (
    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="h-3.5 w-3.5 text-foreground/40" />
        <span className="text-foreground text-xs font-semibold">Permission Rules</span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 font-mono text-[12px]">
        {rules.map((rule, i) => (
          <div key={rule.label} className={`flex items-center justify-between px-3 py-2.5 ${i < rules.length - 1 ? "border-b border-border/60" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={rule.color}>{rule.icon}</span>
              <span className="text-foreground/70">{rule.label}</span>
            </div>
            <span className={`text-[11px] ${rule.color}`}>{rule.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const demoComponents: Record<FeatureKey, () => React.JSX.Element> = {
  granular: GranularDemo,
  transparency: TransparencyDemo,
  deny: DenyDemo,
  policies: PoliciesDemo,
}

export default function SecuritySection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("granular")
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const u = (window as any).UnicornStudio
    if (u && u.init) u.init()
  }, [])

  const advanceFeature = useCallback(() => {
    const idx = featureKeys.indexOf(activeFeature)
    const next = (idx + 1) % featureKeys.length
    setActiveFeature(featureKeys[next])
    setProgress(0)
  }, [activeFeature])

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_MS / CYCLE_MS) * 100
        if (next >= 100) {
          advanceFeature()
          return 0
        }
        return next
      })
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [paused, advanceFeature])

  const handleClick = (key: FeatureKey) => {
    setActiveFeature(key)
    setProgress(0)
  }

  const DemoComponent = demoComponents[activeFeature]

  return (
    <div
      className="bg-tertiary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
        {/* Centered heading */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
            You&apos;re always in control
          </h2>
          <p className="text-muted-foreground mt-3 mx-auto max-w-2xl text-sm leading-relaxed md:text-base">
            A robust permission system ensures Stud only takes actions you approve.
          </p>
        </div>

        {/* Centered demo panel */}
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img src="/assets/redwoods-dark.png" alt="Redwood forest background" className="h-full w-full object-cover" />
              </div>
              <div className="relative flex h-full w-full items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    variants={demoVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-[85%] md:w-[70%] lg:w-[60%]"
                  >
                    <DemoComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon
            const isActive = activeFeature === feature.key
            return (
              <button
                key={feature.key}
                onClick={() => handleClick(feature.key)}
                className={`relative group rounded-xl p-5 text-left transition-all duration-200 overflow-hidden cursor-pointer ${isActive
                    ? "bg-white border border-border shadow-sm"
                    : "bg-white/50 border border-transparent hover:bg-white/80 hover:border-border/50"
                  }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-3 transition-colors ${isActive ? "bg-foreground/[0.06]" : "bg-foreground/[0.03]"
                  }`}>
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground"}`} />
                </div>
                <div className={`text-sm font-semibold transition-colors ${isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground/90"}`}>
                  {feature.title}
                </div>
                <div className={`text-[13px] leading-relaxed mt-1 transition-colors ${isActive ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                  {feature.description}
                </div>
                {/* Progress bar at bottom */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/50">
                    <motion.div
                      className="h-full bg-foreground/20"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.05, ease: "linear" }}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* CTA link centered */}
        <div className="mt-8 text-center">
          <a
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
            href="/docs/permissions"
          >
            Learn about permissions
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>
    </div>
  )
}
