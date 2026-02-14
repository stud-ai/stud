import { Img, staticFile } from "remotion"
import { fonts, ui } from "../constants"
import type { CSSProperties, ReactNode } from "react"

const inter = fonts.inter
const plex = fonts.plex

// ── Sidebar thread items ──
const threads = [
  { title: "Medieval village builder", active: false },
  { title: "Add sword combat system", active: true },
  { title: "Fix lighting on spawn area", active: false },
  { title: "Leaderboard UI refactor", active: false },
]

// ── Instance tree items ──
const tree = [
  { name: "Workspace", icon: "workspace", depth: 0, open: true },
  { name: "Baseplate", icon: "part", depth: 1 },
  { name: "SpawnLocation", icon: "part", depth: 1 },
  { name: "ServerScriptService", icon: "folder", depth: 0, open: true },
  { name: "SwordSystem", icon: "script", depth: 1 },
  { name: "StarterPack", icon: "folder", depth: 0, open: true },
  { name: "ClassicSword", icon: "tool", depth: 1 },
  { name: "ReplicatedStorage", icon: "folder", depth: 0 },
]

function TreeIcon({ type }: { type: string }) {
  const size = 14
  const map: Record<string, { color: string; letter: string }> = {
    workspace: { color: "#4a9eff", letter: "W" },
    folder: { color: "#e6a020", letter: "F" },
    script: { color: "#4a9eff", letter: "S" },
    part: { color: "#8e8b8b", letter: "P" },
    tool: { color: "#e05050", letter: "T" },
  }
  const m = map[type] ?? map.part
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 3,
        backgroundColor: m.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 8,
        fontWeight: 700,
        color: "white",
        fontFamily: inter,
        flexShrink: 0,
      }}
    >
      {m.letter}
    </div>
  )
}

function SidebarIcon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={ui.iconBase} strokeWidth={1.8}>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * AppChrome: the full Stud desktop app shell
 * - Titlebar (40px, traffic lights, breadcrumb)
 * - Left sidebar (240px, threads + instance tree)
 * - Center session area (flex 1, max-width 720px messages)
 * - Floating prompt dock at bottom
 *
 * The `children` render inside the chat message area.
 */
export function AppChrome({
  children,
  prompt,
  typing,
  scale = 1,
}: {
  children: ReactNode
  prompt?: string
  typing?: number
  scale?: number
}) {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        backgroundColor: ui.background,
        fontFamily: inter,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        overflow: "hidden",
      }}
    >
      {/* ── Titlebar ── */}
      <div
        style={{
          height: 40,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          backgroundColor: ui.background,
          padding: "0 12px",
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 8, paddingLeft: 8, width: 72 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#28c840" }} />
        </div>

        {/* Sidebar toggle */}
        <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SidebarIcon d="M3 4h18M3 12h18M3 20h18" size={14} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Center command palette */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 320,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${ui.borderWeak}`,
            backgroundColor: ui.surfaceRaised,
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: 6,
          }}
        >
          <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke={ui.textWeak} strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 12, color: ui.textWeak, fontWeight: 400 }}>Search or type a command...</span>
        </div>

        <div style={{ flex: 1 }} />
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* ── Left Sidebar ── */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            backgroundColor: ui.background,
            borderRight: `1px solid ${ui.borderWeak}`,
          }}
        >
          {/* Nav buttons */}
          <div style={{ padding: "12px 8px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
            <NavButton
              icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
              label="Home"
            />
            <NavButton
              icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              label="Project Rules"
            />
          </div>

          {/* Threads section */}
          <div style={{ padding: "8px 12px 4px", marginTop: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: ui.textSubtle,
                textTransform: "uppercase" as const,
                letterSpacing: 1,
              }}
            >
              Threads
            </span>
          </div>
          <div style={{ flex: 1, overflow: "hidden", padding: "0 8px" }}>
            {threads.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 4,
                  backgroundColor: t.active ? ui.surfaceHover : "transparent",
                  marginBottom: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: t.active ? 500 : 400,
                    color: t.active ? ui.textStrong : ui.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>

          {/* Explorer / Instance tree */}
          <div style={{ borderTop: `1px solid ${ui.borderWeak}` }}>
            <div style={{ padding: "8px 12px 4px" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: ui.textSubtle,
                  textTransform: "uppercase" as const,
                  letterSpacing: 1,
                }}
              >
                Explorer
              </span>
            </div>
            <div style={{ padding: "0 4px 8px", maxHeight: 220, overflow: "hidden" }}>
              {tree.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: 8 + item.depth * 16,
                    paddingTop: 3,
                    paddingBottom: 3,
                  }}
                >
                  {item.open !== undefined && (
                    <svg viewBox="0 0 8 8" width={8} height={8} fill={ui.textWeak}>
                      <path d={item.open ? "M1 2l3 3 3-3" : "M2 1l3 3-3 3"} />
                    </svg>
                  )}
                  <TreeIcon type={item.icon} />
                  <span
                    style={{
                      fontSize: 12,
                      color: ui.text,
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              padding: 12,
              borderTop: `1px solid ${ui.borderWeak}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Img src={staticFile("logo.png")} style={{ width: 20, height: 20, borderRadius: 4 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: ui.text }}>My Game</span>
              <span style={{ fontSize: 10, color: ui.textSubtle }}>v0.4.2</span>
            </div>
          </div>
        </div>

        {/* ── Center session area ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            position: "relative",
          }}
        >
          {/* Session title */}
          <div
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              maxWidth: 800,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500, color: ui.textStrong }}>Add sword combat system</span>
          </div>

          {/* Scroll area with messages */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 720,
                margin: "0 auto",
                padding: "2px 24px 200px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {children}
            </div>

            {/* Prompt dock gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
                background: `linear-gradient(to top, ${ui.backgroundStronger}, ${ui.backgroundStronger} 60%, transparent)`,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 24,
              }}
            >
              {/* Prompt input */}
              <div
                style={{
                  width: 560,
                  backgroundColor: ui.surfaceRaised,
                  borderRadius: 14,
                  boxShadow: `0 0 0 1px ${ui.borderWeak}, 0 2px 8px rgba(0,0,0,0.04)`,
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
                <div style={{ padding: "12px 48px 12px 12px", minHeight: 20 }}>
                  <span style={{ fontSize: 14, color: prompt ? ui.textStrong : ui.textWeak, fontWeight: 400 }}>
                    {prompt ? prompt.slice(0, typing ?? prompt.length) : "What do you want to build?"}
                    {prompt && typing !== undefined && typing < prompt.length && (
                      <span style={{ color: "#10b981" }}>|</span>
                    )}
                  </span>
                </div>
                <div
                  style={{
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Pill label="auto" />
                    <Pill label="claude-4-opus" />
                  </div>
                  <div
                    style={{
                      width: 24,
                      height: 18,
                      borderRadius: 5,
                      backgroundColor: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="white" strokeWidth={2.5}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 10px",
        borderRadius: 4,
      }}
    >
      <SidebarIcon d={icon} size={16} />
      <span style={{ fontSize: 13, fontWeight: 500, color: ui.text }}>{label}</span>
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 500,
        color: ui.textWeak,
        fontFamily: fonts.plex,
      }}
    >
      {label}
    </div>
  )
}

// ── Shared sub-components for scenes ──

export function UserMessage({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: ui.radius.lg,
        backgroundColor: ui.surfaceInset,
        border: `1px solid ${ui.borderWeak}`,
        fontFamily: inter,
        fontSize: 14,
        lineHeight: "180%",
        color: ui.textStrong,
        fontWeight: 400,
        ...style,
      }}
    >
      {text}
    </div>
  )
}

