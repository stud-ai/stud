import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { colors, fonts, springs } from "../constants"

const options = ["Classic Sword", "Ability-Based", "Hybrid", "Surprise me"]
const steps = [
  "Reading your codebase...",
  "Generating SwordSystem.luau...",
  "Adding damage handler...",
  "Connecting to StarterPack...",
  "Setting up leaderboard...",
]

export const Interaction = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const bubbleY = spring({ fps, frame: frame - 20, config: springs.default })

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Grid />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 1400, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Chat bubble */}
          <div
            style={{
              transform: `translateY(${(1 - bubbleY) * 30}px)`,
              opacity: bubbleY,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: colors.container,
                  border: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                🍈
              </div>
              <div
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  border: `1px solid ${colors.border}`,
                  padding: "20px 24px",
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  color: colors.fg,
                  lineHeight: 1.5,
                }}
              >
                What combat style? Classic sword fighter or modern ability-based?
              </div>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingLeft: 48 }}>
            {options.map((opt, i) => {
              const delay = 60 + i * 5
              const s = spring({ fps, frame: frame - delay, config: springs.light })
              const selected = i === 0 && frame > 130
              return (
                <div
                  key={i}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 100,
                    border: `2px solid ${selected ? colors.emerald : colors.border}`,
                    backgroundColor: selected ? `${colors.emerald}10` : colors.card,
                    fontFamily: fonts.sans,
                    fontSize: 16,
                    color: selected ? colors.emerald : colors.fg,
                    transform: `scale(${s})`,
                    opacity: s,
                  }}
                >
                  {opt}
                </div>
              )
            })}
          </div>

          {/* Progress checklist */}
          {frame > 160 && (
            <div
              style={{
                paddingLeft: 48,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.display,
                  fontStyle: "italic",
                  fontSize: 16,
                  color: colors.grey,
                  opacity: interpolate(frame, [160, 175], [0, 1], {
                    extrapolateRight: "clamp",
                    extrapolateLeft: "clamp",
                  }),
                }}
              >
                Building plan...
              </div>
              {steps.map((step, i) => {
                const appear = 175 + i * 20
                const checked = frame > appear + 18
                const opacity = interpolate(frame, [appear, appear + 20], [0, 1], {
                  extrapolateRight: "clamp",
                  extrapolateLeft: "clamp",
                })
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      opacity,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: checked ? colors.emerald : `${colors.emerald}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "white",
                      }}
                    >
                      {checked ? "✓" : ""}
                    </div>
                    <span style={{ fontFamily: fonts.sans, fontSize: 16, color: colors.fg }}>{step}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
