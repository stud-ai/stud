import { describe, test, expect } from "bun:test"
import { Picker } from "./index"

// ============================================================================
// Schema Validation Tests
// ============================================================================

describe("Picker Schemas", () => {
  describe("Picker.Item schema", () => {
    test("should validate item with string id", () => {
      const result = Picker.Item.safeParse({
        id: "test-id-123",
        name: "Test Item",
      })
      expect(result.success).toBe(true)
      expect(result.data?.id).toBe("test-id-123")
    })

    test("should validate item with number id", () => {
      const result = Picker.Item.safeParse({
        id: 12345,
        name: "Test Item",
      })
      expect(result.success).toBe(true)
      expect(result.data?.id).toBe(12345)
    })

    test("should validate item with zero id", () => {
      const result = Picker.Item.safeParse({
        id: 0,
        name: "Zero ID Item",
      })
      expect(result.success).toBe(true)
      expect(result.data?.id).toBe(0)
    })

    test("should validate item with negative number id", () => {
      const result = Picker.Item.safeParse({
        id: -999,
        name: "Negative ID Item",
      })
      expect(result.success).toBe(true)
      expect(result.data?.id).toBe(-999)
    })

    test("should validate item with empty string id", () => {
      const result = Picker.Item.safeParse({
        id: "",
        name: "Empty ID Item",
      })
      expect(result.success).toBe(true)
      expect(result.data?.id).toBe("")
    })

    test("should validate item with all optional fields", () => {
      const result = Picker.Item.safeParse({
        id: "full-item",
        name: "Full Item",
        thumbnailUrl: "https://example.com/image.png",
        description: "A comprehensive test item",
        metadata: { category: "tools", price: 100, tags: ["a", "b"] },
      })
      expect(result.success).toBe(true)
      expect(result.data?.thumbnailUrl).toBe("https://example.com/image.png")
      expect(result.data?.description).toBe("A comprehensive test item")
      expect(result.data?.metadata?.category).toBe("tools")
    })

    test("should validate item with complex metadata", () => {
      const result = Picker.Item.safeParse({
        id: "complex",
        name: "Complex Item",
        metadata: {
          nested: { deep: { value: 123 } },
          array: [1, 2, 3],
          bool: true,
          nullValue: null,
        },
      })
      expect(result.success).toBe(true)
      expect(result.data?.metadata?.nested?.deep?.value).toBe(123)
    })

    test("should fail without id", () => {
      const result = Picker.Item.safeParse({
        name: "No ID Item",
      })
      expect(result.success).toBe(false)
    })

    test("should fail without name", () => {
      const result = Picker.Item.safeParse({
        id: "no-name",
      })
      expect(result.success).toBe(false)
    })

    test("should fail with empty object", () => {
      const result = Picker.Item.safeParse({})
      expect(result.success).toBe(false)
    })

    test("should fail with null", () => {
      const result = Picker.Item.safeParse(null)
      expect(result.success).toBe(false)
    })

    test("should fail with undefined", () => {
      const result = Picker.Item.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    test("should fail with wrong id type (boolean)", () => {
      const result = Picker.Item.safeParse({
        id: true,
        name: "Boolean ID",
      })
      expect(result.success).toBe(false)
    })

    test("should fail with wrong id type (object)", () => {
      const result = Picker.Item.safeParse({
        id: { value: 123 },
        name: "Object ID",
      })
      expect(result.success).toBe(false)
    })

    test("should fail with wrong name type (number)", () => {
      const result = Picker.Item.safeParse({
        id: "test",
        name: 12345,
      })
      expect(result.success).toBe(false)
    })

    test("should validate item with very long name", () => {
      const longName = "A".repeat(1000)
      const result = Picker.Item.safeParse({
        id: "long-name",
        name: longName,
      })
      expect(result.success).toBe(true)
      expect(result.data?.name.length).toBe(1000)
    })

    test("should validate item with unicode name", () => {
      const result = Picker.Item.safeParse({
        id: "unicode",
        name: "テスト項目 🎮 مختبر",
      })
      expect(result.success).toBe(true)
      expect(result.data?.name).toContain("🎮")
    })

    test("should validate item with special characters in name", () => {
      const result = Picker.Item.safeParse({
        id: "special",
        name: "<script>alert('xss')</script> & \"quotes\" 'apostrophe'",
      })
      expect(result.success).toBe(true)
    })
  })

  describe("Picker.Request schema", () => {
    const validRequest = {
      id: "pck_01ABC123",
      sessionID: "ses_01ABC123",
      title: "Select items",
      items: [{ id: "1", name: "Item 1" }],
    }

    test("should validate minimal request", () => {
      const result = Picker.Request.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    test("should validate request with recommended items", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        recommended: ["1", "2", "3"],
      })
      expect(result.success).toBe(true)
      expect(result.data?.recommended).toEqual(["1", "2", "3"])
    })

    test("should validate request with number recommended items", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        recommended: [1, 2, 3],
      })
      expect(result.success).toBe(true)
      expect(result.data?.recommended).toEqual([1, 2, 3])
    })

    test("should validate request with mixed recommended items", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        recommended: ["a", 1, "b", 2],
      })
      expect(result.success).toBe(true)
      expect(result.data?.recommended).toEqual(["a", 1, "b", 2])
    })

    test("should validate request with empty recommended array", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        recommended: [],
      })
      expect(result.success).toBe(true)
      expect(result.data?.recommended).toEqual([])
    })

    test("should validate request with multiple=true", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        multiple: true,
      })
      expect(result.success).toBe(true)
      expect(result.data?.multiple).toBe(true)
    })

    test("should validate request with multiple=false", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        multiple: false,
      })
      expect(result.success).toBe(true)
      expect(result.data?.multiple).toBe(false)
    })

    test("should validate request with tool info", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        tool: { messageID: "msg_123", callID: "call_456" },
      })
      expect(result.success).toBe(true)
      expect(result.data?.tool?.messageID).toBe("msg_123")
      expect(result.data?.tool?.callID).toBe("call_456")
    })

    test("should validate request with many items", () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        name: `Item ${i}`,
      }))
      const result = Picker.Request.safeParse({
        ...validRequest,
        items: manyItems,
      })
      expect(result.success).toBe(true)
      expect(result.data?.items.length).toBe(100)
    })

    test("should validate request with empty items array", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        items: [],
      })
      expect(result.success).toBe(true)
      expect(result.data?.items.length).toBe(0)
    })

    test("should fail without id", () => {
      const { id, ...rest } = validRequest
      const result = Picker.Request.safeParse(rest)
      expect(result.success).toBe(false)
    })

    test("should fail without sessionID", () => {
      const { sessionID, ...rest } = validRequest
      const result = Picker.Request.safeParse(rest)
      expect(result.success).toBe(false)
    })

    test("should fail without title", () => {
      const { title, ...rest } = validRequest
      const result = Picker.Request.safeParse(rest)
      expect(result.success).toBe(false)
    })

    test("should fail without items", () => {
      const { items, ...rest } = validRequest
      const result = Picker.Request.safeParse(rest)
      expect(result.success).toBe(false)
    })

    test("should fail with invalid item in items array", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        items: [{ invalid: "item" }],
      })
      expect(result.success).toBe(false)
    })

    test("should fail with incomplete tool info", () => {
      const result = Picker.Request.safeParse({
        ...validRequest,
        tool: { messageID: "msg_123" }, // missing callID
      })
      expect(result.success).toBe(false)
    })
  })

  describe("Picker.Selection schema", () => {
    test("should validate empty array", () => {
      const result = Picker.Selection.safeParse([])
      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    test("should validate array of strings", () => {
      const result = Picker.Selection.safeParse(["a", "b", "c", "d", "e"])
      expect(result.success).toBe(true)
      expect(result.data).toEqual(["a", "b", "c", "d", "e"])
    })

    test("should validate array of numbers", () => {
      const result = Picker.Selection.safeParse([1, 2, 3, 4, 5])
      expect(result.success).toBe(true)
      expect(result.data).toEqual([1, 2, 3, 4, 5])
    })

    test("should validate mixed array", () => {
      const result = Picker.Selection.safeParse(["a", 1, "b", 2, "c", 3])
      expect(result.success).toBe(true)
      expect(result.data).toEqual(["a", 1, "b", 2, "c", 3])
    })

    test("should validate array with duplicates", () => {
      const result = Picker.Selection.safeParse(["a", "a", 1, 1])
      expect(result.success).toBe(true)
      expect(result.data).toEqual(["a", "a", 1, 1])
    })

    test("should validate large selection", () => {
      const largeSelection = Array.from({ length: 1000 }, (_, i) => i)
      const result = Picker.Selection.safeParse(largeSelection)
      expect(result.success).toBe(true)
      expect(result.data?.length).toBe(1000)
    })

    test("should fail with null", () => {
      const result = Picker.Selection.safeParse(null)
      expect(result.success).toBe(false)
    })

    test("should fail with string (not array)", () => {
      const result = Picker.Selection.safeParse("not-an-array")
      expect(result.success).toBe(false)
    })

    test("should fail with object", () => {
      const result = Picker.Selection.safeParse({ items: ["a", "b"] })
      expect(result.success).toBe(false)
    })

    test("should fail with boolean in array", () => {
      const result = Picker.Selection.safeParse(["a", true, "b"])
      expect(result.success).toBe(false)
    })

    test("should fail with object in array", () => {
      const result = Picker.Selection.safeParse(["a", { id: 1 }, "b"])
      expect(result.success).toBe(false)
    })

    test("should fail with null in array", () => {
      const result = Picker.Selection.safeParse(["a", null, "b"])
      expect(result.success).toBe(false)
    })
  })

  describe("Picker.Reply schema", () => {
    test("should validate reply with empty selections", () => {
      const result = Picker.Reply.safeParse({ selections: [] })
      expect(result.success).toBe(true)
      expect(result.data?.selections).toEqual([])
    })

    test("should validate reply with string selections", () => {
      const result = Picker.Reply.safeParse({
        selections: ["item1", "item2", "item3"],
      })
      expect(result.success).toBe(true)
    })

    test("should validate reply with number selections", () => {
      const result = Picker.Reply.safeParse({
        selections: [1, 2, 3],
      })
      expect(result.success).toBe(true)
    })

    test("should validate reply with mixed selections", () => {
      const result = Picker.Reply.safeParse({
        selections: ["a", 1, "b", 2],
      })
      expect(result.success).toBe(true)
    })

    test("should fail without selections field", () => {
      const result = Picker.Reply.safeParse({})
      expect(result.success).toBe(false)
    })

    test("should fail with null selections", () => {
      const result = Picker.Reply.safeParse({ selections: null })
      expect(result.success).toBe(false)
    })

    test("should fail with wrong type for selections", () => {
      const result = Picker.Reply.safeParse({ selections: "not-an-array" })
      expect(result.success).toBe(false)
    })
  })
})

