import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { colors } from "../constants"

const FADE_DURATION = 15

export const Fade = ({ at }: { at: number }) => {
  const frame = useCurrentFrame()
  const start = at - FADE_DURATION
  const end = at + FADE_DURATION

  if (frame < start || frame > end) return null

  const opacity =
    frame <= at
      ? interpolate(frame, [start, at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(frame, [at, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        opacity,
        zIndex: 50,
      }}
    />
  )
}
