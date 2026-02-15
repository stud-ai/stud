import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { BasicTool } from "../components/AppChrome"
import { ScenePage } from "../components/ScenePage"
import { fonts, springs, ui } from "../constants"

const items = [
  { name: "Workspace", icon: "workspace", depth: 0, open: true },
  { name: "Baseplate", icon: "part", depth: 1 },
  { name: "SpawnLocation", icon: "spawn", depth: 1 },
  { name: "Map", icon: "folder", depth: 1, open: true },
  { name: "MedievalVillage", icon: "model", depth: 2, open: true },
  { name: "TownCenter", icon: "part", depth: 3 },
  { name: "MarketStall", icon: "part", depth: 3 },
  { name: "VillagerHouse", icon: "model", depth: 3 },
  { name: "WellFountain", icon: "part", depth: 3 },
  { name: "ServerScriptService", icon: "folder", depth: 0, open: true },
  { name: "SwordSystem", icon: "script", depth: 1 },
  { name: "DamageHandler", icon: "script", depth: 1 },
  { name: "CombatManager", icon: "script", depth: 1 },
  { name: "StarterPack", icon: "folder", depth: 0, open: true },
  { name: "ClassicSword", icon: "tool", depth: 1 },
  { name: "HealthPotion", icon: "tool", depth: 1 },
  { name: "ReplicatedStorage", icon: "folder", depth: 0 },
  { name: "Lighting", icon: "lighting", depth: 0 },
]

const updates = [
  { title: "Insert", subtitle: "Workspace/Map/MedievalVillage" },
  { title: "Write", subtitle: "ServerScriptService/SwordSystem" },
  { title: "Write", subtitle: "ServerScriptService/DamageHandler" },
  { title: "Update", subtitle: "StarterPack/ClassicSword" },
  { title: "Write", subtitle: "ReplicatedStorage/CombatEvents" },
  { title: "Run", subtitle: "workspace://rebuild-navmesh" },
  { title: "Run", subtitle: "studio://playtest/sword-combat" },
]

const palette: Record<string, { color: string; letter: string }> = {
  workspace: { color: "#4a9eff", letter: "W" },
  folder: { color: "#e6a020", letter: "F" },
  script: { color: "#4a9eff", letter: "S" },
  part: { color: "#8e8b8b", letter: "P" },
  model: { color: "#a855f7", letter: "M" },
  tool: { color: "#e05050", letter: "T" },
  spawn: { color: "#22c55e", letter: "S" },
  lighting: { color: "#facc15", letter: "L" },
}

function TreeIcon({ type }: { type: string }) {
  const m = palette[type] ?? palette.part
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 5,
        backgroundColor: m.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        color: "white",
        fontFamily: fonts.inter,
        flexShrink: 0,
      }}
    >
      {m.letter}
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 8 8" width={10} height={10} fill={ui.textWeak}>
      <path d={open ? "M1 2l3 3 3-3" : "M2 1l3 3-3 3"} />
    </svg>
  )
}

