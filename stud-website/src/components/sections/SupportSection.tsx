"use client";

import {
  FileText,
  Layers,
  Search,
  Terminal,
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

const demos: Record<FeatureKey, { rows: Array<{ icon: string; text: string; pending: string; status: string; result: string | null }> }> = {
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
      { icon: "✱", text: 'Grep "PlayerData"', pending: "Searching content...", status: "done", result: "23 matches" },
      { icon: "✱", text: 'Glob "src/server/**/*.lua"', pending: "Finding files...", status: "done", result: "12 files" },
      { icon: "✱", text: 'Grep "function.*Player"', pending: "Searching content...", status: "pending", result: null },
    ],
  },
  bash: {
    rows: [
      { icon: "$", text: "rojo build -o game.rbxl", pending: "Running command...", status: "done", result: "exit 0" },
      { icon: "$", text: "selene src/", pending: "Running linter...", status: "done", result: "0 warnings" },
      { icon: "$", text: "npm run build", pending: "Building project...", status: "done", result: "exit 0" },
      { icon: "$", text: "git status", pending: "Running command...", status: "pending", result: null },
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
};

export default function SupportSection() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("readwrite");
  const currentDemo = demos[activeFeature];

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
                    <div className="bg-secondary rounded-md border p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-foreground text-xs font-medium">Stud</span>
                        </div>
                        <span className="text-muted-foreground text-xs font-mono">
                          2.1k tokens · $0.02
                        </span>
                      </div>
                      <div className="border-border bg-tertiary rounded-sm border font-mono text-sm">
                        {currentDemo.rows.map((row, i) => (
                          <div
                            key={row.text}
                            className={`flex items-center justify-between px-3 py-2 ${i < currentDemo.rows.length - 1 ? "border-b border-border" : ""}`}
                          >
                            <div className="mr-2 flex min-w-0 flex-1 items-center gap-2">
                              {row.status === "pending" ? (
                                <>
                                  <span className="text-muted-foreground">~</span>
                                  <span className="text-muted-foreground">{row.pending}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-muted-foreground">{row.icon}</span>
                                  <span className="text-muted-foreground">{row.text}</span>
                                </>
                              )}
                            </div>
                            {row.status === "done" && (
                              <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground">
                                {row.result}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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
