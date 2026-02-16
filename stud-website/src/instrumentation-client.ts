import { initBotId } from "botid/client/core"

initBotId({
  protect: [
    {
      path: "/api/join-waitlist",
      method: "POST",
    },
  ],
})
