import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { ScenePage } from "../components/ScenePage"
import { colors, fonts, springs } from "../constants"

export const CTA = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeScale = spring({ fps, frame: frame - 88, config: springs.light })
  const urlOpacity = interpolate(frame, [82, 112], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const logoOpacity = interpolate(frame, [132, 166], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const pulse = 1 + 0.03 * Math.sin(frame * 0.06)
  const urlScale = interpolate(urlOpacity, [0, 1], [1, pulse], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScenePage
        line1="Ship faster. Ship better."
        line2="Build with Stud at"
        size={86}
        bg={colors.bg}
        hold={80}
        fade={18}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* Badge */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            opacity: badgeScale,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 100,
            border: `1px solid ${colors.fg}`,
            marginBottom: 260,
          }}
        >
          <span style={{ fontSize: 16 }}>🍈</span>
          <span
            style={{
              fontFamily: fonts.tech,
              fontSize: 11,
              color: colors.fg,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            OPEN SOURCE AI CODING ASSISTANT
          </span>
        </div>

        {/* URL */}
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 38,
            color: colors.emerald,
            fontWeight: 500,
            opacity: urlOpacity,
            transform: `scale(${urlScale})`,
            textShadow: "0 0 30px rgba(16,185,129,0.3)",
          }}
        >
          trystud.me
        </div>

        {/* Logo */}
        <div style={{ marginTop: 60, opacity: logoOpacity }}>
          <Img src={staticFile("logo.png")} style={{ width: 80, height: 80 }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}
