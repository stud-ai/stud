"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Blocks, Wrench, Shield, Github } from "lucide-react"

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

const clipMap: Record<FeatureKey, string> = {
  assistant: "/assets/feature-clips/assistant.mp4",
  roblox: "/assets/feature-clips/roblox.mp4",
  tools: "/assets/feature-clips/tools.mp4",
  permissions: "/assets/feature-clips/permissions.mp4",
  opensource: "/assets/feature-clips/opensource.mp4",
}

function FeatureVideo({ feature }: { feature: FeatureKey }) {
  const src = clipMap[feature]
  return (
    <div className="overflow-hidden rounded-md border border-border bg-secondary/50">
      <div className="relative aspect-[16/10] w-full">
        <video
          key={src}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  )
}

const demoComponents: Record<FeatureKey, () => React.JSX.Element> = {
  assistant: () => <FeatureVideo feature="assistant" />,
  roblox: () => <FeatureVideo feature="roblox" />,
  tools: () => <FeatureVideo feature="tools" />,
  permissions: () => <FeatureVideo feature="permissions" />,
  opensource: () => <FeatureVideo feature="opensource" />,
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
          Everything you need, <br className="hidden sm:block" />
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
                          <span className="hidden text-[10px] text-muted-foreground/50 lg:inline">
                            {feature.subtitle}
                          </span>
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
            <motion.div
              layout
              transition={{ layout: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
              className="flex flex-1 flex-col min-h-[420px] lg:min-h-[520px]"
            >
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
                  <motion.div className="w-full max-w-[980px]">
                    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:p-5">
                      <div className="mb-4 flex items-center gap-2.5">
                        <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-4.5 w-4.5" />
                        <span className="text-foreground text-sm font-semibold">{windowTitles[active]}</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          variants={previewVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          <DemoComponent />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Description area - light */}
              <motion.div
                layout
                transition={{ layout: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
                className="border-t border-border bg-secondary/30 px-5 py-5 lg:px-8 lg:py-6"
              >
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
