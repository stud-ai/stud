import {Activity, Brain, GitBranch, Layers, Search, Workflow} from "lucide-react";

const contextItems = [
  {
    title: "Code understanding",
    description:
      "Deep and accurate codebase understanding with semantic graphs.",
    icon: Brain,
  },
  {
    title: "Runtime telemetry",
    description: "Connects to logs, metrics, and traces for real context.",
    icon: Activity,
  },
  {
    title: "Form‑fit workflows",
    description: "Customizable support and triage flows with approvals.",
    icon: Workflow,
  },
  {
    title: "Integrates everywhere",
    description:
      "All code SCMs, 50+ ticketing systems, MCP clients, and more.",
    icon: GitBranch,
  },
  {
    title: "Deep Research",
    description:
      "Agentic research that explores complex spaces and synthesizes answers.",
    icon: Search,
  },
  {
    title: "Multi‑repo at scale",
    description:
      "Supports large monorepos and many repos — scales to billions of LOC.",
    icon: Layers,
  },
];

export default function ContextSection() {
  return (
    <section className="mx-auto w-full max-w-7xl py-16">
      <div className="mb-12">
        <h2 className="font-base text-2xl tracking-tight md:text-3xl">
          Wide and deep context awareness
        </h2>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          PlayerZero is purpose-built to deeply understand large software
          systems.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-3">
        {contextItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-4">
              <div className="bg-tertiary flex h-16 w-16 flex-none items-center justify-center rounded-lg border">
                <Icon className="text-muted-foreground h-5 w-5" />
              </div>
              <div>
                <div className="text-foreground text-base font-medium">
                  {item.title}
                </div>
                <div className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
