"use client";

import { AlertTriangle, Eye, Lock, Settings, Terminal, FileText } from "lucide-react";
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

  const renderGranularDemo = () => (
    <div className="bg-secondary rounded-md border-l-4 border-l-[#d29922] border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#d29922] text-lg">△</span>
        <span className="text-foreground text-sm font-medium">
          Edit src/server/PlayerData.lua
        </span>
      </div>
      <div className="bg-tertiary rounded border border-border mb-3 overflow-hidden">
        <div className="font-mono text-xs">
          <div className="flex">
            <div className="w-8 text-right pr-2 text-muted-foreground/50 select-none bg-muted/30">12</div>
            <div className="px-2 py-0.5 text-muted-foreground">local Players = game:GetService(&quot;Players&quot;)</div>
          </div>
          <div className="flex bg-[#3fb950]/10">
            <div className="w-8 text-right pr-2 text-[#3fb950]/50 select-none bg-[#3fb950]/10">13</div>
            <div className="px-2 py-0.5 text-[#3fb950]">+ local DataStoreService = game:GetService(&quot;DataStoreService&quot;)</div>
          </div>
          <div className="flex">
            <div className="w-8 text-right pr-2 text-muted-foreground/50 select-none bg-muted/30">14</div>
            <div className="px-2 py-0.5 text-muted-foreground">local function onPlayerAdded(player)</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {permissionOptions.map((option, i) => {
          const isActive = selectedOption === i || hoveredOption === i;
          return (
            <button
              key={option.id}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#d29922] text-white"
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
      <div className="flex items-center gap-2 mb-3">
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Action Preview</span>
      </div>
      <div className="border-border bg-tertiary rounded-sm border font-mono text-sm">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Read src/server/PlayerData.lua</span>
          </div>
          <span className="text-xs text-muted-foreground">847 lines</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Read src/shared/Config.lua</span>
          </div>
          <span className="text-xs text-muted-foreground">124 lines</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-[#d29922]/10">
          <div className="flex items-center gap-2">
            <span className="text-[#d29922]">△</span>
            <span className="text-[#d29922]">Write src/server/DataManager.lua</span>
          </div>
          <span className="text-xs text-[#d29922]">awaiting</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">~</span>
            <span className="text-muted-foreground">Waiting for approval...</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDenyDemo = () => (
    <div className="bg-secondary rounded-md border-l-4 border-l-[#f85149] border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="h-4 w-4 text-[#f85149]" />
        <span className="text-foreground text-sm font-medium">
          Bash: rm -rf node_modules/
        </span>
      </div>
      <div className="bg-tertiary rounded border border-border mb-3 p-3 font-mono text-xs">
        <div className="text-[#f85149] mb-2">⚠ This command will delete files</div>
        <div className="text-muted-foreground">
          <div>Target: ./node_modules/</div>
          <div>Files: ~2,847 items</div>
          <div>Size: 312 MB</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="px-3 py-1.5 rounded text-xs font-medium bg-tertiary border border-border text-foreground hover:bg-muted cursor-pointer">
          Allow once
        </button>
        <button className="px-3 py-1.5 rounded text-xs font-medium bg-[#f85149] text-white cursor-pointer">
          Reject
        </button>
      </div>
      <div className="mt-3 text-xs text-[#f85149]">
        Destructive commands are blocked by default
      </div>
    </div>
  );

  const renderPoliciesDemo = () => (
    <div className="bg-secondary rounded-md border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-foreground text-xs font-medium">Permission Rules</span>
      </div>
      <div className="border-border bg-tertiary rounded-sm border font-mono text-xs">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[#3fb950]">✓</span>
            <span className="text-muted-foreground">Read files</span>
          </div>
          <span className="text-xs text-[#3fb950]">always allow</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[#3fb950]">✓</span>
            <span className="text-muted-foreground">Glob &amp; Grep</span>
          </div>
          <span className="text-xs text-[#3fb950]">always allow</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[#d29922]">△</span>
            <span className="text-muted-foreground">Write files</span>
          </div>
          <span className="text-xs text-[#d29922]">ask each time</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-[#d29922]">△</span>
            <span className="text-muted-foreground">Bash commands</span>
          </div>
          <span className="text-xs text-[#d29922]">ask each time</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[#f85149]">✕</span>
            <span className="text-muted-foreground">Destructive ops</span>
          </div>
          <span className="text-xs text-[#f85149]">always deny</span>
        </div>
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
