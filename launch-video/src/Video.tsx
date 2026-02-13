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
import { Trust } from "./scenes/Trust"
import { CTA } from "./scenes/CTA"

const cursorKeyframes = [
  { frame: 100, x: 1200, y: 380, cursor: "arrow" },
  { frame: 106, x: 1060, y: 460, click: true, cursor: "pointer" },
  { frame: 210, x: 1300, y: 380, cursor: "arrow" },
  { frame: 216, x: 1200, y: 480, click: true, cursor: "pointer" },
  { frame: 280, x: 900, y: 500, cursor: "arrow" },
  { frame: 286, x: 760, y: 600, click: true, cursor: "text" },
  { frame: 520, x: 650, y: 400, cursor: "arrow" },
  { frame: 526, x: 530, y: 480, click: true, cursor: "pointer" },
] satisfies Keyframe[]

const transitions = [
  scenes.switch.start + scenes.switch.duration,
  scenes.features.start + scenes.features.duration,
  scenes.interaction.start + scenes.interaction.duration,
  scenes.result.start + scenes.result.duration,
  scenes.trust.start + scenes.trust.duration,
]

const clickFrames = cursorKeyframes.filter((k) => k.click).map((k) => k.frame)

const checkFrames = [0, 1, 2, 3, 4].map((i) => scenes.interaction.start + 175 + i * 20 + 18)

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

      {/* ── Toggle SFX ── */}
      <Sequence from={scenes.switch.start + 15} durationInFrames={30}>
        <Audio src={staticFile("audio/interface-click.wav")} volume={0.4} name="Toggle" />
      </Sequence>

      {/* ── Card pop SFX ── */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sequence key={`pop-${i}`} from={scenes.features.start + 10 + i * 3} durationInFrames={30}>
          <Audio src={staticFile("audio/pop.wav")} volume={0.15} name="Pop" />
        </Sequence>
      ))}

      {/* ── Typing SFX (Features prompt) ── */}
      <Sequence from={scenes.features.start + 100} durationInFrames={100}>
        <Audio src={staticFile("audio/typing.wav")} volume={0.25} name="Typing" />
      </Sequence>

      {/* ── Typing SFX (Trust terminal) ── */}
      <Sequence from={scenes.trust.start + 15} durationInFrames={140}>
        <Audio src={staticFile("audio/typing.wav")} volume={0.2} name="Terminal Typing" />
      </Sequence>

      {/* ── Checklist checkmark SFX ── */}
      {checkFrames.map((f) => (
        <Sequence key={`check-${f}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("audio/checkbox.wav")} volume={0.3} name="Check" />
        </Sequence>
      ))}

      {/* ── Success ding when all checks complete ── */}
      <Sequence from={checkFrames[checkFrames.length - 1] + 20} durationInFrames={90}>
        <Audio src={staticFile("audio/success.wav")} volume={0.35} name="Success" />
      </Sequence>

      {/* ── Positive beep on CTA badge entrance ── */}
      <Sequence from={scenes.cta.start + 10} durationInFrames={60}>
        <Audio src={staticFile("audio/positive-beep.wav")} volume={0.25} name="CTA Beep" />
      </Sequence>

      {/* ── Cursor ── */}
      <Cursor keyframes={cursorKeyframes} />
    </AbsoluteFill>
  )
}
