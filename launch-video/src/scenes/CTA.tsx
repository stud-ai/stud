import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { ScenePage } from "../components/ScenePage"
import { colors, fonts, springs } from "../constants"

export const CTA = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeScale = spring({ fps, frame: frame - 116, config: springs.light })
  const urlOpacity = interpolate(frame, [116, 152], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const noteOpacity = interpolate(frame, [154, 190], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const logoOpacity = interpolate(frame, [184, 228], [0, 1], {
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
        line2="Waitlist now at"
        size={86}
        bg={colors.bg}
        hold={118}
        fade={22}
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
            marginBottom: 218,
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
            fontFamily: fonts.inter,
            fontSize: 72,
            color: colors.emerald,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            opacity: urlOpacity,
            transform: `scale(${urlScale})`,
            textShadow: "0 0 30px rgba(16,185,129,0.3)",
          }}
        >
          trystud.me
        </div>

        <div
          style={{
            marginTop: 20,
            padding: "12px 18px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.card,
            fontFamily: fonts.inter,
            fontSize: 20,
            fontWeight: 500,
            color: colors.fg,
            opacity: noteOpacity,
            minWidth: 760,
            textAlign: "center",
          }}
        >
          <span style={{ color: colors.grey }}>Join the waitlist now at </span>
          <span style={{ color: colors.emerald, fontWeight: 700 }}>trystud.me</span>
        </div>

        {/* Logo */}
        <div style={{ marginTop: 44, opacity: logoOpacity }}>
          <Img src={staticFile("logo.png")} style={{ width: 80, height: 80 }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}
