import { $ } from "bun"

import { copyBinaryToSidecarFolder, getCurrentSidecar, windowsify } from "./utils"

const RUST_TARGET = Bun.env.TAURI_ENV_TARGET_TRIPLE

const sidecarConfig = getCurrentSidecar(RUST_TARGET)

const binaryPath = windowsify(`../core/dist/${sidecarConfig.ocBinary}/bin/stud`)

await $`cd ../core && bun run build --single`

await copyBinaryToSidecarFolder(binaryPath, RUST_TARGET)
