import {Code, FileSearch, History, Layers, Plug, Terminal} from "lucide-react";

const contextItems = [
  {
    title: "LSP Integration",
    description:
      "Full language server support for intelligent code navigation and diagnostics.",
    icon: Code,
  },
  {
    title: "MCP Protocol",
    description: "Extensible Model Context Protocol support for custom tool integrations.",
    icon: Plug,
  },
  {
    title: "Session Management",
    description: "Resume sessions, track token usage, and manage conversation history.",
    icon: History,
  },
  {
    title: "Subagent System",
    description:
      "Delegate complex tasks to background agents that work in parallel.",
    icon: Layers,
  },
  {
    title: "Smart File Handling",
    description:
      "Glob patterns, regex search, and intelligent file reading with context limits.",
    icon: FileSearch,
  },
  {
    title: "Terminal Native",
    description:
      "A beautiful TUI that feels at home in your terminal workflow.",
    icon: Terminal,
  },
];

export default function ContextSection() {
  return (
    <section className="mx-auto w-full max-w-7xl py-16">
      <div className="mb-12">
        <h2 className="font-base text-2xl tracking-tight md:text-3xl">
          Powerful capabilities under the hood
        </h2>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Modern AI with deep tooling integration for a seamless development experience.
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
