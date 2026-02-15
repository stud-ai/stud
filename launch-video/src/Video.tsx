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
  { frame: scenes.switch.start + 114, x: 1260, y: 380, cursor: "arrow" },
  { frame: scenes.switch.start + 145, x: 1038, y: 470, click: true, cursor: "pointer" },

  // Exit after first click so middle scenes have no cursor
  { frame: scenes.switch.start + 163, x: 2100, y: -120, cursor: "arrow" },
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

const clickFrames = cursorKeyframes.filter((k) => k.click).map((k) => k.frame)

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

      {/* ── Whoosh SFX at each transition ── */}
      {transitions.map((t) => (
        <Sequence key={`whoosh-${t}`} from={t - 8} durationInFrames={60}>
          <Audio src={staticFile("audio/whoosh.wav")} volume={0.35} name="Whoosh" />
        </Sequence>
      ))}

      {/* ── Cursor click SFX ── */}
      {clickFrames.map((f) => (
        <Sequence key={`click-${f}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("audio/click.wav")} volume={0.5} name="Click" />
        </Sequence>
      ))}

      {/* ── Toggle SFX (Switch scene) ── */}
      <Sequence from={scenes.switch.start + 145} durationInFrames={30}>
        <Audio src={staticFile("audio/interface-click.wav")} volume={0.4} name="Toggle" />
      </Sequence>

      {/* ── Asset card pop SFX (Features scene) — delayed to match new timing ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={`pop-${i}`} from={scenes.features.start + 148 + i * 12} durationInFrames={30}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.15} name="Pop" />
        </Sequence>
      ))}

      {/* ── Typing SFX (Features prompt) ── */}
      <Sequence from={scenes.features.start + 42} durationInFrames={210}>
        <Audio src={staticFile("audio/typing.wav")} volume={0.25} name="Typing" />
      </Sequence>

      {/* ── Typing SFX (Trust terminal) ── */}
      <Sequence from={scenes.trust.start + 20} durationInFrames={110}>
        <Audio src={staticFile("audio/typing.wav")} volume={0.2} name="Terminal Typing" />
      </Sequence>

      {/* ── Tool step SFX (Interaction scene) — delayed to match new timing ── */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Sequence key={`step-${i}`} from={scenes.interaction.start + 236 + i * 16} durationInFrames={30}>
          <Audio src={staticFile("audio/checkbox.wav")} volume={0.25} name="Step" />
        </Sequence>
      ))}

      {/* ── Code reveal pop (Result scene) ── */}
      <Sequence from={scenes.result.start + 132} durationInFrames={30}>
        <Audio src={staticFile("audio/pop.wav")} volume={0.2} name="Code Pop" />
      </Sequence>

      {/* ── Success ding (Result response appears) ── */}
      <Sequence from={scenes.result.start + 378} durationInFrames={90}>
        <Audio src={staticFile("audio/success.wav")} volume={0.35} name="Success" />
      </Sequence>

      {/* ── Explorer tree item pops ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={`tree-${i}`} from={scenes.explorer.start + 66 + i * 12} durationInFrames={30}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.1} name="Tree Pop" />
        </Sequence>
      ))}

      {/* ── Models toggle clicks ── */}
      {[0, 1, 2].map((i) => (
        <Sequence key={`toggle-${i}`} from={scenes.models.start + 98 + i * 42} durationInFrames={30}>
          <Audio src={staticFile("audio/interface-click.wav")} volume={0.2} name="Toggle" />
        </Sequence>
      ))}

      {/* ── Positive beep on CTA badge entrance ── */}
      <Sequence from={scenes.cta.start + 122} durationInFrames={60}>
        <Audio src={staticFile("audio/positive-beep.wav")} volume={0.25} name="CTA Beep" />
      </Sequence>

      {/* ── Cursor ── */}
      <Cursor keyframes={cursorKeyframes} />
    </AbsoluteFill>
  )
}
