"use client";

import {
  Box,
  Code,
  Database,
  Search,
  ChevronRight,
  ChevronDown,
  FileCode,
  Folder,
} from "lucide-react";
import { useState } from "react";

type FeatureKey = "scripts" | "instances" | "datastore" | "toolbox";

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
];

// Real Roblox assets with actual thumbnail URLs from the Roblox API
const toolboxAssets = [
  { id: 7136915607, name: "Low Poly Tree Pack", type: "Model", creator: "NatureAssets", verified: true, thumbnail: "https://t2.rbxcdn.com/180DAY-94d8a00d83f26f36de332fbba2223f3c" },
  { id: 6899470737, name: "Stylized Oak Tree", type: "Model", creator: "TreeMaster3D", verified: true, thumbnail: "https://t4.rbxcdn.com/180DAY-3acb0f0da8433cb97bb84fe70301c78f" },
  { id: 6439306858, name: "Pine Tree Low Poly", type: "Model", creator: "ForestPack", verified: true, thumbnail: "https://t2.rbxcdn.com/180DAY-c241e6748c4c05ea93e73916de6c0cec" },
  { id: 6557596986, name: "Cartoon Tree Set", type: "Model", creator: "ToonWorld", verified: false, thumbnail: "https://t7.rbxcdn.com/180DAY-dde6e11e92c0fe4e2179eb39843d0ec4" },
  { id: 5767839048, name: "Simple Tree Model", type: "Model", creator: "EasyBuild", verified: true, thumbnail: "https://t6.rbxcdn.com/180DAY-cc85115bb7b1a4f5a82e977de51e9c53" },
];

