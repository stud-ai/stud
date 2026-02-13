import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { colors, fonts, springs } from "../constants"

const cards = [
  { icon: "📝", label: "Write Luau scripts" },
  { icon: "🔧", label: "Edit instances" },
  { icon: "🔍", label: "Search Toolbox" },
  { icon: "📊", label: "Query DataStores" },
  { icon: "🛡️", label: "Review permissions" },
  { icon: "💬", label: "Send a message" },
]

const prompt = "Build a sword combat system with damage, effects, and a leaderboard"

export const Features = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const containerScale = spring({ fps, frame, config: springs.default })

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Grid />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1400,
            backgroundColor: colors.container,
            borderRadius: 32,
            border: `1px solid ${colors.border}`,
            padding: 32,
            boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
            transform: `scale(${containerScale})`,
          }}
        >
          {/* Card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {cards.map((card, i) => {
              const delay = 20 + i * 3
              const s = spring({ fps, frame: frame - delay, config: springs.default })
              const highlighted = i === 5
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: highlighted ? "#efeee8" : colors.card,
                    borderRadius: 16,
                    border: `1px solid ${colors.border}`,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transform: `scale(${s}) translateY(${(1 - s) * 20}px)`,
                    opacity: s,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {card.icon}
                  </div>
                  <span style={{ fontFamily: fonts.sans, fontSize: 16, color: colors.fg }}>{card.label}</span>
                </div>
              )
            })}
          </div>

          {/* Prompt input */}
          {frame > 100 && (
            <div
              style={{
                marginTop: 24,
                padding: "16px 20px",
                backgroundColor: colors.card,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
              }}
            >
              <span style={{ fontFamily: fonts.mono, fontSize: 16, color: colors.fg }}>
                {prompt.slice(0, Math.floor((frame - 100) / 1))}
              </span>
              {frame % 30 < 15 && <span style={{ color: colors.emerald, fontFamily: fonts.mono }}>|</span>}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
