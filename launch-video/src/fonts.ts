import { loadFont } from "@remotion/fonts"
import { staticFile } from "remotion"

export const loaded = Promise.all([
  loadFont({
    family: "Kalice",
    url: staticFile("fonts/Kalice-Trial_Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "Raster",
    url: staticFile("fonts/Raster.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "GeistPixel",
    url: staticFile("fonts/GeistPixel-Square.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "GeistMono",
    url: staticFile("fonts/GeistMono-Regular.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-Medium.ttf"),
    weight: "500",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("fonts/Inter-SemiBold.ttf"),
    weight: "600",
  }),
  loadFont({
    family: "IBM Plex Mono",
    url: staticFile("fonts/IBMPlexMono-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: "IBM Plex Mono",
    url: staticFile("fonts/IBMPlexMono-Medium.ttf"),
    weight: "500",
  }),
])
