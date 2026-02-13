import { Composition } from "remotion"
import { Video } from "./Video"
import { DURATION, FPS, HEIGHT, WIDTH } from "./constants"

export const Root = () => {
  return (
    <Composition
      id="StudLaunchVideo"
      component={Video}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  )
}
