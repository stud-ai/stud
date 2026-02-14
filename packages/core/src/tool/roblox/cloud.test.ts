import { describe, test, expect } from "bun:test"
import {
  RobloxUniverseInfoTool,
  RobloxDataStoreListTool,
  RobloxDataStoreGetTool,
  RobloxDataStoreSetTool,
  RobloxPublishPlaceTool,
  RobloxOrderedDataStoreListTool,
  RobloxOrderedDataStoreGetTool,
  RobloxOrderedDataStoreSetTool,
  RobloxOrderedDataStoreIncrementTool,
} from "./cloud"

// Standard DataStore tools
describe("RobloxUniverseInfoTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxUniverseInfoTool.id).toBe("roblox_universe_info")
  })

  test("should accept optional universeId", async () => {
    const tool = await RobloxUniverseInfoTool.init()
    const result = tool.parameters.safeParse({})
    expect(result.success).toBe(true)
  })

  test("should accept universeId parameter", async () => {
    const tool = await RobloxUniverseInfoTool.init()
    const result = tool.parameters.safeParse({ universeId: "12345" })
    expect(result.success).toBe(true)
    expect(result.data?.universeId).toBe("12345")
  })
})

describe("RobloxDataStoreListTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxDataStoreListTool.id).toBe("roblox_datastore_list")
  })

  test("should accept optional parameters", async () => {
    const tool = await RobloxDataStoreListTool.init()
    const result = tool.parameters.safeParse({
      universeId: "12345",
      prefix: "Player",
      limit: 50,
    })
    expect(result.success).toBe(true)
  })

  test("should validate limit range", async () => {
    const tool = await RobloxDataStoreListTool.init()

    expect(tool.parameters.safeParse({ limit: 1 }).success).toBe(true)
    expect(tool.parameters.safeParse({ limit: 100 }).success).toBe(true)
    expect(tool.parameters.safeParse({ limit: 0 }).success).toBe(false)
    expect(tool.parameters.safeParse({ limit: 101 }).success).toBe(false)
  })
})

describe("RobloxDataStoreGetTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxDataStoreGetTool.id).toBe("roblox_datastore_get")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxDataStoreGetTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "PlayerData" }).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "PlayerData", key: "player_123" }).success).toBe(true)
  })

  test("should accept optional scope", async () => {
    const tool = await RobloxDataStoreGetTool.init()
    const result = tool.parameters.safeParse({
      datastoreName: "PlayerData",
      key: "player_123",
      scope: "server1",
    })
    expect(result.success).toBe(true)
    expect(result.data?.scope).toBe("server1")
  })
})

describe("RobloxDataStoreSetTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxDataStoreSetTool.id).toBe("roblox_datastore_set")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxDataStoreSetTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "PlayerData", key: "player_123" }).success).toBe(false)
    expect(
      tool.parameters.safeParse({
        datastoreName: "PlayerData",
        key: "player_123",
        value: '{"coins": 100}',
      }).success,
    ).toBe(true)
  })
})

describe("RobloxPublishPlaceTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxPublishPlaceTool.id).toBe("roblox_publish_place")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxPublishPlaceTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ placeId: "12345678" }).success).toBe(true)
  })

  test("should accept optional versionType", async () => {
    const tool = await RobloxPublishPlaceTool.init()

    const saved = tool.parameters.safeParse({ placeId: "12345678", versionType: "Saved" })
    expect(saved.success).toBe(true)
    expect(saved.data?.versionType).toBe("Saved")

    const published = tool.parameters.safeParse({ placeId: "12345678", versionType: "Published" })
    expect(published.success).toBe(true)
    expect(published.data?.versionType).toBe("Published")
  })
})

// OrderedDataStore tools
describe("RobloxOrderedDataStoreListTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxOrderedDataStoreListTool.id).toBe("roblox_ordered_datastore_list")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxOrderedDataStoreListTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard" }).success).toBe(true)
  })

  test("should accept optional parameters", async () => {
    const tool = await RobloxOrderedDataStoreListTool.init()

    const result = tool.parameters.safeParse({
      datastoreName: "Leaderboard",
      universeId: "12345",
      scope: "global",
      maxPageSize: 50,
      ascending: true,
    })
    expect(result.success).toBe(true)
    expect(result.data?.ascending).toBe(true)
    expect(result.data?.maxPageSize).toBe(50)
  })

  test("should validate maxPageSize range", async () => {
    const tool = await RobloxOrderedDataStoreListTool.init()

    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", maxPageSize: 1 }).success).toBe(true)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", maxPageSize: 100 }).success).toBe(true)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", maxPageSize: 0 }).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", maxPageSize: 101 }).success).toBe(false)
  })
})

describe("RobloxOrderedDataStoreGetTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxOrderedDataStoreGetTool.id).toBe("roblox_ordered_datastore_get")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxOrderedDataStoreGetTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard" }).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", entryId: "player_123" }).success).toBe(true)
  })

  test("should accept optional scope", async () => {
    const tool = await RobloxOrderedDataStoreGetTool.init()
    const result = tool.parameters.safeParse({
      datastoreName: "Leaderboard",
      entryId: "player_123",
      scope: "weekly",
    })
    expect(result.success).toBe(true)
    expect(result.data?.scope).toBe("weekly")
  })
})

describe("RobloxOrderedDataStoreSetTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxOrderedDataStoreSetTool.id).toBe("roblox_ordered_datastore_set")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxOrderedDataStoreSetTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", entryId: "player_123" }).success).toBe(false)
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        value: 1000,
      }).success,
    ).toBe(true)
  })

  test("should validate value is an integer", async () => {
    const tool = await RobloxOrderedDataStoreSetTool.init()

    // Integer values should pass
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        value: 100,
      }).success,
    ).toBe(true)

    // Negative integers should pass
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        value: -50,
      }).success,
    ).toBe(true)

    // Float values should fail
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        value: 100.5,
      }).success,
    ).toBe(false)
  })
})

describe("RobloxOrderedDataStoreIncrementTool", () => {
  test("should be defined with correct id", () => {
    expect(RobloxOrderedDataStoreIncrementTool.id).toBe("roblox_ordered_datastore_increment")
  })

  test("should validate required parameters", async () => {
    const tool = await RobloxOrderedDataStoreIncrementTool.init()

    expect(tool.parameters.safeParse({}).success).toBe(false)
    expect(tool.parameters.safeParse({ datastoreName: "Leaderboard", entryId: "player_123" }).success).toBe(false)
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        increment: 10,
      }).success,
    ).toBe(true)
  })

  test("should accept negative increment for decrement", async () => {
    const tool = await RobloxOrderedDataStoreIncrementTool.init()

    const result = tool.parameters.safeParse({
      datastoreName: "Leaderboard",
      entryId: "player_123",
      increment: -5,
    })
    expect(result.success).toBe(true)
    expect(result.data?.increment).toBe(-5)
  })

  test("should validate increment is an integer", async () => {
    const tool = await RobloxOrderedDataStoreIncrementTool.init()

    // Integer should pass
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        increment: 10,
      }).success,
    ).toBe(true)

    // Float should fail
    expect(
      tool.parameters.safeParse({
        datastoreName: "Leaderboard",
        entryId: "player_123",
        increment: 10.5,
      }).success,
    ).toBe(false)
  })
})
