export const WIDTH = 1920
export const HEIGHT = 1080
export const FPS = 60
export const DURATION = 2220

export const colors = {
  bg: "#f8f8f6",
  fg: "#1a1817",
  emerald: "#10b981",
  card: "#ffffff",
  border: "#e7e5e4",
  container: "#f5f4f0",
  grid: "#e7e5e4",
  grey: "#757570",
  codeBg: "#1a1817",
  keyword: "#10b981",
  string: "#f59e0b",
  comment: "#6b7280",
} as const

// Real Stud app UI tokens (light theme)
export const ui = {
  background: "#f8f7f7",
  backgroundStronger: "#fcfcfc",
  surfaceRaised: "#ffffff",
  surfaceInset: "#f5f3f3",
  surfaceHover: "rgba(5,0,0,0.06)",
  borderWeak: "rgba(17,0,0,0.12)",
  border: "rgba(17,0,0,0.18)",
  textStrong: "#211e1e",
  text: "#656363",
  textWeak: "#8e8b8b",
  textSubtle: "#a8a5a5",
  iconBase: "#8e8b8b",
  iconWeak: "#b5b2b2",
  iconSuccess: "#7dd676",
  borderSuccess: "#9fe598",
  surfaceSuccess: "#ecfaf2",
  radius: { sm: 4, md: 6, lg: 8, xl: 10 },
} as const

export const fonts = {
  display: "Kalice",
  tech: "Raster",
  sans: "GeistPixel",
  mono: "GeistMono",
  inter: "Inter",
  plex: "IBM Plex Mono",
} as const

export const springs = {
  default: { stiffness: 120, damping: 18, mass: 0.8 },
  light: { stiffness: 180, damping: 20, mass: 0.5 },
  heavy: { stiffness: 80, damping: 16, mass: 1.1 },
} as const

export const scenes = {
  hook: { start: 0, duration: 120 },
  switch: { start: 120, duration: 150 },
  features: { start: 270, duration: 340 },
  interaction: { start: 610, duration: 340 },
  result: { start: 950, duration: 430 },
  explorer: { start: 1380, duration: 220 },
  models: { start: 1600, duration: 220 },
  trust: { start: 1820, duration: 160 },
  cta: { start: 1980, duration: 240 },
} as const
