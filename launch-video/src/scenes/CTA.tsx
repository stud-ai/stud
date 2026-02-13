import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { colors, fonts, springs } from "../constants"

export const CTA = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeScale = spring({ fps, frame: frame - 5, config: springs.light })
  const headlineOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const headlineY = interpolate(frame, [20, 35], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const urlOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const logoOpacity = interpolate(frame, [65, 80], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const pulse = 1 + 0.03 * Math.sin(frame * 0.08)
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
            marginBottom: 32,
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

        {/* Headline */}
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 64,
            color: colors.fg,
            textAlign: "center",
            maxWidth: 1200,
            lineHeight: 1.3,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            marginBottom: 24,
          }}
        >
          Ship your next Roblox update with Stud.
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
          stud.games
        </div>

        {/* Logo */}
        <div style={{ marginTop: 60, opacity: logoOpacity }}>
          <Img src={staticFile("logo.png")} style={{ width: 80, height: 80 }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}