export default function QASection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("scripts");
  const [selectedAsset, setSelectedAsset] = useState<number>(7136915607);
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null);

  const renderScriptsDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code className="h-3.5 w-3.5 text-[#58a6ff]" />
          <span className="text-foreground text-xs font-medium">ServerScriptService.Main</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#58a6ff]/20 text-[#58a6ff]">Luau</span>
        </div>
      </div>
      <div className="bg-[#0d1117] rounded border border-border overflow-hidden font-mono text-xs">
        <div className="flex border-b border-border/30">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">1</div>
          <div className="px-2 py-1 flex-1">
            <span className="text-[#ff7b72]">local</span>
            <span className="text-[#c9d1d9]"> Players = game:</span>
            <span className="text-[#d2a8ff]">GetService</span>
            <span className="text-[#c9d1d9]">(</span>
            <span className="text-[#a5d6ff]">&quot;Players&quot;</span>
            <span className="text-[#c9d1d9]">)</span>
          </div>
        </div>
        <div className="flex border-b border-border/30">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">2</div>
          <div className="px-2 py-1 flex-1">
            <span className="text-[#ff7b72]">local</span>
            <span className="text-[#c9d1d9]"> RunService = game:</span>
            <span className="text-[#d2a8ff]">GetService</span>
            <span className="text-[#c9d1d9]">(</span>
            <span className="text-[#a5d6ff]">&quot;RunService&quot;</span>
            <span className="text-[#c9d1d9]">)</span>
          </div>
        </div>
        <div className="flex border-b border-border/30">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">3</div>
          <div className="px-2 py-1 flex-1"></div>
        </div>
        <div className="flex border-b border-border/30">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">4</div>
          <div className="px-2 py-1 flex-1">
            <span className="text-[#8b949e]">-- Initialize player data on join</span>
          </div>
        </div>
        <div className="flex">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">5</div>
          <div className="px-2 py-1 flex-1">
            <span className="text-[#ff7b72]">local function</span>
            <span className="text-[#d2a8ff]"> onPlayerAdded</span>
            <span className="text-[#c9d1d9]">(</span>
            <span className="text-[#ffa657]">player</span>
            <span className="text-[#c9d1d9]">)</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">847 lines</span>
        <div className="flex items-center gap-2">
          <span className="text-[#3fb950]">● Synced</span>
        </div>
      </div>
    </div>
  );

  const renderInstancesDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Box className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Explorer</span>
      </div>
      <div className="bg-tertiary rounded border border-border overflow-hidden font-mono text-xs">
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border hover:bg-muted/30">
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
          <span className="text-[#f0b832]">⬢</span>
          <span className="text-foreground">game</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border hover:bg-muted/30 pl-4">
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
          <Folder className="h-3 w-3 text-[#8b949e]" />
          <span className="text-foreground">Workspace</span>
          <span className="text-muted-foreground ml-auto">47</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-[#58a6ff]/10 pl-8">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Box className="h-3 w-3 text-[#8b949e]" />
          <span className="text-[#58a6ff] font-medium">SpawnLocation</span>
          <span className="text-[#58a6ff] ml-auto text-[10px]">selected</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border hover:bg-muted/30 pl-8">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Box className="h-3 w-3 text-[#8b949e]" />
          <span className="text-foreground">Baseplate</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border hover:bg-muted/30 pl-8">
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
          <Folder className="h-3 w-3 text-[#8b949e]" />
          <span className="text-foreground">Map</span>
          <span className="text-muted-foreground ml-auto">12</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1.5 hover:bg-muted/30 pl-4">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Folder className="h-3 w-3 text-[#8b949e]" />
          <span className="text-foreground">ServerScriptService</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>◆ Get Children</span>
        <span>◆ Set Property</span>
        <span>◆ Clone</span>
      </div>
    </div>
  );

  const renderDatastoreDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-[#a371f7]" />
          <span className="text-foreground text-xs font-medium">PlayerData</span>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#a371f7]/20 text-[#a371f7]">DataStore</span>
      </div>
      <div className="bg-[#0d1117] rounded border border-border overflow-hidden font-mono text-xs">
        <div className="px-3 py-2 border-b border-border/30 text-[#8b949e]">
          key: <span className="text-[#a5d6ff]">&quot;user_12345&quot;</span>
        </div>
        <div className="px-3 py-2">
          <div className="text-[#c9d1d9]">{"{"}</div>
          <div className="pl-4">
            <span className="text-[#7ee787]">&quot;coins&quot;</span>
            <span className="text-[#c9d1d9]">: </span>
            <span className="text-[#79c0ff]">2450</span>
            <span className="text-[#c9d1d9]">,</span>
          </div>
          <div className="pl-4">
            <span className="text-[#7ee787]">&quot;level&quot;</span>
            <span className="text-[#c9d1d9]">: </span>
            <span className="text-[#79c0ff]">24</span>
            <span className="text-[#c9d1d9]">,</span>
          </div>
          <div className="pl-4">
            <span className="text-[#7ee787]">&quot;inventory&quot;</span>
            <span className="text-[#c9d1d9]">: [</span>
            <span className="text-[#a5d6ff]">&quot;sword&quot;</span>
            <span className="text-[#c9d1d9]">, </span>
            <span className="text-[#a5d6ff]">&quot;shield&quot;</span>
            <span className="text-[#c9d1d9]">],</span>
          </div>
          <div className="pl-4">
            <span className="text-[#7ee787]">&quot;lastLogin&quot;</span>
            <span className="text-[#c9d1d9]">: </span>
            <span className="text-[#79c0ff]">1706832000</span>
          </div>
          <div className="text-[#c9d1d9]">{"}"}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-[#3fb950]">◆ Retrieved successfully</span>
        <span className="text-muted-foreground">v3 · 2.1KB</span>
      </div>
    </div>
  );

  const renderToolboxPicker = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground text-sm font-medium">Search Toolbox</span>
        <span className="text-muted-foreground text-xs">esc</span>
      </div>
      <div className="mb-3">
        <div className="bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-foreground font-mono">
          low poly tree<span className="animate-pulse">|</span>
        </div>
      </div>
      <div className="space-y-0.5 max-h-[160px] overflow-y-auto">
        {toolboxAssets.map((asset) => {
          const isActive = hoveredAsset === asset.id || (hoveredAsset === null && selectedAsset === asset.id);
          return (
            <div
              key={asset.id}
              className={`flex items-center gap-3 px-2 py-1.5 cursor-pointer rounded-sm transition-colors ${
                isActive ? "bg-[#58a6ff]" : ""
              }`}
              onClick={() => setSelectedAsset(asset.id)}
              onMouseEnter={() => setHoveredAsset(asset.id)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <img src={asset.thumbnail} alt={asset.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-foreground"}`}>
                  {selectedAsset === asset.id && <span className="mr-1">●</span>}
                  {asset.name}
                </div>
                <div className={`text-xs truncate ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                  {asset.type} | {asset.creator}{asset.verified ? " ✓" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>↑↓ navigate</span>
        <span>enter insert</span>
      </div>
    </div>
  );

  const demos: Record<FeatureKey, React.ReactNode> = {
    scripts: renderScriptsDemo(),
    instances: renderInstancesDemo(),
    datastore: renderDatastoreDemo(),
    toolbox: renderToolboxPicker(),
  };

  return (
    <section className="mx-auto w-full max-w-7xl py-16">
      <div className="mb-8">
        <h2 className="font-base text-2xl tracking-tight md:text-3xl">
          Built for Roblox developers
        </h2>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          27+ specialized tools for Roblox Studio. Edit scripts, manipulate
          instances, query DataStores, and search the Toolbox.
        </p>
      </div>
      <div className="grid grid-cols-12 items-stretch gap-12 md:gap-14 lg:gap-16">
        <div className="col-span-12 lg:col-span-6">
          <div className="overflow-hidden rounded-sm border shadow-sm">
            <div className="relative aspect-[4/3]">
              <div className="absolute inset-0 opacity-75 dark:opacity-60">
                <img
                  alt="Mountain"
                  className="object-cover"
                  src="/assets/mountain.png"
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="w-[92%] md:w-[86%] lg:w-[78%]">
                  {demos[activeFeature]}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 flex flex-col lg:col-span-6">
          <ul className="space-y-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.key;
              return (
                <li
                  key={feature.key}
                  onClick={() => setActiveFeature(feature.key)}
                  className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                    isActive
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <div className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>
                      {feature.title}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {feature.description}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <a
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 mt-auto w-fit"
            href="/docs/roblox"
          >
            Roblox integration guide
          </a>
        </div>
      </div>
    </section>
  );
}
