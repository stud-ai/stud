import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { colors, fonts, springs } from "../constants"

export const Switch = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const pillSlide = spring({ fps, frame: frame - 15, config: springs.default })
  const gridOpacity = interpolate(frame, [45, 70], [0, 0.3], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  const logoScale = spring({ fps, frame: frame - 45, config: springs.default })
  const headlineOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const headlineY = interpolate(frame, [60, 75], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Grid opacity={gridOpacity} />

      {/* Toggle */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#f2f2eb",
              borderRadius: 100,
              border: "1px solid #e6e6df",
              padding: 4,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 4,
                left: `${4 + pillSlide * 200}px`,
                width: 200,
                height: 48,
                backgroundColor: colors.card,
                borderRadius: 100,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            />
            <div
              style={{
                width: 200,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.sans,
                fontSize: 18,
                color: pillSlide > 0.5 ? colors.grey : colors.fg,
                position: "relative",
                zIndex: 1,
              }}
            >
              Roblox Studio
            </div>
            <div
              style={{
                width: 200,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 600,
                color: pillSlide > 0.5 ? colors.fg : colors.grey,
                position: "relative",
                zIndex: 1,
              }}
            >
              Stud
            </div>
          </div>

          {/* Logo */}
          <div style={{ transform: `scale(${logoScale})`, opacity: logoScale }}>
            <Img src={staticFile("logo.png")} style={{ width: 80, height: 80 }} />
          </div>

          {/* Headline */}
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 60,
              color: colors.fg,
              opacity: headlineOpacity,
              transform: `translateY(${headlineY}px)`,
            }}
          >
            Let&apos;s build something.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
