import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { AppChrome, ActionCard, BasicTool, StepsColumn, UserMessage } from "../components/AppChrome"
import { ScenePage } from "../components/ScenePage"
import { colors, fonts, springs, ui } from "../constants"

const kw = "#10b981"
const cm = "#6b7280"
const nm = "#f59e0b"
const tx = "#e0ddd7"

const codeLines = [
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

const verifySteps = [
  { title: "Run", subtitle: "bun run test:combat" },
  { title: "Run", subtitle: "bun run lint:luau" },
  { title: "Write", subtitle: "game/src/combat/ComboSystem.luau" },
  { title: "Write", subtitle: "game/src/combat/ParryWindow.luau" },
]

function WriteIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const Result = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const shell = spring({ fps, frame: frame - 18, config: springs.default })
  const card = spring({ fps, frame: frame - 98, config: springs.default })
  const verify = spring({ fps, frame: frame - 246, config: springs.default })
  const response = spring({ fps, frame: frame - 372, config: springs.light })

  // Zoom into the code block area as it reveals
  const zoomCode = interpolate(frame, [110, 226], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Zoom back out slightly as the response appears
  const zoomOut = interpolate(frame, [354, 434], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoom = 1 + zoomCode * 0.15 - zoomOut * 0.06
  const originX = 55 + zoomCode * 4 - zoomOut * 2
  const originY = 35 + zoomOut * 15

  return (
    <AbsoluteFill style={{ backgroundColor: ui.background }}>
      <ScenePage
        line1="Stud writes full Luau systems."
        line2="Not snippets - real files, real structure."
        size={68}
        bg={ui.background}
        hold={112}
        fade={22}
      />
      <div
        style={{
          opacity: shell,
          transform: `scale(${(0.97 + shell * 0.03) * zoom})`,
          transformOrigin: `${originX}% ${originY}%`,
        }}
      >
        <AppChrome>
          {/* User message (sticky at top) */}
          <UserMessage text="Build me a sword combat system with classic sword fighting" />

          {/* ActionCard: Write SwordSystem.luau */}
          <div
            style={{
              width: "100%",
              opacity: card,
              transform: `translateY(${(1 - card) * 20}px)`,
            }}
          >
            <ActionCard title="Write" subtitle="game/src/combat/SwordSystem.luau" icon={<WriteIcon />} status="success">
              {/* Code preview */}
              <div
                style={{
                  backgroundColor: colors.codeBg,
                  padding: 16,
                  fontFamily: fonts.plex,
                  fontSize: 12,
                  lineHeight: 1.7,
                  maxHeight: 240,
                  overflow: "hidden",
                }}
              >
                {codeLines.map((tokens, i) => {
                  const reveal = Math.floor((frame - 112) / 5.2)
                  if (i > reveal) return null
                  return (
                    <div key={i} style={{ minHeight: 16 }}>
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
            </ActionCard>
          </div>

          {/* Second ActionCard: Write DamageHandler */}
          {frame > 210 && (
            <div
              style={{
                width: "100%",
                opacity: spring({ fps, frame: frame - 210, config: springs.default }),
                transform: `translateY(${(1 - spring({ fps, frame: frame - 210, config: springs.default })) * 20}px)`,
              }}
            >
              <ActionCard
                title="Write"
                subtitle="game/src/combat/DamageHandler.luau"
                icon={<WriteIcon />}
                status={frame > 312 ? "success" : "pending"}
              />
            </div>
          )}

          {frame > 246 && (
            <div
              style={{
                width: "100%",
                opacity: verify,
                transform: `translateY(${(1 - verify) * 16}px)`,
              }}
            >
              <ActionCard
                title="Run"
                subtitle="studio://verification/combat-suite"
                status={frame > 384 ? "success" : "pending"}
              >
                <div style={{ padding: "10px 14px" }}>
                  <StepsColumn style={{ marginLeft: 0, paddingLeft: 12, paddingRight: 0, gap: 8 }}>
                    {verifySteps.map((step, i) => {
                      const delay = 258 + i * 16
                      const done = frame > delay + 24
                      return (
                        <BasicTool
                          key={i}
                          title={step.title}
                          subtitle={step.subtitle}
                          status={done ? "success" : "running"}
                          compact
                        />
                      )
                    })}
                  </StepsColumn>
                </div>
              </ActionCard>
            </div>
          )}

          {/* AI response summary */}
          {response > 0.01 && (
            <div
              style={{
                fontFamily: fonts.inter,
                fontSize: 14,
                lineHeight: "180%",
                color: ui.textStrong,
                fontWeight: 400,
                opacity: response,
                transform: `translateY(${(1 - response) * 14}px)`,
              }}
            >
              Your sword combat system is ready! I generated multiple Luau modules, added combo and parry behavior, then
              ran a playtest verification pass so you can drop it in immediately.
            </div>
          )}

          {/* Edit summary pill */}
          {response > 0.5 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                backgroundColor: ui.surfaceInset,
                border: `1px solid ${ui.borderWeak}`,
                fontFamily: fonts.inter,
                fontSize: 13,
                fontWeight: 500,
                color: ui.textWeak,
                opacity: response,
              }}
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#10b981" strokeWidth={2}>
                <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              4 files written, 428 lines
            </div>
          )}
        </AppChrome>
      </div>
    </AbsoluteFill>
  )
}
