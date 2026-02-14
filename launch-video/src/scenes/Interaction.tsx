import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { AppChrome, BasicTool, StepsColumn, StudSpinner, UserMessage } from "../components/AppChrome"
import { ScenePage } from "../components/ScenePage"
import { fonts, springs, ui } from "../constants"

const options = ["Classic Sword", "Ability-Based", "Hybrid", "Surprise me"]
const steps = [
  { title: "Read", subtitle: "game/src/init.luau", delay: 0 },
  { title: "Glob", subtitle: "game/src/**/*.luau", delay: 12 },
  { title: "Read", subtitle: "game/src/combat/...", delay: 26 },
  { title: "Write", subtitle: "SwordSystem.luau", delay: 40 },
  { title: "Write", subtitle: "DamageHandler.luau", delay: 54 },
]

export const Interaction = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const shell = spring({ fps, frame: frame - 10, config: springs.default })
  const msg = spring({ fps, frame: frame - 20, config: springs.light })

  // Zoom into the pills area when options appear, then toward steps
  const zoomPills = interpolate(frame, [70, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoomSteps = interpolate(frame, [165, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoom = 1 + zoomPills * 0.08 + zoomSteps * 0.06
  const originY = 30 + zoomSteps * 20 // shift origin down as steps appear

  return (
    <AbsoluteFill style={{ backgroundColor: ui.background }}>
      <ScenePage
        line1="No more prompt-and-pray."
        line2="Guide decisions live and build your way."
        size={66}
        bg={ui.background}
        hold={72}
        fade={18}
      />
      <div
        style={{
          opacity: shell,
          transform: `scale(${(0.97 + shell * 0.03) * zoom})`,
          transformOrigin: `55% ${originY}%`,
        }}
      >
        <AppChrome>
          {/* User message */}
          <div
            style={{
              opacity: msg,
              transform: `translateY(${(1 - msg) * 14}px)`,
            }}
          >
            <UserMessage text="Build me a sword combat system for my game" />
          </div>

          {/* AI question */}
          <div
            style={{
              opacity: spring({ fps, frame: frame - 40, config: springs.light }),
              transform: `translateY(${(1 - spring({ fps, frame: frame - 40, config: springs.light })) * 14}px)`,
            }}
          >
            <div
              style={{
                fontFamily: fonts.inter,
                fontSize: 14,
                lineHeight: "180%",
                color: ui.textStrong,
                fontWeight: 400,
              }}
            >
              What combat style do you prefer? Classic sword fighting or modern ability-based?
            </div>
          </div>

          {/* Option pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {options.map((opt, i) => {
              const delay = 82 + i * 10
              const s = spring({ fps, frame: frame - delay, config: springs.light })
              const selected = i === 0 && frame > 160
              return (
                <div
                  key={i}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 100,
                    border: `1px solid ${selected ? "#10b981" : ui.borderWeak}`,
                    backgroundColor: selected ? "rgba(16,185,129,0.08)" : ui.surfaceRaised,
                    fontFamily: fonts.inter,
                    fontSize: 13,
                    fontWeight: 500,
                    color: selected ? "#10b981" : ui.text,
                    transform: `scale(${s})`,
                    opacity: s,
                  }}
                >
                  {opt}
                </div>
              )
            })}
          </div>

          {/* Steps column (tool calls) */}
          {frame > 178 && (
            <div
              style={{
                opacity: interpolate(frame, [178, 202], [0, 1], {
                  extrapolateRight: "clamp",
                  extrapolateLeft: "clamp",
                }),
              }}
            >
              {/* Collapsible trigger */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {/* Spinner or check */}
                {frame < 258 ? (
                  <StudSpinner size={14} color={ui.iconInteractive} />
                ) : (
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#10b981" strokeWidth={2}>
                    <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span
                  style={{
                    fontFamily: fonts.inter,
                    fontSize: 13,
                    fontWeight: 500,
                    color: ui.textWeak,
                  }}
                >
                  {frame < 258 ? "Working..." : "5 steps completed"}
                </span>
              </div>

              <StepsColumn>
                {steps.map((step, i) => {
                  const appear = 190 + step.delay
                  if (frame < appear) return null
                  const s = spring({ fps, frame: frame - appear, config: springs.light })
                  const done = frame > appear + 24
                  return (
                    <div
                      key={i}
                      style={{
                        opacity: s,
                        transform: `translateY(${(1 - s) * 10}px)`,
                      }}
                    >
                      <BasicTool
                        title={step.title}
                        subtitle={step.subtitle}
                        status={done ? "success" : "running"}
                        compact
                      />
                    </div>
                  )
                })}
              </StepsColumn>
            </div>
          )}
        </AppChrome>
      </div>
    </AbsoluteFill>
  )
}