export const Explorer = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const card = spring({ fps, frame: frame - 14, config: springs.default })
  const zoomTree = interpolate(frame, [62, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoomChanges = interpolate(frame, [144, 214], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoom = 1 + zoomTree * 0.06 + zoomChanges * 0.07
  const originX = 45 + zoomChanges * 16
  const originY = 34 + zoomChanges * 10
  const recap = spring({ fps, frame: frame - 194, config: springs.light })

  return (
    <AbsoluteFill style={{ backgroundColor: ui.background, justifyContent: "center", alignItems: "center" }}>
      <ScenePage
        line1="Watch Explorer update in real time."
        line2="Your world changes as you decide."
        size={74}
        bg={ui.background}
        hold={102}
        fade={20}
      />
      <div
        style={{
          display: "flex",
          gap: 20,
          transform: `scale(${(0.95 + card * 0.05) * zoom})`,
          transformOrigin: `${originX}% ${originY}%`,
          opacity: card,
        }}
      >
        <div
          style={{
            width: 580,
            backgroundColor: ui.surfaceRaised,
            borderRadius: 16,
            border: `1px solid ${ui.borderWeak}`,
            boxShadow: "0 25px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${ui.borderWeak}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={ui.textWeak} strokeWidth={1.8}>
              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: fonts.inter,
                fontSize: 13,
                fontWeight: 600,
                color: ui.textStrong,
                letterSpacing: "-0.01em",
              }}
            >
              Explorer
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: fonts.plex, fontSize: 11, color: ui.textSubtle }}>My Game</span>
          </div>

          <div style={{ padding: "8px 8px 16px" }}>
            {items.map((item, i) => {
              const delay = 25 + i * 7
              const s = spring({ fps, frame: frame - delay, config: springs.light })
              const selected = i === 4 && frame > 120
              const highlight = interpolate(frame, [120, 145], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 12 + item.depth * 20,
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingRight: 12,
                    borderRadius: 6,
                    backgroundColor: selected ? `rgba(16,185,129,${0.06 * highlight})` : "transparent",
                    opacity: s,
                    transform: `translateX(${(1 - s) * -12}px)`,
                  }}
                >
                  {item.open !== undefined && <Chevron open={item.open} />}
                  {item.open === undefined && <div style={{ width: 10 }} />}
                  <TreeIcon type={item.icon} />
                  <span
                    style={{
                      fontFamily: fonts.inter,
                      fontSize: 14,
                      fontWeight: selected ? 500 : 400,
                      color: selected ? "#059669" : ui.textStrong,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          style={{
            width: 420,
            backgroundColor: ui.surfaceRaised,
            borderRadius: 16,
            border: `1px solid ${ui.borderWeak}`,
            boxShadow: "0 25px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${ui.borderWeak}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: fonts.inter,
              fontSize: 13,
              fontWeight: 600,
              color: ui.textStrong,
            }}
          >
            <span>Live Changes</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: `1px solid ${ui.borderWeak}`,
                  fontFamily: fonts.plex,
                  fontSize: 10,
                  color: ui.textWeak,
                  fontWeight: 400,
                }}
              >
                {updates.length} actions
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: `1px solid ${ui.borderSuccess}`,
                  backgroundColor: ui.surfaceSuccessWeak,
                  fontFamily: fonts.inter,
                  fontSize: 10,
                  color: "#059669",
                  fontWeight: 600,
                }}
              >
                playtest passed
              </span>
            </div>
          </div>
          <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {updates.map((item, i) => {
              const delay = 92 + i * 14
              const show = spring({ fps, frame: frame - delay, config: springs.light })
              const done = frame > delay + 22
              return (
                <div
                  key={i}
                  style={{
                    opacity: show,
                    transform: `translateY(${(1 - show) * 12}px)`,
                  }}
                >
                  <BasicTool
                    title={item.title}
                    subtitle={item.subtitle}
                    status={done ? "success" : "running"}
                    compact={false}
                  />
                </div>
              )
            })}

            <div
              style={{
                marginTop: 2,
                borderRadius: 8,
                border: `1px solid ${ui.borderWeak}`,
                backgroundColor: ui.surfaceInset,
                padding: "10px 12px",
                opacity: recap,
                transform: `translateY(${(1 - recap) * 8}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.plex,
                  fontSize: 10,
                  color: ui.textSubtle,
                  marginBottom: 6,
                }}
              >
                RECENT OUTPUT
              </div>
              <div
                style={{
                  fontFamily: fonts.inter,
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: ui.textStrong,
                }}
              >
                ClassicSword synced to StarterPack and combat scripts validated for publish.
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: `1px solid ${ui.borderWeak}`,
              padding: "10px 14px",
              fontFamily: fonts.plex,
              fontSize: 11,
              color: ui.textWeak,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Objects inserted: 11</span>
            <span style={{ color: "#059669" }}>Synced 2s ago</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
