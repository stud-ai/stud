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
  { frame: scenes.switch.start + 76, x: 1260, y: 380, cursor: "arrow" },
  { frame: scenes.switch.start + 102, x: 1038, y: 470, click: true, cursor: "pointer" },

  // Exit after first click so middle scenes have no cursor
  { frame: scenes.switch.start + 118, x: 2100, y: -120, cursor: "arrow" },
  { frame: scenes.features.start + 145, x: 2100, y: -120, cursor: "arrow" },

  // Features: cursor moves to first thumbnail (Medieval Village)
  // First thumbnail center ~x=770, y=300 (with scene zoom)
  { frame: scenes.features.start + 162, x: 820, y: 450, cursor: "arrow" },
  { frame: scenes.features.start + 210, x: 745, y: 286, click: true, cursor: "pointer" },

  // Exit so Interaction and later scenes have no cursor
  { frame: scenes.features.start + 222, x: 2100, y: 1200, cursor: "arrow" },
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
          const fade = interpolate(f, [0, 60], [0, 0.2], { extrapolateRight: "clamp" })
          const out = interpolate(f, [DURATION - 60, DURATION], [0.2, 0], { extrapolateLeft: "clamp" })
          return Math.min(fade, out)
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
      <Sequence from={scenes.switch.start + 102} durationInFrames={30}>
        <Audio src={staticFile("audio/interface-click.wav")} volume={0.4} name="Toggle" />
      </Sequence>

      {/* ── Asset card pop SFX (Features scene) — delayed to match new timing ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={`pop-${i}`} from={scenes.features.start + 108 + i * 8} durationInFrames={30}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.15} name="Pop" />
        </Sequence>
      ))}

      {/* ── Typing SFX (Features prompt) ── */}
      <Sequence from={scenes.features.start + 24} durationInFrames={145}>
        <Audio src={staticFile("audio/typing.wav")} volume={0.25} name="Typing" />
      </Sequence>

      {/* ── Typing SFX (Trust terminal) ── */}
      <Sequence from={scenes.trust.start + 20} durationInFrames={110}>
        <Audio src={staticFile("audio/typing.wav")} volume={0.2} name="Terminal Typing" />
      </Sequence>

      {/* ── Tool step SFX (Interaction scene) — delayed to match new timing ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={`step-${i}`} from={scenes.interaction.start + 220 + i * 14} durationInFrames={30}>
          <Audio src={staticFile("audio/checkbox.wav")} volume={0.25} name="Step" />
        </Sequence>
      ))}

      {/* ── Code reveal pop (Result scene) ── */}
      <Sequence from={scenes.result.start + 85} durationInFrames={30}>
        <Audio src={staticFile("audio/pop.wav")} volume={0.2} name="Code Pop" />
      </Sequence>

      {/* ── Success ding (Result response appears) ── */}
      <Sequence from={scenes.result.start + 300} durationInFrames={90}>
        <Audio src={staticFile("audio/success.wav")} volume={0.35} name="Success" />
      </Sequence>

      {/* ── Explorer tree item pops ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sequence key={`tree-${i}`} from={scenes.explorer.start + 30 + i * 10} durationInFrames={30}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.1} name="Tree Pop" />
        </Sequence>
      ))}

      {/* ── Models toggle clicks ── */}
      {[0, 1, 2].map((i) => (
        <Sequence key={`toggle-${i}`} from={scenes.models.start + 64 + i * 36} durationInFrames={30}>
          <Audio src={staticFile("audio/interface-click.wav")} volume={0.2} name="Toggle" />
        </Sequence>
      ))}

      {/* ── Positive beep on CTA badge entrance ── */}
      <Sequence from={scenes.cta.start + 104} durationInFrames={60}>
        <Audio src={staticFile("audio/positive-beep.wav")} volume={0.25} name="CTA Beep" />
      </Sequence>

      {/* ── Cursor ── */}
      <Cursor keyframes={cursorKeyframes} />
    </AbsoluteFill>
  )
}
