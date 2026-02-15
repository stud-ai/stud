import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { ActionCard, AppChrome, BasicTool, StepsColumn, StudSpinner, UserMessage } from "../components/AppChrome"
import { ScenePage } from "../components/ScenePage"
import { fonts, springs, ui } from "../constants"

const options = ["Classic Sword", "Ability-Based", "Hybrid", "Surprise me"]
const steps = [
  { title: "Read", subtitle: "game/src/init.luau", delay: 0 },
  { title: "Glob", subtitle: "game/src/**/*.luau", delay: 14 },
  { title: "Read", subtitle: "game/src/combat/...", delay: 30 },
  { title: "Read", subtitle: "game/src/ui/hud.luau", delay: 46 },
  { title: "Write", subtitle: "SwordSystem.luau", delay: 62 },
  { title: "Write", subtitle: "DamageHandler.luau", delay: 78 },
  { title: "Write", subtitle: "CombatManager.luau", delay: 94 },
  { title: "Run", subtitle: "roblox://playtest/classic-sword", delay: 110 },
]

const checks = [
  "Combo chain responds under 80ms",
  "Damage scales with Strength stat",
  "ClassicSword replicated to StarterPack",
]

export const Interaction = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const shell = spring({ fps, frame: frame - 16, config: springs.default })
  const msg = spring({ fps, frame: frame - 30, config: springs.light })
  const plan = spring({ fps, frame: frame - 308, config: springs.default })

  // Zoom into the pills area when options appear, then toward steps
  const zoomPills = interpolate(frame, [96, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoomSteps = interpolate(frame, [206, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoomPlan = interpolate(frame, [302, 368], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoom = 1 + zoomPills * 0.07 + zoomSteps * 0.09 + zoomPlan * 0.06
  const originX = 55 + zoomPlan * 6
  const originY = 30 + zoomSteps * 18 + zoomPlan * 8

  return (
    <AbsoluteFill style={{ backgroundColor: ui.background }}>
      <ScenePage
        line1="No more prompt-and-pray."
        line2="Guide decisions live and build your way."
        size={66}
        bg={ui.background}
        hold={100}
        fade={20}
      />
      <div
        style={{
          opacity: shell,
          transform: `scale(${(0.97 + shell * 0.03) * zoom})`,
          transformOrigin: `${originX}% ${originY}%`,
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
              opacity: spring({ fps, frame: frame - 64, config: springs.light }),
              transform: `translateY(${(1 - spring({ fps, frame: frame - 64, config: springs.light })) * 14}px)`,
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
              const delay = 120 + i * 14
              const s = spring({ fps, frame: frame - delay, config: springs.light })
              const selected = i === 0 && frame > 224
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
          {frame > 220 && (
            <div
              style={{
                opacity: interpolate(frame, [220, 248], [0, 1], {
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
                {frame < 324 ? (
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
                  {frame < 324 ? "Working..." : "8 steps completed"}
                </span>
              </div>

              <StepsColumn>
                {steps.map((step, i) => {
                  const appear = 234 + step.delay
                  if (frame < appear) return null
                  const s = spring({ fps, frame: frame - appear, config: springs.light })
                  const done = frame > appear + 26
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

          {frame > 300 && (
            <div
              style={{
                width: "100%",
                opacity: plan,
                transform: `translateY(${(1 - plan) * 14}px)`,
              }}
            >
              <ActionCard
                title="Playtest Plan"
                subtitle="studio://TestService/ClassicSword"
                status={frame > 360 ? "success" : "pending"}
              >
                <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {checks.map((item, i) => {
                    const ready = frame > 322 + i * 14
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: fonts.inter }}>
                        {ready ? (
                          <svg
                            viewBox="0 0 24 24"
                            width={14}
                            height={14}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth={2.2}
                          >
                            <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <StudSpinner size={12} color={ui.iconInteractive} />
                        )}
                        <span style={{ fontSize: 13, color: ready ? ui.textStrong : ui.textWeak }}>{item}</span>
                      </div>
                    )
                  })}
                </div>
              </ActionCard>
            </div>
          )}
        </AppChrome>
      </div>
    </AbsoluteFill>
  )
}
