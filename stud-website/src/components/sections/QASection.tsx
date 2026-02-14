"use client"

import { Box, Code, Database, Search, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type FeatureKey = "scripts" | "instances" | "datastore" | "toolbox"

const features = [
  {
    key: "scripts" as FeatureKey,
    icon: Code,
    title: "Script Editing",
    description: "Read, write, and edit Luau scripts directly in Roblox Studio instances.",
  },
  {
    key: "instances" as FeatureKey,
    icon: Box,
    title: "Instance Manipulation",
    description: "Create, move, delete, and modify any instance in the game hierarchy.",
  },
  {
    key: "datastore" as FeatureKey,
    icon: Database,
    title: "DataStore Access",
    description: "Query and update DataStores for testing and debugging player data.",
  },
  {
    key: "toolbox" as FeatureKey,
    icon: Search,
    title: "Toolbox Search",
    description: "Find and insert models, plugins, and assets from the Roblox Toolbox.",
  },
]

const toolboxAssets = [
  {
    id: 90405905565781,
    name: "Medieval Village Pack",
    type: "Model",
    creator: "BuildCraft",
    verified: true,
    thumbnail: "https://tr.rbxcdn.com/180DAY-118b27b7f6a9283190692ac5aa42061d/150/150/Model/Png/noFilter",
  },
  {
    id: 7021878884,
    name: "Villager House",
    type: "Model",
    creator: "BlockBuilder",
    verified: true,
    thumbnail: "https://tr.rbxcdn.com/180DAY-473a5ba01300471878be2aeadb136d9f/150/150/Model/Png/noFilter",
  },
  {
    id: 169765254,
    name: "Village Town Center",
    type: "Model",
    creator: "MapMakers",
    verified: true,
    thumbnail: "https://tr.rbxcdn.com/180DAY-d3e27699e4739b9d61f078b1e56a14c1/150/150/Model/Png/noFilter",
  },
  {
    id: 8915687805,
    name: "Fantasy Village Kit",
    type: "Model",
    creator: "RPGAssets",
    verified: false,
    thumbnail: "https://tr.rbxcdn.com/180DAY-5d483f6e8430377c9f9eae7b480c9470/150/150/Model/Png/noFilter",
  },
  {
    id: 15485395576,
    name: "Village Market Stall",
    type: "Model",
    creator: "DetailProps",
    verified: true,
    thumbnail: "https://tr.rbxcdn.com/180DAY-87cda8fd7a2b104f021950cc8e170510/150/150/Model/Png/noFilter",
  },
]

const demoVariants = {
  initial: { opacity: 0, filter: "blur(8px)", y: 12, scale: 0.97 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 },
  exit: { opacity: 0, filter: "blur(5px)", y: -8, scale: 0.98 },
}

function ScriptsDemo() {
  const rows = [
    { icon: "→", text: 'Get Script "ServerScriptService.Main"', result: "847 lines" },
    { icon: "→", text: 'Edit Script "ReplicatedStorage.Config"', result: "+18 -4" },
    { icon: "→", text: 'Create Script "Workspace.NewHandler"', result: "created" },
    { icon: "~", text: "Editing script...", result: null },
  ]
  return (
    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Code className="h-3.5 w-3.5 text-foreground/40" />
        <span className="text-foreground text-xs font-semibold">Script Editor</span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 font-mono text-[13px]">
        {rows.map((row, i) => (
          <div
            key={row.text}
            className={`flex items-center justify-between px-3 py-2.5 ${i < rows.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-foreground/40">{row.icon}</span>
              <span className={`truncate ${row.result ? "text-foreground/70" : "text-muted-foreground/50"}`}>
                {row.text}
              </span>
            </div>
            {row.result ? (
              <span className="ml-2 shrink-0 text-[11px] text-muted-foreground/50">{row.result}</span>
            ) : (
              <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function InstancesDemo() {
  const rows = [
    { icon: "◆", text: 'Get Children "game.Workspace"', result: "47 instances" },
    { icon: "◆", text: "Create Part in Workspace", result: "created" },
    { icon: "◆", text: 'Set Property "Part.Color"', result: "updated" },
    { icon: "~", text: "Cloning instance...", result: null },
  ]
  return (
    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Box className="h-3.5 w-3.5 text-foreground/40" />
        <span className="text-foreground text-xs font-semibold">Instance Tools</span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 font-mono text-[13px]">
        {rows.map((row, i) => (
          <div
            key={row.text}
            className={`flex items-center justify-between px-3 py-2.5 ${i < rows.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-foreground/40">{row.icon}</span>
              <span className={`truncate ${row.result ? "text-foreground/70" : "text-muted-foreground/50"}`}>
                {row.text}
              </span>
            </div>
            {row.result ? (
              <span className="ml-2 shrink-0 text-[11px] text-muted-foreground/50">{row.result}</span>
            ) : (
              <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DataStoreDemo() {
  const rows = [
    { icon: "☁", text: 'Get DataStore "PlayerData"', result: "connected" },
    { icon: "☁", text: 'Get Key "user_12345"', result: "retrieved" },
    { icon: "☁", text: 'Update Key "user_12345.coins"', result: "saved" },
    { icon: "~", text: "Listing keys...", result: null },
  ]
  return (
    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-3.5 w-3.5 text-foreground/40" />
        <span className="text-foreground text-xs font-semibold">DataStore Operations</span>
      </div>
      <div className="rounded-md border border-border bg-secondary/50 font-mono text-[13px]">
        {rows.map((row, i) => (
          <div
            key={row.text}
            className={`flex items-center justify-between px-3 py-2.5 ${i < rows.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-foreground/40">{row.icon}</span>
              <span className={`truncate ${row.result ? "text-foreground/70" : "text-muted-foreground/50"}`}>
                {row.text}
              </span>
            </div>
            {row.result ? (
              <span className="ml-2 shrink-0 text-[11px] text-muted-foreground/50">{row.result}</span>
            ) : (
              <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ToolboxDemo() {
  const [selectedAsset, setSelectedAsset] = useState(90405905565781)
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null)

  return (
    <div className="rounded-lg border border-border/80 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground text-xs font-semibold">Search Toolbox</span>
        <span className="text-muted-foreground/40 text-[10px] font-mono">esc</span>
      </div>
      <div className="mb-3">
        <div className="border border-border bg-secondary/50 rounded-md px-3 py-2 text-[13px] text-foreground font-mono">
          village<span className="animate-pulse text-foreground/30">|</span>
        </div>
      </div>
      <div className="space-y-0.5">
        {toolboxAssets.map((asset) => {
          const isActive = hoveredAsset === asset.id || (hoveredAsset === null && selectedAsset === asset.id)
          return (
            <div
              key={asset.id}
              className={`flex items-center gap-3 px-2.5 py-2 cursor-pointer rounded-md transition-all duration-150 ${
                isActive ? "bg-foreground text-white" : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedAsset(asset.id)}
              onMouseEnter={() => setHoveredAsset(asset.id)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <img src={asset.thumbnail} alt={asset.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-medium truncate ${isActive ? "text-white" : "text-foreground"}`}>
                  {selectedAsset === asset.id && <span className="mr-1 text-[10px]">●</span>}
                  {asset.name}
                </div>
                <div className={`text-[11px] truncate ${isActive ? "text-white/60" : "text-muted-foreground/60"}`}>
                  {asset.type} · {asset.creator}
                  {asset.verified ? " ✓" : ""}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground/40 font-mono">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
      </div>
    </div>
  )
}

const demoComponents: Record<FeatureKey, () => React.JSX.Element> = {
  scripts: ScriptsDemo,
  instances: InstancesDemo,
  datastore: DataStoreDemo,
  toolbox: ToolboxDemo,
}

export default function QASection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("toolbox")

  useEffect(() => {
    const u = (window as any).UnicornStudio
    if (u && u.init) u.init()
  }, [])

  const handleClick = (key: FeatureKey) => {
    setActiveFeature(key)
  }

  const DemoComponent = demoComponents[activeFeature]

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
      <div className="mb-10">
        <h2 className="font-display text-3xl tracking-tight text-foreground md:text-4xl">
          Built for Roblox developers
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
          27+ specialized tools for Roblox Studio. Edit scripts, manipulate instances, query DataStores, and search the
          Toolbox.
        </p>
      </div>
      <div className="grid grid-cols-12 items-stretch gap-6 lg:gap-14">
        {/* Feature list — LEFT side */}
        <div className="col-span-12 flex flex-col lg:col-span-5 order-2 lg:order-1">
          <div className="space-y-1">
            {features.map((feature) => {
              const Icon = feature.icon
              const isActive = activeFeature === feature.key
              return (
                <button
                  key={feature.key}
                  onClick={() => handleClick(feature.key)}
                  className={`relative group flex w-full items-start gap-3.5 rounded-lg p-4 text-left transition-all duration-200 overflow-hidden ${
                    isActive
                      ? "bg-foreground/[0.04] border border-border"
                      : "border border-transparent hover:bg-muted/40"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                      isActive ? "bg-foreground/[0.06]" : "bg-transparent"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold transition-colors ${isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground/90"}`}
                    >
                      {feature.title}
                    </div>
                    <div
                      className={`text-[13px] leading-relaxed mt-0.5 transition-colors ${isActive ? "text-muted-foreground" : "text-muted-foreground/60"}`}
                    >
                      {feature.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <a
            className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors pt-6 group"
            href="/docs/roblox"
          >
            Roblox integration guide
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Demo panel — RIGHT side */}
        <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="relative aspect-[4/3]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img src="/assets/redwoods-2.png" alt="" className="h-full w-full object-cover" />
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
                    className="w-[90%] md:w-[82%] lg:w-[75%]"
                  >
                    <DemoComponent />
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
