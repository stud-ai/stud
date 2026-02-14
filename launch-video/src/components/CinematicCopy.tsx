import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { colors, fonts } from "../constants"

export const CinematicCopy = ({
  line1,
  line2,
  start = 0,
  fadeOutStart = 9999,
  fadeOutEnd = 10020,
  top,
  size = 64,
}: {
  line1: string
  line2: string
  start?: number
  fadeOutStart?: number
  fadeOutEnd?: number
  top?: number
  size?: number
}) => {
  const frame = useCurrentFrame()
  const words1 = line1.split(" ")
  const words2 = line2.split(" ")

  const scale = interpolate(frame, [start, start + 40], [0.97, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  })

  const fadeOut =
    frame < fadeOutStart
      ? 1
      : interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        })

  const line2Start = start + words1.length * 4 + 8

  const row = (words: string[], offset: number, color: string) => {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 14,
          color,
        }}
      >
        {words.map((word, i) => {
          const delay = offset + i * 4
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
              key={`${word}-${i}`}
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
    )
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: top === undefined ? "center" : "flex-start",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <div
        style={{
          marginTop: top ?? 0,
          maxWidth: 1200,
          textAlign: "center",
          lineHeight: 1.18,
          fontFamily: fonts.display,
          fontSize: size,
          transform: `scale(${scale})`,
          opacity: fadeOut,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {row(words1, start, colors.fg)}
        {row(words2, line2Start, colors.grey)}
      </div>
    </AbsoluteFill>
  )
}
