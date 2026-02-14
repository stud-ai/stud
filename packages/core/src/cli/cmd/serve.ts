import { Server } from "../../server/server"
import { cmd } from "./cmd"
import { withNetworkOptions, resolveNetworkOptions } from "../network"
import { Flag } from "../../flag/flag"
import { OpenCodeMigration } from "../../migration"

export const ServeCommand = cmd({
  command: "serve",
  builder: (yargs) => withNetworkOptions(yargs),
  describe: "starts a headless stud server",
  handler: async (args) => {
    // Run OpenCode migration if needed (silently auto-migrate)
    await OpenCodeMigration.runIfNeeded()

    if (!Flag.OPENCODE_SERVER_PASSWORD) {
      console.log("Warning: STUD_SERVER_PASSWORD is not set; server is unsecured.")
    }

    // Start the Roblox Studio bridge server
    await import("../../tool/roblox/bridge")

    const opts = await resolveNetworkOptions(args)
    const server = Server.listen(opts)
    console.log(`stud server listening on http://${server.hostname}:${server.port}`)
    await new Promise(() => {})
    await server.stop()
  },
})
