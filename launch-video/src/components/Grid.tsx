import { AbsoluteFill } from "remotion"
import { colors } from "../constants"

export const Grid = ({ opacity = 0.3 }: { opacity?: number }) => (
  <AbsoluteFill style={{ opacity }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={colors.grid} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </AbsoluteFill>
)