export function ActionCard({
  title,
  subtitle,
  icon,
  status = "success",
  children,
  style,
}: {
  title: string
  subtitle: string
  icon?: ReactNode
  status?: "success" | "pending" | "error"
  children?: ReactNode
  style?: CSSProperties
}) {
  const dot = status === "success" ? "#7dd676" : status === "pending" ? "#f5a623" : "#ef4444"
  return (
    <div
      style={{
        borderRadius: ui.radius.lg,
        backgroundColor: ui.surfaceRaised,
        border: `1px solid ${ui.borderWeak}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.02)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
        }}
      >
        {/* Icon */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(145deg, ${ui.surfaceInset} 0%, ${ui.surfaceInset} 100%)`,
              border: `1px solid ${ui.borderWeak}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ui.iconBase,
            }}
          >
            {icon ?? <SearchIcon />}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: dot,
              border: `1.5px solid ${ui.surfaceRaised}`,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
          <div
            style={{
              color: ui.textStrong,
              fontFamily: inter,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: ui.textWeak,
              fontFamily: plex,
              fontSize: 12,
              lineHeight: "16px",
              whiteSpace: "nowrap" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      {/* Body */}
      {children && (
        <div
          style={{
            borderTop: `1px solid ${ui.borderWeak}`,
            backgroundColor: ui.surfaceInset,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function BasicTool({
  title,
  subtitle,
  status = "success",
  compact = true,
}: {
  title: string
  subtitle: string
  status?: "success" | "pending"
  compact?: boolean
}) {
  const size = compact ? 22 : 28
  const dot = status === "success" ? "#7dd676" : "#f5a623"
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 8 : 10,
        padding: compact ? "2px 0" : "4px 0",
        width: "100%",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: compact ? 6 : 8,
            background: `linear-gradient(145deg, ${ui.surfaceInset} 0%, ${ui.surfaceInset} 100%)`,
            border: `1px solid ${ui.borderWeak}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ui.iconWeak,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={compact ? 12 : 14}
            height={compact ? 12 : 14}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dot,
            border: `1.5px solid ${ui.surfaceRaised}`,
          }}
        />
      </div>

      <span
        style={{
          fontFamily: inter,
          fontSize: compact ? 12 : 13,
          fontWeight: 500,
          color: ui.text,
        }}
      >
        {title}
      </span>

      <span
        style={{
          fontFamily: plex,
          fontSize: compact ? 10 : 11,
          color: ui.textWeak,
          padding: "2px 8px",
          borderRadius: 4,
          backgroundColor: ui.surfaceInset,
        }}
      >
        {subtitle}
      </span>
    </div>
  )
}

export function StepsColumn({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginLeft: 12,
        paddingLeft: 12,
        paddingRight: 12,
        borderLeft: `1px solid ${ui.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4.2-4.2" strokeLinecap="round" />
    </svg>
  )
}
