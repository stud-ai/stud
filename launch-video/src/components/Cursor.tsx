import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion"
import { colors } from "../constants"

type CursorType = "arrow" | "pointer" | "text"
export type Keyframe = { frame: number; x: number; y: number; click?: boolean; cursor?: CursorType }

const SIZE = 64

const files: Record<CursorType, string> = {
  arrow: staticFile("cursors/default.svg"),
  pointer: staticFile("cursors/handpointing.svg"),
  text: staticFile("cursors/ibeam.svg"),
}

// Smoothstep easing with parabolic arc offset to simulate natural hand movement
function arc(from: Keyframe, to: Keyframe, frame: number) {
  const t = interpolate(frame, [from.frame, to.frame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const eased = t * t * (3 - 2 * t)
  const x = from.x + (to.x - from.x) * eased
  const dist = Math.abs(to.x - from.x) + Math.abs(to.y - from.y)
  const arcHeight = Math.min(dist * 0.15, 40)
  // 4t(1-t) parabola peaks at midpoint, creating upward arc between positions
  const y = from.y + (to.y - from.y) * eased - arcHeight * 4 * eased * (1 - eased)
  return { x, y }
}

function getType(keyframes: Keyframe[], i: number) {
  const self = keyframes[i].cursor
  if (self) return self
  const prev = keyframes
    .slice(0, i)
    .reverse()
    .find((k) => k.cursor)?.cursor
  return prev ?? "arrow"
}

export const Cursor = ({ keyframes }: { keyframes: Keyframe[] }) => {
  const frame = useCurrentFrame()

  if (keyframes.length === 0) return null

  const first = keyframes[0]
  const last = keyframes[keyframes.length - 1]

  if (frame < first.frame - 10 || frame > last.frame + 60) return null

  const entrance = interpolate(frame, [first.frame - 10, first.frame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const i = keyframes.findIndex(
    (k, idx) => idx < keyframes.length - 1 && frame >= k.frame && frame <= keyframes[idx + 1].frame,
  )
  const past = keyframes.filter((k) => frame >= k.frame)
  const lastPos = past[past.length - 1] ?? first
  const pos = i === -1 ? { x: lastPos.x, y: lastPos.y } : arc(keyframes[i], keyframes[i + 1], frame)

  const clicks = keyframes.filter((k) => k.click && frame >= k.frame && frame < k.frame + 30)
  const activeClick = clicks.length > 0 ? clicks[clicks.length - 1] : null

  const scale =
    activeClick && (frame - activeClick.frame) / 10 < 1
      ? 1 - 0.08 * Math.sin(((frame - activeClick.frame) / 10) * Math.PI)
      : 1

  const typed = keyframes.map((k, idx) => ({ frame: k.frame, type: getType(keyframes, idx) }))
  const j = typed.findIndex(
    (k, idx) => idx > 0 && typed[idx - 1].type !== k.type && frame >= k.frame - 6 && frame <= k.frame + 6,
  )
  const mix =
    j === -1
      ? 1
      : interpolate(frame, [typed[j].frame - 6, typed[j].frame + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
  const type = typed.filter((k) => k.frame <= frame).at(-1)?.type ?? "arrow"
  const from = j === -1 ? type : typed[j - 1].type
  const to = j === -1 ? type : typed[j].type

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {activeClick &&
        (() => {
          const elapsed = frame - activeClick.frame
          const rippleScale = interpolate(elapsed, [0, 20], [0, 1], { extrapolateRight: "clamp" })
          const rippleOpacity = interpolate(elapsed, [0, 20], [0.4, 0], { extrapolateRight: "clamp" })
          return (
            <div
              style={{
                position: "absolute",
                left: activeClick.x - 20,
                top: activeClick.y - 20,
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: colors.emerald,
                opacity: rippleOpacity,
                transform: `scale(${rippleScale * 2})`,
              }}
            />
          )
        })()}

      <div
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          opacity: entrance,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, opacity: j === -1 ? 1 : 1 - mix }}>
          <Img src={files[from]} style={{ width: SIZE, height: SIZE }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: mix }}>
          <Img src={files[to]} style={{ width: SIZE, height: SIZE }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}
