import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion"
import { Cursor, type Keyframe } from "./components/Cursor"
import { Fade } from "./components/Fade"
import { colors, DURATION, scenes } from "./constants"
import "./fonts"
import { Hook } from "./scenes/Hook"
import { Switch } from "./scenes/Switch"
import { Features } from "./scenes/Features"
import { Interaction } from "./scenes/Interaction"
import { Result } from "./scenes/Result"
import { Explorer } from "./scenes/Explorer"
import { Models } from "./scenes/Models"
import { Trust } from "./scenes/Trust"
import { CTA } from "./scenes/CTA"

// Cursor keyframes for only two click moments:
// 1) Switch toggle click
// 2) Features asset click
// Cursor is moved off-screen between and after clicks.
const cursorKeyframes = [
  // Switch scene: enter after text page and click "Stud" toggle
  { frame: scenes.switch.start + 110, x: 1460, y: 640, cursor: "arrow" },
  { frame: scenes.switch.start + 126, x: 1210, y: 560, cursor: "arrow" },
  { frame: scenes.switch.start + 146, x: 1038, y: 470, click: true, cursor: "pointer" },

  // Exit after first click so middle scenes have no cursor
  { frame: scenes.switch.start + 164, x: 2100, y: 120, cursor: "arrow" },
  { frame: scenes.features.start + 198, x: 2100, y: -120, cursor: "arrow" },

  // Features: cursor moves to first thumbnail (Medieval Village)
  // First thumbnail center ~x=770, y=300 (with scene zoom)
  { frame: scenes.features.start + 246, x: 820, y: 450, cursor: "arrow" },
  { frame: scenes.features.start + 282, x: 745, y: 286, click: true, cursor: "pointer" },

  // Exit so Interaction and later scenes have no cursor
  { frame: scenes.features.start + 310, x: 2100, y: 1200, cursor: "arrow" },
] satisfies Keyframe[]

const transitions = [
  scenes.switch.start + scenes.switch.duration,
  scenes.features.start + scenes.features.duration,
  scenes.interaction.start + scenes.interaction.duration,
  scenes.result.start + scenes.result.duration,
  scenes.explorer.start + scenes.explorer.duration,
  scenes.models.start + scenes.models.duration,
  scenes.trust.start + scenes.trust.duration,
]

export const Video = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* ── Background music ── */}
      <Audio
        loop
        src={staticFile("audio/lofi-bg.mp3")}
        volume={(f) => {
          return interpolate(
            f,
            [
              0,
              40,
              scenes.switch.start,
              scenes.features.start,
              scenes.interaction.start,
              scenes.result.start,
              scenes.explorer.start,
              scenes.trust.start,
              scenes.cta.start + 40,
              DURATION - 90,
              DURATION,
            ],
            [0, 0.18, 0.16, 0.19, 0.18, 0.2, 0.18, 0.17, 0.14, 0.1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }}
        name="BG Music"
      />

      {/* ── Scenes ── */}
      <Sequence from={scenes.hook.start} durationInFrames={scenes.hook.duration}>
        <Hook />
      </Sequence>
      <Sequence from={scenes.switch.start} durationInFrames={scenes.switch.duration}>
        <Switch />
      </Sequence>
      <Sequence from={scenes.features.start} durationInFrames={scenes.features.duration}>
        <Features />
      </Sequence>
      <Sequence from={scenes.interaction.start} durationInFrames={scenes.interaction.duration}>
        <Interaction />
      </Sequence>
      <Sequence from={scenes.result.start} durationInFrames={scenes.result.duration}>
        <Result />
      </Sequence>
      <Sequence from={scenes.explorer.start} durationInFrames={scenes.explorer.duration}>
        <Explorer />
      </Sequence>
      <Sequence from={scenes.models.start} durationInFrames={scenes.models.duration}>
        <Models />
      </Sequence>
      <Sequence from={scenes.trust.start} durationInFrames={scenes.trust.duration}>
        <Trust />
      </Sequence>
      <Sequence from={scenes.cta.start} durationInFrames={scenes.cta.duration}>
        <CTA />
      </Sequence>

      {/* ── Transitions ── */}
      {transitions.map((t) => (
        <Fade key={t} at={t} />
      ))}

      {/* ── Cursor ── */}
      <Cursor keyframes={cursorKeyframes} />
    </AbsoluteFill>
  )
}
