"use client";

import { AlertTriangle, Eye, Lock, Settings, Terminal, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";

type FeatureKey = "granular" | "transparency" | "deny" | "policies";

const features = [
  {
    key: "granular" as FeatureKey,
    icon: Lock,
    title: "Granular Permissions",
    description: "Approve individual actions or grant session-wide access per tool type.",
  },
  {
    key: "transparency" as FeatureKey,
    icon: Eye,
    title: "Full Transparency",
    description: "See exactly what Stud will do before any action is taken, including full diffs.",
  },
  {
    key: "deny" as FeatureKey,
    icon: AlertTriangle,
    title: "Deny by Default",
    description: "Sensitive operations like file writes and bash commands require explicit approval.",
  },
  {
    key: "policies" as FeatureKey,
    icon: Settings,
    title: "Configurable Policies",
    description: "Set up permission rules and agent configurations that match your workflow.",
  },
];

const permissionOptions = [
  { id: "allow", label: "Allow once" },
  { id: "always", label: "Allow always" },
  { id: "reject", label: "Reject" },
];

export default function SecuritySection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("granular");
  const [selectedOption, setSelectedOption] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);

  const renderGranularDemo = () => (
    <div className="bg-secondary rounded-md border-l-4 border-l-[#d29922] border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#d29922] text-lg">△</span>
        <span className="text-foreground text-sm font-medium">
          Edit src/server/PlayerData.lua
        </span>
      </div>
      <div className="bg-[#0d1117] rounded border border-border mb-3 overflow-hidden font-mono text-xs">
        <div className="flex border-b border-border/30">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">12</div>
          <div className="px-2 py-1 text-[#8b949e]">local Players = game:GetService(&quot;Players&quot;)</div>
        </div>
        <div className="flex border-b border-border/30 bg-[#388bfd]/10">
          <div className="w-7 text-right pr-2 py-1 text-[#388bfd]/70 select-none">13</div>
          <div className="px-2 py-1 text-[#388bfd]">+ local DataStoreService = game:GetService(&quot;DataStoreService&quot;)</div>
        </div>
        <div className="flex border-b border-border/30 bg-[#388bfd]/10">
          <div className="w-7 text-right pr-2 py-1 text-[#388bfd]/70 select-none">14</div>
          <div className="px-2 py-1 text-[#388bfd]">+ local playerDataStore = DataStoreService:GetDataStore(&quot;PlayerData&quot;)</div>
        </div>
        <div className="flex">
          <div className="w-7 text-right pr-2 py-1 text-[#484f58] select-none">15</div>
          <div className="px-2 py-1 text-[#8b949e]">local function onPlayerAdded(player)</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {permissionOptions.map((option, i) => {
          const isActive = selectedOption === i || hoveredOption === i;
          return (
            <button
              key={option.id}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-[#d29922] text-white shadow-sm scale-105"
                  : "bg-tertiary border border-border text-foreground hover:bg-muted"
              }`}
              onClick={() => setSelectedOption(i)}
              onMouseEnter={() => setHoveredOption(i)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>⇆ select</span>
        <span>enter confirm</span>
      </div>
    </div>
  );

  const renderTransparencyDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-[#58a6ff]" />
          <span className="text-foreground text-xs font-medium">Session Activity</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">3.2k tokens</span>
      </div>
      <div className="bg-tertiary rounded border border-border overflow-hidden font-mono text-xs">
        <div className="flex items-center px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[#3fb950]">✓</span>
            <span className="text-foreground">Read src/server/PlayerData.lua</span>
          </div>
          <span className="text-muted-foreground">847 lines</span>
        </div>
        <div className="flex items-center px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[#3fb950]">✓</span>
            <span className="text-foreground">Grep &quot;DataStore&quot;</span>
          </div>
          <span className="text-muted-foreground">12 matches</span>
        </div>
        <div className="flex items-center px-3 py-2 border-b border-border bg-[#d29922]/10">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[#d29922]">△</span>
            <span className="text-[#d29922]">Write src/server/DataManager.lua</span>
          </div>
          <span className="text-[#d29922]">pending</span>
        </div>
        <div className="px-3 py-2 border-b border-border bg-muted/30">
          <div className="text-muted-foreground mb-1">Preview:</div>
          <div className="text-[#7ee787]">+ local DataManager = {}</div>
          <div className="text-[#7ee787]">+ function DataManager:init()</div>
          <div className="text-muted-foreground">  ...</div>
        </div>
        <div className="flex items-center px-3 py-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-muted-foreground animate-pulse">~</span>
            <span className="text-muted-foreground">Awaiting approval...</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDenyDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f85149]/5 to-transparent pointer-events-none"></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f85149]/20">
            <ShieldX className="h-3.5 w-3.5 text-[#f85149]" />
          </div>
          <span className="text-foreground text-sm font-medium">Blocked Command</span>
        </div>
        <div className="bg-[#0d1117] rounded border border-[#f85149]/30 mb-3 overflow-hidden font-mono text-xs">
          <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
            <Terminal className="h-3 w-3 text-[#f85149]" />
            <span className="text-[#f85149]">rm -rf node_modules/ dist/</span>
          </div>
          <div className="px-3 py-3 bg-[#f85149]/5">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-[#f85149] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[#f85149] font-medium mb-1">Destructive operation detected</div>
                <div className="text-[#8b949e]">This command would permanently delete:</div>
              </div>
            </div>
            <div className="ml-5 space-y-1 text-[#8b949e]">
              <div>• <span className="text-foreground">node_modules/</span> — 2,847 files (312 MB)</div>
              <div>• <span className="text-foreground">dist/</span> — 156 files (24 MB)</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 px-3 py-2 rounded text-xs font-medium bg-tertiary border border-border text-foreground hover:bg-muted cursor-pointer transition-colors">
            Allow anyway
          </button>
          <button className="flex-1 px-3 py-2 rounded text-xs font-medium bg-[#f85149] text-white cursor-pointer transition-colors hover:bg-[#f85149]/90">
            Keep blocked
          </button>
        </div>
      </div>
    </div>
  );

  const policies = [
    { name: "Read files", status: "allow", icon: "✓", color: "#3fb950" },
    { name: "Search (Glob/Grep)", status: "allow", icon: "✓", color: "#3fb950" },
    { name: "Write files", status: "ask", icon: "△", color: "#d29922" },
    { name: "Bash commands", status: "ask", icon: "△", color: "#d29922" },
    { name: "Destructive ops", status: "deny", icon: "✕", color: "#f85149" },
  ];

  const renderPoliciesDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground text-xs font-medium">Permission Policy</span>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#3fb950]/20 text-[#3fb950]">Active</span>
      </div>
      <div className="bg-tertiary rounded border border-border overflow-hidden">
        {policies.map((policy, i) => (
          <div
            key={policy.name}
            className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
              i < policies.length - 1 ? "border-b border-border" : ""
            } ${selectedPolicy === i ? "bg-muted/50" : "hover:bg-muted/30"}`}
            onClick={() => setSelectedPolicy(selectedPolicy === i ? null : i)}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: policy.color }}>{policy.icon}</span>
              <span className="text-xs text-foreground">{policy.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${policy.color}20`,
                  color: policy.color,
                }}
              >
                {policy.status === "allow" ? "always allow" : policy.status === "ask" ? "ask each time" : "always deny"}
              </span>
              {selectedPolicy === i && (
                <span className="text-[10px] text-muted-foreground">click to edit</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#3fb950]" />
          <span className="text-muted-foreground">Session protected</span>
        </div>
        <span className="text-muted-foreground">5 rules active</span>
      </div>
    </div>
  );

  const demos: Record<FeatureKey, React.ReactNode> = {
    granular: renderGranularDemo(),
    transparency: renderTransparencyDemo(),
    deny: renderDenyDemo(),
    policies: renderPoliciesDemo(),
  };

  return (
    <div className="bg-tertiary rounded-sm">
      <section className="mx-auto w-full max-w-7xl py-16">
        <div className="mb-8">
          <h2 className="font-base text-2xl tracking-tight md:text-3xl">
            You&apos;re always in control
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            A robust permission system ensures Stud only takes actions you approve.
          </p>
        </div>
        <div className="grid grid-cols-12 items-stretch gap-12 md:gap-14 lg:gap-16">
          <div className="col-span-12 lg:col-span-6">
            <div className="overflow-hidden rounded-sm border shadow-sm">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 opacity-75 dark:opacity-60">
                  <img
                    alt="Forest"
                    className="object-cover"
                    src="/assets/redwoods-dark.png"
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
              href="/docs/permissions"
            >
              Learn about permissions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
