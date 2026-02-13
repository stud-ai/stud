import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { colors, fonts, springs } from "../constants"

const commands = ["$ git clone https://github.com/stud-dev/stud", "$ bun install", "$ bun run dev"]

const badges = ["MIT Licensed", "Open Source", "★ 1.2k"]

export const Trust = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cardScale = spring({ fps, frame, config: springs.default })

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Grid />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
                const charDelay = i * 35
                const chars = Math.max(0, Math.floor((frame - 15 - charDelay) * 3))
                if (frame < 15 + charDelay) return null
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
              const delay = 110 + i * 8
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
