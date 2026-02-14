import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tools Reference",
  description:
    "Complete reference for every Stud tool: Read, Write, Edit, Glob, Grep, Bash execution, and Subagent delegation.",
  alternates: { canonical: "/docs/tools" },
}

export default function ToolsPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/40">Core Concepts</p>
      <h1 className="font-display mt-3 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
        Tools Reference
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Stud provides a set of powerful tools for interacting with your codebase. Every tool execution is transparent and requires your approval.
      </p>

      {/* Tool categories */}
      <div className="mt-12 space-y-16">
        {/* Read */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 font-mono text-sm text-blue-600">→</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Read</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Reads the contents of a file from your filesystem. Supports line offsets and limits for large files, and can read images, PDFs, and Jupyter notebooks.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">→</span>
                <span className="text-white/70">Read src/server/PlayerData.lua</span>
              </div>
              <div className="mt-2 border-l-2 border-white/10 pl-4 text-white/50">
                <div>  1│ <span className="text-purple-400">local</span> PlayerData = {"{}"}</div>
                <div>  2│</div>
                <div>  3│ <span className="text-purple-400">function</span> <span className="text-blue-400">PlayerData.init</span>(player)</div>
                <div>  4│   <span className="text-purple-400">local</span> data = DataStore:GetAsync(player.UserId)</div>
                <div>  5│   ...</div>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-secondary p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Parameters</h4>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="font-mono text-foreground/70">file_path</dt>
                <dd className="text-muted-foreground">— Absolute path to the file to read</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-mono text-foreground/70">offset</dt>
                <dd className="text-muted-foreground">— Line number to start reading from (optional)</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-mono text-foreground/70">limit</dt>
                <dd className="text-muted-foreground">— Number of lines to read (optional)</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Write */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 font-mono text-sm text-emerald-600">←</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Write</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Writes content to a file, creating it if it doesn&apos;t exist or overwriting it if it does. Stud will always ask for your permission before writing.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">←</span>
                <span className="text-white/70">Write src/shared/Config.lua</span>
              </div>
              <div className="mt-2 border-l-2 border-emerald-400/30 pl-4 text-white/50">
                <div><span className="text-emerald-400">+</span> <span className="text-purple-400">return</span> {"{"}</div>
                <div><span className="text-emerald-400">+</span>   MaxPlayers = <span className="text-amber-400">50</span>,</div>
                <div><span className="text-emerald-400">+</span>   Debug = <span className="text-amber-400">false</span>,</div>
                <div><span className="text-emerald-400">+</span> {"}"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 font-mono text-sm text-violet-600">✎</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Edit</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Performs targeted string replacements in files. More precise than Write — only changes what needs to change, leaving the rest of the file untouched.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-violet-400">✎</span>
                <span className="text-white/70">Edit src/server/PlayerData.lua</span>
              </div>
              <div className="mt-2 border-l-2 border-white/10 pl-4 text-white/50">
                <div><span className="text-red-400">-</span> MaxPlayers = <span className="text-amber-400">50</span>,</div>
                <div><span className="text-emerald-400">+</span> MaxPlayers = <span className="text-amber-400">100</span>,</div>
              </div>
            </div>
          </div>
        </section>

        {/* Glob */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 font-mono text-sm text-orange-600">✱</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Glob</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Fast file pattern matching. Find files by name, extension, or directory pattern. Returns matching paths sorted by modification time.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">✱</span>
                <span className="text-white/70">Glob &quot;**/*.lua&quot;</span>
                <span className="ml-auto text-xs text-white/30">23 files</span>
              </div>
              <div className="mt-2 border-l-2 border-white/10 pl-4 text-white/40 text-xs">
                <div>src/server/init.lua</div>
                <div>src/server/PlayerData.lua</div>
                <div>src/client/PlayerGui.lua</div>
                <div>src/shared/Config.lua</div>
                <div className="text-white/25">... 19 more</div>
              </div>
            </div>
          </div>
        </section>

        {/* Grep */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 font-mono text-sm text-orange-600">✱</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Grep</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Search file contents using regular expressions. Supports context lines, file type filtering, and multiple output modes. Built on ripgrep for speed.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">✱</span>
                <span className="text-white/70">Grep &quot;GetAsync&quot; --type lua</span>
                <span className="ml-auto text-xs text-white/30">3 matches</span>
              </div>
              <div className="mt-2 border-l-2 border-white/10 pl-4 text-white/40 text-xs">
                <div>src/server/PlayerData.lua:<span className="text-white/60">4</span>: local data = DataStore:<span className="text-amber-400">GetAsync</span>(key)</div>
                <div>src/server/Leaderboard.lua:<span className="text-white/60">12</span>: local scores = Store:<span className="text-amber-400">GetAsync</span>(&quot;top&quot;)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bash */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 font-mono text-sm text-foreground/60">{">_"}</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Bash</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Execute shell commands directly from Stud. Useful for running builds, tests, git operations, and other terminal tasks. Output is captured and parsed intelligently.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-white/60">{">_"}</span>
                <span className="text-white/70">git status</span>
              </div>
              <div className="mt-2 border-l-2 border-white/10 pl-4 text-white/40 text-xs">
                <div>On branch main</div>
                <div>Changes not staged for commit:</div>
                <div>  modified: src/server/PlayerData.lua</div>
              </div>
            </div>
          </div>
        </section>

        {/* Subagent */}
        <section>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-mono text-sm text-cyan-600">◉</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Subagents</h2>
          </div>
          <p className="mt-3 text-base text-foreground/80">
            Delegate tasks to background agents that work in parallel. Subagents have their own context and tools, making them ideal for researching code, running tests, or handling independent subtasks.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
              <span className="font-mono text-xs text-foreground/40">Example</span>
            </div>
            <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">◉</span>
                <span className="text-white/70">Spawning subagent: &quot;Review all server scripts for security issues&quot;</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-white/40 text-xs">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                <span>Agent working in background...</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Next steps */}
      <div className="mt-16 rounded-xl border border-border bg-secondary p-6">
        <h3 className="text-base font-semibold text-foreground">Next Steps</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href="/docs/permissions" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Permissions →</span>
            <p className="mt-1 text-xs text-muted-foreground">How Stud keeps you in control</p>
          </a>
          <a href="/docs/roblox" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Roblox Integration →</span>
            <p className="mt-1 text-xs text-muted-foreground">27+ specialized Roblox tools</p>
          </a>
        </div>
      </div>
    </div>
  )
}