// ============================================================================
// RejectedError Tests
// ============================================================================

describe("Picker.RejectedError", () => {
  test("should be an instance of Error", () => {
    const error = new Picker.RejectedError()
    expect(error).toBeInstanceOf(Error)
  })

  test("should have correct name", () => {
    const error = new Picker.RejectedError()
    expect(error.name).toBe("Error")
  })

  test("should have correct message", () => {
    const error = new Picker.RejectedError()
    expect(error.message).toBe("The user dismissed this picker")
  })

  test("should have stack trace", () => {
    const error = new Picker.RejectedError()
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe("string")
  })

  test("should be throwable", () => {
    expect(() => {
      throw new Picker.RejectedError()
    }).toThrow("The user dismissed this picker")
  })

  test("should be catchable as Error", () => {
    try {
      throw new Picker.RejectedError()
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  test("should be catchable as RejectedError", () => {
    try {
      throw new Picker.RejectedError()
    } catch (e) {
      expect(e).toBeInstanceOf(Picker.RejectedError)
    }
  })

  test("should be distinguishable from generic Error", () => {
    const rejectedError = new Picker.RejectedError()
    const genericError = new Error("Some error")

    expect(rejectedError).toBeInstanceOf(Picker.RejectedError)
    expect(genericError).not.toBeInstanceOf(Picker.RejectedError)
  })
})

// ============================================================================
// Event Definitions Tests
// ============================================================================

describe("Picker.Event", () => {
  describe("Asked event", () => {
    test("should be defined", () => {
      expect(Picker.Event.Asked).toBeDefined()
    })

    test("should have correct type", () => {
      expect(Picker.Event.Asked.type).toBe("picker.asked")
    })

    test("should have properties schema", () => {
      expect(Picker.Event.Asked.properties).toBeDefined()
    })
  })

  describe("Replied event", () => {
    test("should be defined", () => {
      expect(Picker.Event.Replied).toBeDefined()
    })

    test("should have correct type", () => {
      expect(Picker.Event.Replied.type).toBe("picker.replied")
    })

    test("should have properties schema", () => {
      expect(Picker.Event.Replied.properties).toBeDefined()
    })

    test("should validate replied event data", () => {
      const data = {
        sessionID: "ses_123",
        requestID: "pck_456",
        selections: ["a", "b", 1, 2],
      }
      const result = Picker.Event.Replied.properties.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe("Rejected event", () => {
    test("should be defined", () => {
      expect(Picker.Event.Rejected).toBeDefined()
    })

    test("should have correct type", () => {
      expect(Picker.Event.Rejected.type).toBe("picker.rejected")
    })

    test("should have properties schema", () => {
      expect(Picker.Event.Rejected.properties).toBeDefined()
    })

    test("should validate rejected event data", () => {
      const data = {
        sessionID: "ses_123",
        requestID: "pck_456",
      }
      const result = Picker.Event.Rejected.properties.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})

// ============================================================================
// Type Inference Tests (compile-time checks)
// ============================================================================

describe("Picker Type Inference", () => {
  test("Item type should be inferred correctly", () => {
    const item: Picker.Item = {
      id: "test",
      name: "Test",
      thumbnailUrl: "https://example.com",
      description: "Description",
      metadata: { key: "value" },
    }
    expect(item.id).toBe("test")
    expect(item.name).toBe("Test")
  })

  test("Request type should be inferred correctly", () => {
    const request: Picker.Request = {
      id: "pck_123",
      sessionID: "ses_456",
      title: "Select",
      items: [{ id: "1", name: "Item" }],
      recommended: ["1"],
      multiple: true,
      tool: { messageID: "msg_1", callID: "call_1" },
    }
    expect(request.id).toBe("pck_123")
  })

  test("Selection type should be inferred correctly", () => {
    const selection: Picker.Selection = ["a", 1, "b", 2]
    expect(selection.length).toBe(4)
  })

  test("Reply type should be inferred correctly", () => {
    const reply: Picker.Reply = {
      selections: ["a", "b"],
    }
    expect(reply.selections.length).toBe(2)
  })
})

// ============================================================================
// Edge Cases and Boundary Tests
// ============================================================================

describe("Picker Edge Cases", () => {
  test("should handle item with whitespace-only name", () => {
    const result = Picker.Item.safeParse({
      id: "whitespace",
      name: "   ",
    })
    expect(result.success).toBe(true)
  })

  test("should handle item with newlines in name", () => {
    const result = Picker.Item.safeParse({
      id: "newlines",
      name: "Line 1\nLine 2\nLine 3",
    })
    expect(result.success).toBe(true)
  })

  test("should handle item with tabs in name", () => {
    const result = Picker.Item.safeParse({
      id: "tabs",
      name: "Column1\tColumn2\tColumn3",
    })
    expect(result.success).toBe(true)
  })

  test("should handle selection with empty string", () => {
    const result = Picker.Selection.safeParse(["", "a", ""])
    expect(result.success).toBe(true)
    expect(result.data).toEqual(["", "a", ""])
  })

  test("should handle selection with zero", () => {
    const result = Picker.Selection.safeParse([0, 1, 2])
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toBe(0)
  })

  test("should handle selection with negative numbers", () => {
    const result = Picker.Selection.safeParse([-1, -2, -3])
    expect(result.success).toBe(true)
  })

  test("should handle selection with very large numbers", () => {
    const result = Picker.Selection.safeParse([Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER])
    expect(result.success).toBe(true)
  })

  test("should handle selection with floating point numbers", () => {
    const result = Picker.Selection.safeParse([1.5, 2.7, 3.14159])
    expect(result.success).toBe(true)
  })

  test("should handle request with unicode title", () => {
    const result = Picker.Request.safeParse({
      id: "pck_unicode",
      sessionID: "ses_123",
      title: "选择项目 🎯 اختيار",
      items: [{ id: "1", name: "Item" }],
    })
    expect(result.success).toBe(true)
  })

  test("should handle request with very long title", () => {
    const result = Picker.Request.safeParse({
      id: "pck_long",
      sessionID: "ses_123",
      title: "X".repeat(10000),
      items: [{ id: "1", name: "Item" }],
    })
    expect(result.success).toBe(true)
    expect(result.data?.title.length).toBe(10000)
  })
})
