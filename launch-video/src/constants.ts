export const WIDTH = 1920
export const HEIGHT = 1080
export const FPS = 60

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
  surfaceBase: "#25000007",
  surfaceInset: "#f5f3f3",
  surfaceHover: "rgba(5,0,0,0.06)",
  surfaceInteractiveWeak: "#f5faff",
  surfaceInteractiveBase: "#eaf2ff",
  surfaceCriticalWeak: "#fff6f3",
  surfaceCriticalBase: "#ffe9e4",
  surfaceSuccessWeak: "#f4fcf3",
  surfaceSuccessBase: "#e1fade",
  borderWeak: "rgba(17,0,0,0.12)",
  borderWeaker: "rgba(17,0,0,0.06)",
  border: "rgba(17,0,0,0.18)",
  borderInteractive: "#98bfff",
  borderCritical: "#ffb7a6",
  textStrong: "#211e1e",
  text: "#656363",
  textWeak: "#8e8b8b",
  textSubtle: "#a8a5a5",
  textInteractive: "#034cff",
  textCritical: "#da3319",
  iconBase: "#8e8b8b",
  iconWeak: "#b5b2b2",
  iconInteractive: "#034cff",
  iconSuccess: "#7dd676",
  iconCritical: "#ef442a",
  borderSuccess: "#9fe598",
  surfaceSuccess: "#f4fcf3",
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
  hook: { start: 0, duration: 132 },
  switch: { start: 132, duration: 176 },
  features: { start: 308, duration: 392 },
  interaction: { start: 700, duration: 392 },
  result: { start: 1092, duration: 500 },
  explorer: { start: 1592, duration: 260 },
  models: { start: 1852, duration: 260 },
  trust: { start: 2112, duration: 200 },
  cta: { start: 2312, duration: 320 },
} as const

export const DURATION = (Object.values(scenes) as ReadonlyArray<{ start: number; duration: number }>).reduce(
  (max, scene) => Math.max(max, scene.start + scene.duration),
  0,
)
