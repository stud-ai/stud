import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { ScenePage } from "../components/ScenePage"
import { fonts, springs, ui } from "../constants"

const providers = [
  {
    name: "Anthropic",
    path: "M26.9568 9.88184H22.1265L30.7753 31.7848H35.4917L26.9568 9.88184ZM13.028 9.88184L4.4917 31.7848H9.32203L11.2305 27.1793H20.2166L22.0126 31.6724H26.8444L18.0832 9.88184H13.028ZM12.5783 23.1361L15.4987 15.3853L18.5315 23.1361H12.5783Z",
    models: [
      { name: "Claude Opus 4.6", on: true },
      { name: "Claude Opus 4.5", on: true },
      { name: "Claude Sonnet 4.5", on: true },
    ],
  },
  {
    name: "OpenAI",
    path: "M32.8377 17.282C33.2127 16.25 33.3072 15.218 33.2127 14.1875C33.1197 13.1571 32.7447 12.1251 32.2752 11.1876C31.4322 9.78209 30.2127 8.6571 28.8072 8.0001C27.3072 7.34461 25.7127 7.15711 24.1197 7.53211C23.3698 6.78212 22.5253 6.12512 21.5878 5.65713C20.6503 5.18913 19.5253 5.00013 18.4948 5.00013C16.8851 4.99074 15.3125 5.48246 13.9948 6.40712C12.6824 7.34311 11.7449 8.6571 11.2754 10.1571C10.1504 10.4376 9.21289 10.9071 8.27539 11.4696C7.4324 12.1251 6.77541 12.9696 6.21291 13.8126C5.36992 15.2195 5.08792 16.8125 5.27542 18.407C5.46399 19.9968 6.11605 21.496 7.1504 22.718C6.79608 23.7086 6.66795 24.7659 6.77541 25.8124C6.86991 26.8444 7.2449 27.8749 7.7129 28.8124C8.55739 30.2194 9.77538 31.3444 11.1824 31.9999C12.6824 32.6569 14.2753 32.8444 15.8698 32.4694C16.6198 33.2194 17.4628 33.8749 18.4003 34.3444C19.3378 34.8139 20.4628 34.9999 21.4948 34.9999C23.1043 35.0097 24.6769 34.5185 25.9947 33.5944C27.3072 32.6569 28.2447 31.3444 28.7127 29.8444C29.7719 29.6432 30.7682 29.1934 31.6197 28.5319C32.4627 27.8749 33.2127 27.1249 33.6822 26.1874C34.5251 24.7819 34.8071 23.1875 34.6196 21.5945C34.4322 20 33.8697 18.5015 32.8377 17.282Z",
    models: [
      { name: "GPT-5.1", on: true },
      { name: "GPT-5", on: true },
      { name: "o3", on: false },
    ],
  },
  {
    name: "Google",
    path: "M37 20.034C27.8809 20.5837 20.5808 27.8809 20.0326 37H19.966C19.4163 27.8809 12.1177 20.5837 3 20.034V19.9674C12.1191 19.4163 19.4163 12.1191 19.966 3H20.0326C20.5822 12.1191 27.8809 19.4163 37 19.9674V20.034Z",
    models: [
      { name: "Gemini 3 Pro", on: true },
      { name: "Gemini 2.5 Flash", on: true },
    ],
  },
  {
    name: "GitHub Copilot",
    path: "M35.3993 26.4544C34.2871 28.3855 27.8314 32.9425 20 32.9425C12.1686 32.9425 5.71288 28.3855 4.60075 26.4544C4.5427 26.3532 4.50826 26.2401 4.5 26.1237V22.418C4.51199 22.3209 4.53496 22.2256 4.56846 22.1338C5.04896 20.9261 6.30833 19.1733 7.93325 18.7031C8.14896 18.149 8.468 17.3404 8.76508 16.7437C8.71727 16.2776 8.69485 15.8094 8.69792 15.3409C8.69792 13.6217 9.06217 12.113 10.1601 10.9906C10.6729 10.4662 11.3097 10.0644 12.064 9.76091C13.871 8.29357 16.4453 7.05745 19.9716 7.05745C23.4978 7.05745 26.129 8.29357 27.936 9.76091C28.6903 10.0644 29.3271 10.4662 29.8399 10.9906C30.9378 12.113 31.3021 13.6217 31.3021 15.3409C31.3021 15.8162 31.284 16.2877 31.2349 16.7437C31.532 17.3404 31.851 18.149 32.0667 18.7031C33.6917 19.1733 34.951 20.9261 35.4315 22.1338C35.4677 22.2248 35.4908 22.3205 35.5 22.418V26.1237C35.4917 26.2401 35.4573 26.3532 35.3993 26.4544Z",
    models: [
      { name: "Claude Sonnet 4.5", on: true },
      { name: "GPT-5", on: false },
    ],
  },
]

