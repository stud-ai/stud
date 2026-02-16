import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react"

const rows = [
  { depth: 0, name: "src", kind: "dir", open: true },
  { depth: 1, name: "server", kind: "dir", open: true },
  { depth: 2, name: "matchmaking.lua", kind: "file" },
  { depth: 2, name: "queue-manager.lua", kind: "file" },
  { depth: 1, name: "client", kind: "dir", open: true },
  { depth: 2, name: "hud-controller.lua", kind: "file" },
  { depth: 2, name: "ui-theme.lua", kind: "file" },
  { depth: 1, name: "shared", kind: "dir", open: false },
]

export default function FileTree() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white/65 backdrop-blur-sm">
      <div className="border-border/80 bg-tertiary border-b px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
        Project Tree
      </div>
      <div className="space-y-0.5 px-2 py-2">
        {rows.map((row) => (
          <div key={`${row.depth}-${row.name}`} className="flex items-center rounded-md px-2 py-1.5 text-sm text-foreground/75 hover:bg-secondary/70">
            <span style={{ width: row.depth * 16 }} />
            {row.kind === "dir" ? (
              <>
                {row.open ? <ChevronDown className="mr-1 h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="mr-1 h-3.5 w-3.5 text-muted-foreground" />}
                <Folder className="mr-2 h-3.5 w-3.5 text-amber-500/80" />
              </>
            ) : (
              <>
                <span className="mr-1 h-3.5 w-3.5" />
                <FileText className="mr-2 h-3.5 w-3.5 text-sky-500/80" />
              </>
            )}
            <span className="truncate">{row.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
