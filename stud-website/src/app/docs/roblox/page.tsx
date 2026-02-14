import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Roblox Studio Integration",
  description:
    "27+ specialized tools for Roblox Studio. Edit Luau scripts, manipulate instances, query DataStores, and search the Toolbox from your terminal.",
  alternates: { canonical: "/docs/roblox" },
}

export default function RobloxPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/40">Integrations</p>
      <h1 className="font-display mt-3 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
        Roblox Studio Integration
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        27+ specialized tools that connect directly to Roblox Studio. Edit scripts, manipulate instances, query DataStores, and search the Toolbox — all from your terminal.
      </p>

      {/* Architecture */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">How it works</h2>
        <p className="mt-3 text-base text-foreground/80">
          Stud communicates with Roblox Studio through a companion plugin. The plugin runs a local HTTP server inside Studio, allowing Stud to read and modify your game in real-time. Everything stays on your machine.
        </p>
        <div className="mt-6 rounded-xl border border-border bg-foreground p-5 font-mono text-sm text-white/80">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-white/10 px-2.5 py-1 text-emerald-400">You type a prompt</span>
            <span className="text-white/30">→</span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-blue-400">Stud plans actions</span>
            <span className="text-white/30">→</span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-amber-400">Plugin executes</span>
            <span className="text-white/30">→</span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-purple-400">Studio updates</span>
          </div>
        </div>
      </div>

      {/* Setup */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Setup</h2>
        <div className="mt-4 space-y-4 text-base text-foreground/80">
          <p>The plugin is included in the Stud repository. To install:</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <span className="font-mono text-xs text-foreground/40">Terminal</span>
          </div>
          <pre className="overflow-x-auto bg-foreground p-4 font-mono text-sm leading-relaxed text-white/85">
            <code>{`# Copy plugin to Roblox Studio plugins folder
cp plugins/stud-plugin.rbxm ~/Documents/Roblox/Plugins/

# Restart Roblox Studio, then enable HTTP Requests:
# Game Settings → Security → Allow HTTP Requests ✓`}</code>
          </pre>
        </div>
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-emerald-600">✓</span>
            <p className="text-sm text-emerald-800">
              Once the plugin is active, Stud will automatically detect the connection when you start a session. No additional configuration needed.
            </p>
          </div>
        </div>
      </div>

      {/* Tool categories */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Tool categories</h2>
        <p className="mt-3 text-base text-foreground/80">
          Roblox tools are organized into four categories, each identified by the <span className="font-mono text-emerald-600">◆</span> diamond icon.
        </p>

        {/* Script Tools */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span className="font-mono text-emerald-600">◆</span>
            Script Tools
          </h3>
          <p className="mt-2 text-sm text-foreground/70">Read, write, and edit Luau scripts directly in Roblox Studio.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">GetScript</code>
                <span className="text-sm text-foreground">Read the source of any script instance</span>
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground p-3 font-mono text-xs leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">◆</span>
                    <span className="text-white/70">GetScript &quot;ServerScriptService.GameManager&quot;</span>
                  </div>
                  <div className="mt-1.5 border-l-2 border-white/10 pl-3 text-white/40">
                    <div>  1│ <span className="text-purple-400">local</span> Players = game:GetService(<span className="text-green-400">&quot;Players&quot;</span>)</div>
                    <div>  2│ <span className="text-purple-400">local</span> RS = game:GetService(<span className="text-green-400">&quot;ReplicatedStorage&quot;</span>)</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">EditScript</code>
                <span className="text-sm text-foreground">Modify a script with intelligent diffing</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">CreateScript</code>
                <span className="text-sm text-foreground">Create a new Script, LocalScript, or ModuleScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instance Tools */}
        <div className="mt-10">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span className="font-mono text-emerald-600">◆</span>
            Instance Tools
          </h3>
          <p className="mt-2 text-sm text-foreground/70">Create, move, delete, and inspect any instance in the game tree.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">GetChildren</code>
                <span className="text-sm text-foreground">List children of any instance with class info</span>
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground p-3 font-mono text-xs leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">◆</span>
                    <span className="text-white/70">GetChildren &quot;game.Workspace&quot;</span>
                    <span className="ml-auto text-white/30">47 instances</span>
                  </div>
                  <div className="mt-1.5 border-l-2 border-white/10 pl-3 text-white/30 text-[11px]">
                    <div>├ Camera <span className="text-white/20">(Camera)</span></div>
                    <div>├ Terrain <span className="text-white/20">(Terrain)</span></div>
                    <div>├ SpawnLocation <span className="text-white/20">(SpawnLocation)</span></div>
                    <div>├ Map <span className="text-white/20">(Folder)</span></div>
                    <div>└ ... 43 more</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">CreateInstance</code>
                <span className="text-sm text-foreground">Create a new instance of any class</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">MoveInstance</code>
                <span className="text-sm text-foreground">Move or reparent instances in the tree</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">DeleteInstance</code>
                <span className="text-sm text-foreground">Remove instances (requires permission)</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">SetProperties</code>
                <span className="text-sm text-foreground">Modify instance properties (Position, Size, etc.)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DataStore Tools */}
        <div className="mt-10">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span className="font-mono text-blue-500">☁</span>
            DataStore Tools
          </h3>
          <p className="mt-2 text-sm text-foreground/70">Query and update DataStores directly from your terminal.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">DataStoreGet</code>
                <span className="text-sm text-foreground">Read values from a DataStore key</span>
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground p-3 font-mono text-xs leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">☁</span>
                    <span className="text-white/70">DataStoreGet &quot;PlayerData&quot; key=&quot;user_12345&quot;</span>
                  </div>
                  <div className="mt-1.5 border-l-2 border-white/10 pl-3 text-white/40">
                    <div>{"{"}</div>
                    <div>  &quot;coins&quot;: <span className="text-amber-400">1250</span>,</div>
                    <div>  &quot;level&quot;: <span className="text-amber-400">15</span>,</div>
                    <div>  &quot;inventory&quot;: [...]</div>
                    <div>{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">DataStoreSet</code>
                <span className="text-sm text-foreground">Write or update DataStore values (requires permission)</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">DataStoreList</code>
                <span className="text-sm text-foreground">List all keys in a DataStore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbox */}
        <div className="mt-10">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span className="font-mono text-orange-500">✱</span>
            Toolbox
          </h3>
          <p className="mt-2 text-sm text-foreground/70">Search and insert models, meshes, and assets from the Roblox Toolbox.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">ToolboxSearch</code>
                <span className="text-sm text-foreground">Search for assets by keyword</span>
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground p-3 font-mono text-xs leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400">✱</span>
                    <span className="text-white/70">ToolboxSearch &quot;village&quot;</span>
                    <span className="ml-auto text-white/30">5 results</span>
                  </div>
                  <div className="mt-1.5 border-l-2 border-white/10 pl-3 text-white/30 text-[11px]">
                    <div>1. Medieval Village Pack <span className="text-white/20">by BuildCraft ✓</span></div>
                    <div>2. Villager House <span className="text-white/20">by BlockBuilder ✓</span></div>
                    <div>3. Village Town Center <span className="text-white/20">by MapMakers ✓</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-foreground/70">ToolboxInsert</code>
                <span className="text-sm text-foreground">Insert an asset into your game (requires permission)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example session */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Example session</h2>
        <p className="mt-3 text-base text-foreground/80">
          Here&apos;s what a typical Roblox development session looks like with Stud:
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-3.5 w-3.5" />
            <span className="font-mono text-xs text-foreground/40">stud session</span>
          </div>
          <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
            <div className="text-white/50">{">"} <span className="text-white/90">Add a coin collection system to my game</span></div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">◆</span>
                <span className="text-white/60">GetChildren &quot;game.Workspace&quot;</span>
                <span className="ml-auto text-xs text-white/25">47 instances</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">◆</span>
                <span className="text-white/60">GetScript &quot;ServerScriptService.GameManager&quot;</span>
                <span className="ml-auto text-xs text-white/25">89 lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">→</span>
                <span className="text-white/60">Read src/shared/Config.lua</span>
                <span className="ml-auto text-xs text-white/25">23 lines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#d29922]">△</span>
                <span className="text-white/60">CreateScript &quot;ServerScriptService.CoinService&quot;</span>
                <span className="ml-auto text-xs text-[#d29922]/60">awaiting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#d29922]">△</span>
                <span className="text-white/60">CreateInstance &quot;Part&quot; in Workspace.Coins</span>
                <span className="ml-auto text-xs text-[#d29922]/60">awaiting</span>
              </div>
            </div>
            <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/30">
              2 actions awaiting approval · 14.2k tokens · $0.04
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="mt-16 rounded-xl border border-border bg-secondary p-6">
        <h3 className="text-base font-semibold text-foreground">Next Steps</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href="/docs/getting-started" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Getting Started →</span>
            <p className="mt-1 text-xs text-muted-foreground">Install and configure Stud</p>
          </a>
          <a href="/docs/permissions" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Permissions →</span>
            <p className="mt-1 text-xs text-muted-foreground">Understand the permission system</p>
          </a>
        </div>
      </div>
    </div>
  )
}
