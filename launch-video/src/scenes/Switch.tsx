import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { Grid } from "../components/Grid"
import { ScenePage } from "../components/ScenePage"
import { colors, fonts, springs } from "../constants"

export const Switch = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const shift = 56
  const scene = Math.max(0, frame - shift)

  const pillSlide = spring({ fps, frame: scene - 28, config: springs.default })
  const gridOpacity = interpolate(scene, [70, 112], [0, 0.3], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  const logoScale = spring({ fps, frame: scene - 96, config: springs.default })
  const clickPunch = interpolate(scene, [88, 94, 122], [0, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })
  const stageZoom = 1 + clickPunch * 0.08

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <ScenePage
        line1="One click changes everything."
        line2="Let Stud take over the grind."
        size={80}
        bg={colors.bg}
        hold={84}
        fade={18}
      />
      <Grid opacity={gridOpacity} />

      {/* Toggle */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            transform: `scale(${stageZoom})`,
            transformOrigin: "center center",
          }}
        >
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
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
