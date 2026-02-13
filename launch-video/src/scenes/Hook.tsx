import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { colors, fonts } from "../constants"

export const Hook = () => {
  const frame = useCurrentFrame()
  const text = "Roblox coding is still stuck in 2012."
  const words = text.split(" ")

  const scale = interpolate(frame, [0, 40], [0.97, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  const fadeOut = interpolate(frame, [70, 85], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 96,
          color: colors.fg,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {words.map((word, i) => {
          const delay = i * 4
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          })
          const y = interpolate(frame, [delay, delay + 15], [8, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          })
          return (
            <span
              key={i}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
