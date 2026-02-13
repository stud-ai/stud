import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { colors, fonts, springs } from "../constants"

type Token = { text: string; color: string }
type CodeLine = Token[]

const kw = colors.keyword
const cm = colors.comment
const nm = colors.string
const tx = "#e0ddd7"

const lines: CodeLine[] = [
  [
    { text: "local", color: kw },
    { text: " SwordSystem = {}", color: tx },
  ],
  [],
  [
    { text: "function", color: kw },
    { text: " SwordSystem.attack(player, target)", color: tx },
  ],
  [
    { text: "  ", color: tx },
    { text: "local", color: kw },
    { text: " damage = player.Stats.Strength * ", color: tx },
    { text: "1.5", color: nm },
  ],
  [],
  [{ text: "  target.Humanoid:TakeDamage(damage)", color: tx }],
  [],
  [
    { text: "  ", color: tx },
    { text: "-- Visual feedback", color: cm },
  ],
  [{ text: "  SwordSystem.playEffect(target)", color: tx }],
  [{ text: "  SwordSystem.updateLeaderboard(player)", color: tx }],
  [{ text: "end", color: kw }],
]

const tree = [
  { name: "ServerScriptService", icon: "📁", indent: 0 },
  { name: "SwordSystem", icon: "📜", indent: 1 },
  { name: "StarterPack", icon: "📁", indent: 0 },
  { name: "ClassicSword", icon: "⚔️", indent: 1 },
  { name: "ReplicatedStorage", icon: "📁", indent: 0 },
  { name: "SwordConfig", icon: "📦", indent: 1 },
]

export const Result = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const panelSlide = spring({ fps, frame: frame - 30, config: springs.heavy })
  const treeEntry = spring({ fps, frame: frame - 180, config: springs.default })
  const badgeScale = spring({ fps, frame: frame - 260, config: springs.light })

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Grid />

      <AbsoluteFill style={{ padding: 60, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 16, flex: 1 }}>
          {/* Left: chat area placeholder */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              opacity: interpolate(frame, [0, 30], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              }),
            }}
          >
            <div
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                padding: 24,
                fontFamily: fonts.sans,
                fontSize: 16,
                color: colors.fg,
                lineHeight: 1.5,
              }}
            >
              Your sword combat system is ready! I&apos;ve created the core mechanics with damage calculation, visual
              effects, and a leaderboard that tracks player kills.
            </div>

            {/* Instance tree */}
            {treeEntry > 0.01 && (
              <div
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  border: `1px solid ${colors.border}`,
                  padding: 20,
                  transform: `scale(${treeEntry})`,
                  opacity: treeEntry,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    color: colors.grey,
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Instance Tree
                </div>
                {tree.map((item, i) => {
                  const delay = i * 3
                  const s = spring({ fps, frame: frame - 180 - delay, config: springs.light })
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        paddingLeft: item.indent * 20,
                        marginBottom: 6,
                        fontFamily: fonts.sans,
                        fontSize: 15,
                        color: colors.fg,
                        opacity: s,
                        transform: `translateX(${(1 - s) * 10}px)`,
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: code panel */}
          <div
            style={{
              width: 700,
              backgroundColor: colors.codeBg,
              borderRadius: 16,
              overflow: "hidden",
              transform: `translateX(${(1 - panelSlide) * 500}px)`,
              opacity: panelSlide,
              boxShadow: "0 0 40px rgba(16,185,129,0.08)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #2a2927",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: colors.emerald,
                }}
              />
              <span style={{ fontFamily: fonts.mono, fontSize: 12, color: "#888" }}>SwordSystem.luau</span>
            </div>
            <div style={{ padding: 16, fontFamily: fonts.mono, fontSize: 14, lineHeight: 1.7, flex: 1 }}>
              {lines.map((tokens, i) => {
                const reveal = Math.floor((frame - 20) / 2)
                if (i > reveal) return null
                return (
                  <div key={i} style={{ minHeight: 18 }}>
                    {tokens.length === 0
                      ? "\u00A0"
                      : tokens.map((token, j) => (
                          <span key={j} style={{ color: token.color }}>
                            {token.text}
                          </span>
                        ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Badge */}
        {badgeScale > 0.01 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 16,
              transform: `scale(${badgeScale})`,
            }}
          >
            <div
              style={{
                backgroundColor: colors.emerald,
                color: "white",
                fontFamily: fonts.tech,
                fontSize: 20,
                padding: "14px 32px",
                borderRadius: 100,
                letterSpacing: 1,
              }}
            >
              27+ SPECIALIZED ROBLOX TOOLS
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
