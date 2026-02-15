import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { ScenePage } from "../components/ScenePage"
import { colors, fonts, springs } from "../constants"

const commands = ["$ git clone https://github.com/stud-ai/stud", "$ bun install", "$ bun run test", "$ bun run dev"]

const badges = ["MIT Licensed", "Open Source", "★ 1.2k"]

export const Trust = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cardScale = spring({ fps, frame: frame - 22, config: springs.default })
  const zoomTerminal = interpolate(frame, [62, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoomBadges = interpolate(frame, [132, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoom = 1 + zoomTerminal * 0.08 - zoomBadges * 0.04

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <ScenePage
        line1="Open source. Transparent. Yours."
        line2="No black box. No lock-in."
        size={80}
        bg={colors.bg}
        hold={94}
        fade={18}
      />
      <Grid />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            transform: `scale(${zoom})`,
            transformOrigin: "center 38%",
          }}
        >
          {/* Terminal */}
          <div
            style={{
              width: 1400,
              backgroundColor: colors.codeBg,
              borderRadius: 16,
              overflow: "hidden",
              transform: `scale(${cardScale})`,
              boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #2a2927",
                display: "flex",
                gap: 8,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f57" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#febc2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#28c840" }} />
            </div>
            <div style={{ padding: 24 }}>
              {commands.map((cmd, i) => {
                const charDelay = i * 58
                const chars = Math.max(0, Math.floor((frame - 24 - charDelay) * 1.9))
                if (frame < 24 + charDelay) return null
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 16,
                      color: i === 0 ? colors.emerald : "#e0ddd7",
                      marginBottom: 8,
                      lineHeight: 1.6,
                    }}
                  >
                    {cmd.slice(0, chars)}
                    {chars < cmd.length && frame % 30 < 15 && <span style={{ color: colors.emerald }}>▌</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 12 }}>
            {badges.map((badge, i) => {
              const delay = 172 + i * 18
              const s = spring({ fps, frame: frame - delay, config: springs.light })
              return (
                <div
                  key={i}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 100,
                    border: `1px solid ${colors.fg}`,
                    fontFamily: fonts.sans,
                    fontSize: 14,
                    color: colors.fg,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    transform: `scale(${s})`,
                    opacity: s,
                  }}
                >
                  {badge}
                </div>
              )
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
