"use client";

import {
  FileText,
  Layers,
  Search,
  Terminal,
  Folder,
  FolderOpen,
  File,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

type FeatureKey = "readwrite" | "globgrep" | "bash" | "subagent";

const features = [
  {
    key: "readwrite" as FeatureKey,
    icon: FileText,
    title: "Read & Write",
    description: "Read any file, write new code, and make precise edits with full context awareness.",
  },
  {
    key: "globgrep" as FeatureKey,
    icon: Search,
    title: "Glob & Grep",
    description: "Find files by pattern and search content across your entire codebase instantly.",
  },
  {
    key: "bash" as FeatureKey,
    icon: Terminal,
    title: "Bash Execution",
    description: "Run any shell command with intelligent output handling and permission controls.",
  },
  {
    key: "subagent" as FeatureKey,
    icon: Layers,
    title: "Subagent Delegation",
    description: "Spawn background agents for parallel tasks and complex workflows.",
  },
];

export default function SupportSection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("readwrite");

  const renderReadWriteDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground text-xs font-medium">src/server/PlayerData.lua</span>
        </div>
        <span className="text-xs text-muted-foreground">847 lines</span>
      </div>
      <div className="bg-tertiary rounded border border-border overflow-hidden font-mono text-xs">
        <div className="flex border-b border-border">
          <div className="w-8 text-right pr-2 py-0.5 text-muted-foreground/50 select-none bg-muted/30">1</div>
          <div className="px-2 py-0.5"><span className="text-[#ff7b72]">local</span> <span className="text-foreground">Players</span> <span className="text-muted-foreground">=</span> <span className="text-foreground">game</span><span className="text-muted-foreground">:</span><span className="text-[#d2a8ff]">GetService</span><span className="text-muted-foreground">(</span><span className="text-[#a5d6ff]">&quot;Players&quot;</span><span className="text-muted-foreground">)</span></div>
        </div>
        <div className="flex border-b border-border">
          <div className="w-8 text-right pr-2 py-0.5 text-muted-foreground/50 select-none bg-muted/30">2</div>
          <div className="px-2 py-0.5"><span className="text-[#ff7b72]">local</span> <span className="text-foreground">ReplicatedStorage</span> <span className="text-muted-foreground">=</span> <span className="text-foreground">game</span><span className="text-muted-foreground">:</span><span className="text-[#d2a8ff]">GetService</span><span className="text-muted-foreground">(</span><span className="text-[#a5d6ff]">&quot;ReplicatedStorage&quot;</span><span className="text-muted-foreground">)</span></div>
        </div>
        <div className="flex border-b border-border bg-[#3fb950]/10">
          <div className="w-8 text-right pr-2 py-0.5 text-[#3fb950]/70 select-none bg-[#3fb950]/10">3</div>
          <div className="px-2 py-0.5 text-[#3fb950]">+ <span className="text-[#ff7b72]">local</span> DataStoreService = game:GetService(&quot;DataStoreService&quot;)</div>
        </div>
        <div className="flex border-b border-border">
          <div className="w-8 text-right pr-2 py-0.5 text-muted-foreground/50 select-none bg-muted/30">4</div>
          <div className="px-2 py-0.5 text-muted-foreground"></div>
        </div>
        <div className="flex">
          <div className="w-8 text-right pr-2 py-0.5 text-muted-foreground/50 select-none bg-muted/30">5</div>
          <div className="px-2 py-0.5"><span className="text-[#ff7b72]">local function</span> <span className="text-[#d2a8ff]">onPlayerAdded</span><span className="text-muted-foreground">(</span><span className="text-[#ffa657]">player</span><span className="text-muted-foreground">)</span></div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[#3fb950]">+1 line added</span>
        <span className="text-xs text-muted-foreground">Luau</span>
      </div>
    </div>
  );

  const renderGlobGrepDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Grep &quot;PlayerData&quot;</span>
        <span className="text-xs text-muted-foreground ml-auto">23 matches</span>
      </div>
      <div className="bg-tertiary rounded border border-border overflow-hidden font-mono text-xs space-y-0">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border hover:bg-muted/50">
          <File className="h-3 w-3 text-[#58a6ff] flex-shrink-0" />
          <span className="text-[#58a6ff]">src/server/</span>
          <span className="text-foreground font-medium">PlayerData.lua</span>
          <span className="text-muted-foreground ml-auto">:12</span>
        </div>
        <div className="px-3 py-1.5 border-b border-border bg-muted/30">
          <span className="text-muted-foreground">local </span>
          <span className="bg-[#58a6ff]/30 text-foreground px-0.5 rounded">PlayerData</span>
          <span className="text-muted-foreground"> = require(script.Parent.</span>
          <span className="bg-[#58a6ff]/30 text-foreground px-0.5 rounded">PlayerData</span>
          <span className="text-muted-foreground">)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border hover:bg-muted/50">
          <File className="h-3 w-3 text-[#58a6ff] flex-shrink-0" />
          <span className="text-[#58a6ff]">src/client/</span>
          <span className="text-foreground font-medium">DataSync.lua</span>
          <span className="text-muted-foreground ml-auto">:47</span>
        </div>
        <div className="px-3 py-1.5 border-b border-border bg-muted/30">
          <span className="text-muted-foreground">function DataSync:get</span>
          <span className="bg-[#58a6ff]/30 text-foreground px-0.5 rounded">PlayerData</span>
          <span className="text-muted-foreground">(userId)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50">
          <File className="h-3 w-3 text-[#58a6ff] flex-shrink-0" />
          <span className="text-[#58a6ff]">src/shared/</span>
          <span className="text-foreground font-medium">Types.lua</span>
          <span className="text-muted-foreground ml-auto">:8</span>
        </div>
      </div>
    </div>
  );

  const renderBashDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Terminal</span>
      </div>
      <div className="bg-[#0d1117] rounded border border-border overflow-hidden font-mono text-xs">
        <div className="px-3 py-2 border-b border-border/50">
          <span className="text-[#8b949e]">$</span>
          <span className="text-foreground ml-2">rojo build -o game.rbxl</span>
        </div>
        <div className="px-3 py-2 text-[#8b949e] border-b border-border/50">
          <div>Building project...</div>
          <div className="text-[#3fb950]">✓ Built game.rbxl (2.4 MB)</div>
        </div>
        <div className="px-3 py-2 border-b border-border/50">
          <span className="text-[#8b949e]">$</span>
          <span className="text-foreground ml-2">selene src/</span>
        </div>
        <div className="px-3 py-2 text-[#8b949e] border-b border-border/50">
          <div className="text-[#3fb950]">✓ No issues found in 47 files</div>
        </div>
        <div className="px-3 py-2">
          <span className="text-[#8b949e]">$</span>
          <span className="text-foreground ml-2">npm run test</span>
          <span className="animate-pulse ml-1">▋</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="text-[#3fb950]">● 2 completed</span>
        <span className="text-[#d29922]">● 1 running</span>
      </div>
    </div>
  );

  const renderSubagentDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Active Agents</span>
        <span className="text-xs text-muted-foreground ml-auto">3 running</span>
      </div>
      <div className="space-y-2">
        <div className="bg-tertiary rounded border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
              <span className="text-xs font-medium text-foreground">Explore Agent</span>
            </div>
            <span className="text-xs text-muted-foreground">12s</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">&quot;Find all authentication-related code&quot;</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#58a6ff]">◆ Found 7 files</span>
            <span className="text-muted-foreground">→ Reading auth.lua</span>
          </div>
        </div>
        <div className="bg-tertiary rounded border border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></div>
              <span className="text-xs font-medium text-foreground">Plan Agent</span>
            </div>
            <span className="text-xs text-muted-foreground">8s</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">&quot;Design refactor for DataStore system&quot;</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#d29922]">~ Planning step 4/8</span>
          </div>
        </div>
        <div className="bg-tertiary rounded border border-[#3fb950]/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
              <span className="text-xs font-medium text-foreground">Bash Agent</span>
            </div>
            <span className="text-xs text-[#3fb950]">done</span>
          </div>
          <div className="text-xs text-muted-foreground">&quot;Run test suite&quot; → <span className="text-[#3fb950]">47/47 passed</span></div>
        </div>
      </div>
    </div>
  );

  const demos: Record<FeatureKey, React.ReactNode> = {
    readwrite: renderReadWriteDemo(),
    globgrep: renderGlobGrepDemo(),
    bash: renderBashDemo(),
    subagent: renderSubagentDemo(),
  };

  return (
    <div id="first-product-section">
      <section className="mx-auto w-full max-w-7xl py-16">
        <div className="mb-8">
          <h2 className="font-base text-2xl tracking-tight md:text-3xl">
            Powerful tools at your fingertips
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            Read, write, edit, and search your codebase with natural language.
            Execute commands and delegate complex tasks to subagents.
          </p>
        </div>
        <div className="grid grid-cols-12 items-stretch gap-12 md:gap-14 lg:gap-16">
          <div className="col-span-12 lg:col-span-6">
            <div className="overflow-hidden rounded-sm border shadow-sm">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 opacity-75 dark:opacity-60">
                  <img
                    alt="Cliffs"
                    className="object-cover"
                    src="/assets/cliff.png"
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
              href="/docs/tools"
            >
              Explore tools
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
