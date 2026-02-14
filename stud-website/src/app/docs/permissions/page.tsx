import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Permissions",
  description:
    "Understand how Stud keeps you in control with granular, transparent permission prompts. Allow once, allow always, or reject any action.",
  alternates: { canonical: "/docs/permissions" },
}

export default function PermissionsPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/40">Core Concepts</p>
      <h1 className="font-display mt-3 text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
        Permissions
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Stud never takes action without your approval. Every file write, shell command, and Roblox operation goes through a transparent permission system.
      </p>

      {/* How it works */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">How it works</h2>
        <p className="mt-3 text-base text-foreground/80">
          When Stud wants to perform an action that modifies your system — writing a file, running a shell command, or editing a script in Roblox Studio — it shows you exactly what it plans to do and asks for your approval.
        </p>

        {/* Permission prompt demo */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <img src="/assets/logo_transparent_bg.png" alt="Stud" className="h-3.5 w-3.5" />
            <span className="font-mono text-xs text-foreground/40">stud</span>
          </div>
          <div className="bg-foreground p-4 font-mono text-sm leading-relaxed">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[#d29922]">△</span>
              <span className="text-white/70">Stud wants to write to a file</span>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-white/50">
                <span className="text-emerald-400">←</span>
                <span>Write to src/server/PlayerData.lua</span>
              </div>
              <div className="mt-2 border-l-2 border-emerald-400/30 pl-3 text-xs text-white/40">
                <div><span className="text-red-400">-</span> MaxPlayers = 50,</div>
                <div><span className="text-emerald-400">+</span> MaxPlayers = 100,</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded bg-[#d29922]/20 px-2.5 py-1 text-xs text-[#d29922]">Allow once</span>
              <span className="rounded bg-white/10 px-2.5 py-1 text-xs text-white/50">Allow always</span>
              <span className="rounded bg-white/10 px-2.5 py-1 text-xs text-white/50">Reject</span>
            </div>
          </div>
        </div>
      </div>

      {/* Permission types */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Permission types</h2>
        <div className="mt-6 space-y-6">
          {/* Allow once */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 items-center rounded-md bg-[#d29922]/10 px-2.5 font-mono text-xs font-medium text-[#d29922]">Allow once</span>
              <h3 className="text-base font-medium text-foreground">One-time approval</h3>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Approves the specific action being requested. Stud will ask again for similar actions in the future. This is the most conservative option.
            </p>
          </div>

          {/* Allow always */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 items-center rounded-md bg-emerald-50 px-2.5 font-mono text-xs font-medium text-emerald-700">Allow always</span>
              <h3 className="text-base font-medium text-foreground">Session-wide approval</h3>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Approves this type of action for the rest of the session. For example, allowing &quot;Write&quot; always means Stud can write files without asking again until you restart.
            </p>
          </div>

          {/* Reject */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 items-center rounded-md bg-red-50 px-2.5 font-mono text-xs font-medium text-red-700">Reject</span>
              <h3 className="text-base font-medium text-foreground">Deny the action</h3>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Blocks the action entirely. Stud will acknowledge the rejection and may suggest an alternative approach that doesn&apos;t require the denied permission.
            </p>
          </div>
        </div>
      </div>

      {/* What requires permission */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">What requires permission?</h2>
        <p className="mt-3 text-base text-foreground/80">
          Not every action requires approval. Stud distinguishes between read-only and write/execute actions:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* No permission needed */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">✓</span>
              No approval needed
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900/70">
              <li className="flex items-center gap-2">
                <span className="font-mono text-emerald-600">→</span> Reading files
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-emerald-600">✱</span> Searching files (Glob / Grep)
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-emerald-600">◆</span> Reading Roblox instances
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-emerald-600">◉</span> Spawning subagents
              </li>
            </ul>
          </div>

          {/* Permission required */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-700">△</span>
              Approval required
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-amber-900/70">
              <li className="flex items-center gap-2">
                <span className="font-mono text-amber-600">←</span> Writing or editing files
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-amber-600">{">_"}</span> Running shell commands
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-amber-600">◆</span> Modifying Roblox instances
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-amber-600">◆</span> Editing scripts in Studio
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best practices */}
      <div className="mt-12 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Best practices</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-md bg-secondary font-mono text-xs text-foreground/50">1</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">Start conservative</h4>
              <p className="mt-1 text-sm text-foreground/70">
                Use &quot;Allow once&quot; until you&apos;re comfortable with how Stud operates. You can always switch to &quot;Allow always&quot; later.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-md bg-secondary font-mono text-xs text-foreground/50">2</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">Review diffs carefully</h4>
              <p className="mt-1 text-sm text-foreground/70">
                Stud shows you exactly what will change before writing. Take a moment to review the diff — it&apos;s your safety net.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-md bg-secondary font-mono text-xs text-foreground/50">3</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">Use git for backup</h4>
              <p className="mt-1 text-sm text-foreground/70">
                Commit your work before starting a Stud session. If anything goes wrong, you can always revert. Stud itself will suggest using git for safety.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="mt-16 rounded-xl border border-border bg-secondary p-6">
        <h3 className="text-base font-semibold text-foreground">Next Steps</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href="/docs/tools" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Tools Reference →</span>
            <p className="mt-1 text-xs text-muted-foreground">See what tools are available</p>
          </a>
          <a href="/docs/roblox" className="rounded-lg border border-border bg-white p-4 transition-colors hover:border-foreground/20">
            <span className="text-sm font-medium text-foreground">Roblox Integration →</span>
            <p className="mt-1 text-xs text-muted-foreground">Tools specific to Roblox Studio</p>
          </a>
        </div>
      </div>
    </div>
  )
}
