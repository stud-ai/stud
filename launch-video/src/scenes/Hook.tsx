import { AbsoluteFill } from "remotion"
import { CinematicCopy } from "../components/CinematicCopy"
import { colors } from "../constants"

export const Hook = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <CinematicCopy
        line1="Roblox coding is still stuck"
        line2="in 2012."
        size={96}
        start={0}
        fadeOutStart={88}
        fadeOutEnd={102}
      />
    </AbsoluteFill>
  )
}
