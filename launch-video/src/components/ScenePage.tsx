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
  const opacity = interpolate(frame, [0, hold, hold + fade], [1, 1, 0], {
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
