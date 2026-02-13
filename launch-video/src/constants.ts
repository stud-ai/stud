export const WIDTH = 1920
export const HEIGHT = 1080
export const FPS = 60
export const DURATION = 1420

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

export const fonts = {
  display: "Kalice",
  tech: "Raster",
  sans: "GeistPixel",
  mono: "GeistMono",
} as const

export const springs = {
  default: { stiffness: 160, damping: 16, mass: 0.6 },
  light: { stiffness: 260, damping: 22, mass: 0.4 },
  heavy: { stiffness: 100, damping: 16, mass: 0.9 },
} as const

export const scenes = {
  hook: { start: 0, duration: 90 },
  switch: { start: 90, duration: 100 },
  features: { start: 190, duration: 240 },
  interaction: { start: 430, duration: 240 },
  result: { start: 670, duration: 330 },
  trust: { start: 1000, duration: 180 },
  cta: { start: 1180, duration: 240 },
} as const
