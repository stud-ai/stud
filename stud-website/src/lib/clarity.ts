"use client"

import clarity from "@microsoft/clarity"

const state = {
  live: false,
  hits: [] as string[],
  tags: [] as Array<[string, string]>,
}

export function boot() {
  if (state.live) return
  const id = process.env.NEXT_PUBLIC_CLARITY_ID ?? "vi2wib5dun"
  clarity.init(id)
  state.live = true
  state.tags.forEach((v) => clarity.setTag(v[0], v[1]))
  state.hits.forEach((v) => clarity.event(v))
  state.tags = []
  state.hits = []
}

export function tag(k: string, v: string) {
  if (!state.live) {
    state.tags.push([k, v])
    return
  }
  clarity.setTag(k, v)
}

export function hit(v: string) {
  if (!state.live) {
    state.hits.push(v)
    return
  }
  clarity.event(v)
}