function Toggle({ on, frame, delay }: { on: boolean; frame: number; delay: number }) {
  const { fps } = useVideoConfig()
  const s = spring({ fps, frame: frame - delay, config: springs.light })
  return (
    <div
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        backgroundColor: on ? "#10b981" : ui.surfaceInset,
        border: `1px solid ${on ? "#10b981" : ui.borderWeak}`,
        position: "relative",
        flexShrink: 0,
        opacity: s,
        transform: `scale(${s})`,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "white",
          position: "absolute",
          top: 1,
          left: on ? 17 : 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  )
}

export const Models = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const card = spring({ fps, frame: frame - 18, config: springs.default })

  return (
    <AbsoluteFill style={{ backgroundColor: ui.background, justifyContent: "center", alignItems: "center" }}>
      <ScenePage
        line1="Connect and use your favorite model for free."
        line2="Claude, GPT, Gemini, Copilot - one place."
        size={62}
        bg={ui.background}
        hold={84}
        fade={16}
      />
      <div
        style={{
          width: 560,
          backgroundColor: ui.surfaceRaised,
          borderRadius: 16,
          border: `1px solid ${ui.borderWeak}`,
          boxShadow: "0 25px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          overflow: "hidden",
          transform: `scale(${0.95 + card * 0.05})`,
          opacity: card,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${ui.borderWeak}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={ui.textWeak} strokeWidth={1.8}>
            <path
              d="M12 3v18m0-18a4 4 0 014 4H8a4 4 0 014-4zm-4 4v4m8-4v4m-8 4h8m-8 0v4h8v-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: fonts.inter,
              fontSize: 14,
              fontWeight: 600,
              color: ui.textStrong,
              letterSpacing: "-0.01em",
            }}
          >
            Models
          </span>
          <div style={{ flex: 1 }} />
          {/* Search */}
          <div
            style={{
              width: 180,
              height: 28,
              borderRadius: 6,
              border: `1px solid ${ui.borderWeak}`,
              backgroundColor: ui.surfaceInset,
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
              gap: 6,
            }}
          >
            <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke={ui.textSubtle} strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: fonts.inter, fontSize: 11, color: ui.textSubtle }}>Search models...</span>
          </div>
        </div>

        {/* Provider groups */}
        <div style={{ padding: "4px 0 8px", overflow: "hidden" }}>
          {providers.map((provider, pi) => {
            const groupDelay = 35 + pi * 32
            const gs = spring({ fps, frame: frame - groupDelay, config: springs.light })

            return (
              <div
                key={pi}
                style={{
                  opacity: gs,
                  transform: `translateY(${(1 - gs) * 14}px)`,
                }}
              >
                {/* Provider header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 24px 4px",
                  }}
                >
                  <svg viewBox="0 0 40 40" width={18} height={18} style={{ color: ui.textStrong }}>
                    <path d={provider.path} fill="currentColor" />
                  </svg>
                  <span
                    style={{
                      fontFamily: fonts.inter,
                      fontSize: 13,
                      fontWeight: 600,
                      color: ui.textStrong,
                    }}
                  >
                    {provider.name}
                  </span>
                </div>

                {/* Model rows */}
                <div
                  style={{
                    margin: "4px 16px 4px",
                    borderRadius: 8,
                    border: `1px solid ${ui.borderWeak}`,
                    overflow: "hidden",
                  }}
                >
                  {provider.models.map((model, mi) => {
                    const rowDelay = groupDelay + 14 + mi * 8
                    return (
                      <div
                        key={mi}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 14px",
                          borderBottom: mi < provider.models.length - 1 ? `1px solid ${ui.borderWeak}` : "none",
                          backgroundColor: ui.surfaceRaised,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: fonts.inter,
                            fontSize: 13,
                            fontWeight: 400,
                            color: ui.textStrong,
                          }}
                        >
                          {model.name}
                        </span>
                        <Toggle on={model.on} frame={frame} delay={rowDelay} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}
