"use client"

import {
  FileText,
  Layers,
  Search,
  Terminal,
  ChevronRight,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type FeatureKey = "readwrite" | "globgrep" | "bash" | "subagent"

const CYCLE_MS = 7000
const TICK_MS = 30

const features = [
  {
    key: "readwrite" as FeatureKey,
    icon: FileText,
    title: "Read & Write",
    description:
      "Read any file, write new code, and make precise edits with full context awareness.",
  },
  {
    key: "globgrep" as FeatureKey,
    icon: Search,
    title: "Glob & Grep",
    description:
      "Find files by pattern and search content across your entire codebase instantly.",
  },
  {
    key: "bash" as FeatureKey,
    icon: Terminal,
    title: "Bash Execution",
    description:
      "Run any shell command with intelligent output handling and permission controls.",
  },
  {
    key: "subagent" as FeatureKey,
    icon: Layers,
    title: "Subagent Delegation",
    description:
      "Spawn background agents for parallel tasks and complex workflows.",
  },
]

const featureKeys = features.map((f) => f.key)

const demos: Record<
  FeatureKey,
  { rows: Array<{ icon: string; text: string; pending: string; status: string; result: string | null }> }
> = {
  readwrite: {
    rows: [
      { icon: "→", text: "Read src/server/PlayerData.lua", pending: "Reading file...", status: "done", result: "847 lines" },
      { icon: "→", text: "Read src/shared/Config.lua", pending: "Reading file...", status: "done", result: "124 lines" },
      { icon: "←", text: "Write src/server/DataManager.lua", pending: "Writing file...", status: "done", result: "256 lines" },
      { icon: "←", text: "Edit src/server/PlayerData.lua", pending: "Editing file...", status: "pending", result: null },
    ],
  },
  globgrep: {
    rows: [
      { icon: "✱", text: 'Glob "**/*.lua"', pending: "Finding files...", status: "done", result: "47 files" },
      { icon: "✱", text: 'Grep "PlayerData"', pending: "Searching...", status: "done", result: "23 matches" },
      { icon: "✱", text: 'Glob "src/server/**/*.lua"', pending: "Finding files...", status: "done", result: "12 files" },
      { icon: "✱", text: 'Grep "function.*Player"', pending: "Searching...", status: "pending", result: null },
    ],
  },
  bash: {
    rows: [
      { icon: "$", text: "rojo build -o game.rbxl", pending: "Running...", status: "done", result: "exit 0" },
      { icon: "$", text: "selene src/", pending: "Running linter...", status: "done", result: "0 warnings" },
      { icon: "$", text: "npm run build", pending: "Building...", status: "done", result: "exit 0" },
      { icon: "$", text: "git status", pending: "Running...", status: "pending", result: null },
    ],
  },
  subagent: {
    rows: [
      { icon: "◉", text: 'Explore Task "find auth code"', pending: "Delegating...", status: "done", result: "3 files" },
      { icon: "◉", text: 'Plan Task "refactor system"', pending: "Planning...", status: "done", result: "8 steps" },
      { icon: "◉", text: 'Bash Task "run tests"', pending: "Executing...", status: "done", result: "passed" },
      { icon: "◉", text: 'Explore Task "find usages"', pending: "Delegating...", status: "pending", result: null },
    ],
  },
}

const demoVariants = {
  initial: { opacity: 0, filter: "blur(8px)", y: 12, scale: 0.97 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 },
  exit: { opacity: 0, filter: "blur(5px)", y: -8, scale: 0.98 },
}

export default function SupportSection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("readwrite")
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

  const currentDemo = demos[activeFeature]
  const activeFeatureData = features.find((f) => f.key === activeFeature)!

  return (
    <div
      id="first-product-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
        <div className="mb-10">
          <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
            Powerful tools at your fingertips
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
            Read, write, edit, and search your codebase with natural language.
            Execute commands and delegate complex tasks to subagents.
          </p>
        </div>

        {/* Horizontal tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {features.map((feature) => {
            const Icon = feature.icon
            const isActive = activeFeature === feature.key
            return (
              <button
                key={feature.key}
                onClick={() => handleClick(feature.key)}
                className="relative flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="support-tab-highlight"
                    className="absolute inset-0 rounded-lg bg-foreground shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`relative z-10 h-3.5 w-3.5 transition-colors duration-200 ${isActive ? "text-white" : "text-foreground/50"}`} />
                <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white" : "text-foreground/50 hover:text-foreground/80"}`}>{feature.title}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 h-[2px] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white/30"
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

        {/* Full-width demo panel */}
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                data-us-project="cGcmyYCBaX00HUG4UFac"
                style={{ width: "100%", height: "100%", transform: "scale(1.6)", transformOrigin: "center center" }}
              />
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
                  className="w-[88%] sm:w-[70%] md:w-[55%] lg:w-[45%]"
                >
                  <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-4 w-4" />
                        <span className="text-foreground text-xs font-semibold">Stud</span>
                      </div>
                      <span className="text-muted-foreground/60 text-[11px] font-mono">
                        2.1k tokens · $0.02
                      </span>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/50 font-mono text-[13px]">
                      {currentDemo.rows.map((row, i) => (
                        <div
                          key={row.text}
                          className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                            i < currentDemo.rows.length - 1 ? "border-b border-border/60" : ""
                          }`}
                        >
                          <div className="mr-2 flex min-w-0 flex-1 items-center gap-2">
                            {row.status === "pending" ? (
                              <>
                                <span className="text-muted-foreground/50">~</span>
                                <span className="text-muted-foreground/50">{row.pending}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-foreground/40">{row.icon}</span>
                                <span className="text-foreground/70 truncate">{row.text}</span>
                              </>
                            )}
                          </div>
                          {row.status === "done" && (
                            <span className="ml-2 flex-shrink-0 text-[11px] text-muted-foreground/50">
                              {row.result}
                            </span>
                          )}
                          {row.status === "pending" && (
                            <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active feature description + CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="max-w-lg"
            >
              <div className="text-sm font-semibold text-foreground">{activeFeatureData.title}</div>
              <div className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">{activeFeatureData.description}</div>
            </motion.div>
          </AnimatePresence>
          <a
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group shrink-0"
            href="/docs/tools"
          >
            Explore all tools
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>
    </div>
  )
}
