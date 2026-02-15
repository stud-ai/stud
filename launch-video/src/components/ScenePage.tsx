import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { CinematicCopy } from "./CinematicCopy"

export const ScenePage = ({
  line1,
  line2,
  size = 70,
  bg,
  hold = 52,
  fade = 18,
}: {
  line1: string
  line2: string
  size?: number
  bg: string
  hold?: number
  fade?: number
}) => {
  const frame = useCurrentFrame()
  const words1 = line1.trim().split(/\s+/).filter(Boolean).length
  const words2 = line2.trim().split(/\s+/).filter(Boolean).length
  const minHold = words1 * 5 + 12 + Math.max(0, words2 - 1) * 5 + 18 + 10
  const holdAt = Math.max(hold, minHold)

  const opacity = interpolate(frame, [0, holdAt, holdAt + fade], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        opacity,
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      <CinematicCopy line1={line1} line2={line2} size={size} start={0} fadeOutStart={9999} />
    </AbsoluteFill>
  )
}
