import { describe, test, expect } from "bun:test"
import { RobloxAuth } from "../../src/roblox/auth"

const TOOLBOX_API = "https://apis.roblox.com/toolbox-service/v1"

describe("Toolbox API", () => {
  test("search works with auth cookie", async () => {
    const cookie = await RobloxAuth.getCookie()
    if (!cookie) {
      console.log("Skipping - no auth cookie")
      return
    }

    const response = await fetch(`${TOOLBOX_API}/marketplace/10?keyword=car&pageNumber=1&pageSize=5`, {
      headers: { Cookie: `.ROBLOSECURITY=${cookie}` },
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.totalResults).toBeGreaterThan(0)
    expect(data.data.length).toBeGreaterThan(0)
    console.log(`Found ${data.totalResults} results, got ${data.data.length} assets`)
  })

  test("asset details works with auth cookie", async () => {
    const cookie = await RobloxAuth.getCookie()
    if (!cookie) {
      console.log("Skipping - no auth cookie")
      return
    }

    // A known free car model
    const assetId = 17158839996
    const response = await fetch(`${TOOLBOX_API}/items/details?assetIds=${assetId}`, {
      headers: { Cookie: `.ROBLOSECURITY=${cookie}` },
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.data.length).toBe(1)
    expect(data.data[0].asset.id).toBe(assetId)
    console.log(`Asset: ${data.data[0].asset.name}`)
  })
})
