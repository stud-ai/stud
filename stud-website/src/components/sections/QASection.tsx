"use client";

import {
  Box,
  Code,
  Database,
  Search,
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

// Real Roblox village assets with actual thumbnail URLs from the Roblox API
const toolboxAssets = [
  { id: 90405905565781, name: "Medieval Village Pack", type: "Model", creator: "BuildCraft", verified: true, thumbnail: "https://tr.rbxcdn.com/180DAY-118b27b7f6a9283190692ac5aa42061d/150/150/Model/Png/noFilter" },
  { id: 7021878884, name: "Villager House", type: "Model", creator: "BlockBuilder", verified: true, thumbnail: "https://tr.rbxcdn.com/180DAY-473a5ba01300471878be2aeadb136d9f/150/150/Model/Png/noFilter" },
  { id: 169765254, name: "Village Town Center", type: "Model", creator: "MapMakers", verified: true, thumbnail: "https://tr.rbxcdn.com/180DAY-d3e27699e4739b9d61f078b1e56a14c1/150/150/Model/Png/noFilter" },
  { id: 8915687805, name: "Fantasy Village Kit", type: "Model", creator: "RPGAssets", verified: false, thumbnail: "https://tr.rbxcdn.com/180DAY-5d483f6e8430377c9f9eae7b480c9470/150/150/Model/Png/noFilter" },
  { id: 15485395576, name: "Village Market Stall", type: "Model", creator: "DetailProps", verified: true, thumbnail: "https://tr.rbxcdn.com/180DAY-87cda8fd7a2b104f021950cc8e170510/150/150/Model/Png/noFilter" },
];

const demos: Record<FeatureKey, React.ReactNode> = {
  scripts: (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Code className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Script Editor</span>
      </div>
      <div className="border-border bg-tertiary rounded-sm border font-mono text-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Get Script &quot;ServerScriptService.Main&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">847 lines</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Edit Script &quot;ReplicatedStorage.Config&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">+18 -4</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Create Script &quot;Workspace.NewHandler&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">created</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">~</span>
            <span className="text-muted-foreground">Editing script...</span>
          </div>
        </div>
      </div>
    </div>
  ),
  instances: (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Box className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Instance Tools</span>
      </div>
      <div className="border-border bg-tertiary rounded-sm border font-mono text-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">◆</span>
            <span className="text-muted-foreground">Get Children &quot;game.Workspace&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">47 instances</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">◆</span>
            <span className="text-muted-foreground">Create Part in Workspace</span>
          </div>
          <span className="text-xs text-muted-foreground">created</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">◆</span>
            <span className="text-muted-foreground">Set Property &quot;Part.Color&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">updated</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">~</span>
            <span className="text-muted-foreground">Cloning instance...</span>
          </div>
        </div>
      </div>
    </div>
  ),
  datastore: (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">DataStore Operations</span>
      </div>
      <div className="border-border bg-tertiary rounded-sm border font-mono text-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">☁</span>
            <span className="text-muted-foreground">Get DataStore &quot;PlayerData&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">connected</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">☁</span>
            <span className="text-muted-foreground">Get Key &quot;user_12345&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">retrieved</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">☁</span>
            <span className="text-muted-foreground">Update Key &quot;user_12345.coins&quot;</span>
          </div>
          <span className="text-xs text-muted-foreground">saved</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">~</span>
            <span className="text-muted-foreground">Listing keys...</span>
          </div>
        </div>
      </div>
    </div>
  ),
  toolbox: null, // Will render custom picker
};

export default function QASection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("toolbox");
  const [selectedAsset, setSelectedAsset] = useState<number>(90405905565781);
  const [hoveredAsset, setHoveredAsset] = useState<number | null>(null);

  const renderToolboxPicker = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-foreground text-sm font-medium">Search Toolbox</span>
        <span className="text-muted-foreground text-xs">esc</span>
      </div>
      <div className="mb-3">
        <div className="bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-foreground font-mono">
          village<span className="animate-pulse">|</span>
        </div>
      </div>
      <div className="space-y-0.5">
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
              <img src={asset.thumbnail} alt={asset.name} className="w-9 h-9 rounded object-cover flex-shrink-0" />
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
        <span>enter select</span>
      </div>
    </div>
  );

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
                  {activeFeature === "toolbox" ? renderToolboxPicker() : demos[activeFeature]}
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
