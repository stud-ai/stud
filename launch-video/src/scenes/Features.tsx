import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion"
import { AppChrome, ActionCard, BasicTool, StepsColumn, UserMessage } from "../components/AppChrome"
import { ScenePage } from "../components/ScenePage"
import { fonts, springs, ui } from "../constants"

const prompt = 'Search the toolbox for "medieval village assets" and insert the best one into Workspace'

const assets = [
  { name: "Medieval Village Pack", type: "Model", creator: "BuildRBLX", vote: 96, thumb: "medieval-village.png" },
  { name: "Villager House", type: "Model", creator: "VoxelForge", vote: 94, thumb: "villager-house.png" },
  { name: "Village Town Center", type: "Model", creator: "MapKit", vote: 91, thumb: "village-town.png" },
  { name: "Fantasy Village Kit", type: "Model", creator: "TreeForge", vote: 88, thumb: "fantasy-village.png" },
  { name: "Village Market Stall", type: "Model", creator: "EnviroLab", vote: 85, thumb: "village-market.png" },
]

const writes = [
  { title: "Read", subtitle: "toolbox://medieval-village-pack" },
  { title: "Insert", subtitle: "Workspace/Map/MedievalVillage" },
  { title: "Write", subtitle: "game/src/world/VillageSpawn.luau" },
  { title: "Run", subtitle: "roblox://rebuild-navigation" },
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.1}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

export const Features = () => {
  const frame = useCurrentFrame()
  const video = useVideoConfig()

  const shell = spring({ fps: video.fps, frame: frame - 16, config: springs.default })
  const typed = Math.max(0, Math.floor((frame - 34) * 1.28))
  const card = spring({ fps: video.fps, frame: frame - 126, config: springs.default })
  const sync = spring({ fps: video.fps, frame: frame - 292, config: springs.default })
  const selected = frame >= 276
  const hover = frame < 236 ? -1 : Math.min(4, Math.floor((frame - 236) / 22))

  // Zoom into the thumbnail grid area when results appear
  const zoomProgress = interpolate(frame, [150, 236], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Cursor click punch around asset click
  const clickPunch = interpolate(frame, [270, 282, 322], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoomInsert = interpolate(frame, [304, 362], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const zoom = 1 + zoomProgress * 0.1 + clickPunch * 0.07 + zoomInsert * 0.05
  // Origin: center of thumbnail grid area (roughly center-right of screen, upper area)
  const originX = 55 + zoomInsert * 8
  const originY = 35 + zoomInsert * 8

  return (
    <AbsoluteFill style={{ backgroundColor: ui.background }}>
      <ScenePage
        line1="Use assets directly from Roblox Toolbox."
        line2="Search it. Click it. Drop it in."
        size={68}
        bg={ui.background}
        hold={106}
        fade={20}
      />
      <div
        style={{
          opacity: shell,
          transform: `scale(${(0.97 + shell * 0.03) * zoom})`,
          transformOrigin: `${originX}% ${originY}%`,
        }}
      >
        <AppChrome prompt={prompt} typing={typed}>
          {/* User message */}
          <div
            style={{
              opacity: spring({ fps: video.fps, frame: frame - 12, config: springs.light }),
              transform: `translateY(${(1 - spring({ fps: video.fps, frame: frame - 12, config: springs.light })) * 14}px)`,
            }}
          >
            <UserMessage text={prompt} />
          </div>

          {/* ActionCard with toolbox results */}
          <div
            style={{
              width: "100%",
              opacity: card,
              transform: `translateY(${(1 - card) * 20}px)`,
            }}
          >
            <ActionCard
              title="Toolbox Search"
              subtitle={`"medieval village" (${assets.length} results)`}
              status="success"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(152px, 1fr))",
                  gap: 10,
                  padding: 12,
                  maxHeight: 400,
                  overflow: "hidden",
                }}
              >
                {assets.map((asset, i) => {
                  const rise = spring({ fps: video.fps, frame: frame - 108 - i * 8, config: springs.light })
                  const hit = selected && i === 0
                  const hovered = hit || hover === i
                  const bg = hit ? ui.surfaceSuccess : ui.surfaceRaised
                  const stroke = hit ? ui.borderSuccess : ui.borderWeak
                  const lift = hovered ? -2 : 0
                  const shadow = hovered ? "0 4px 12px rgba(0,0,0,0.08)" : "none"

                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 8,
                        overflow: "hidden",
                        border: `1px solid ${stroke}`,
                        backgroundColor: bg,
                        position: "relative",
                        opacity: rise,
                        transform: `translateY(${(1 - rise) * 12 + lift}px)`,
                        boxShadow: shadow,
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          backgroundColor: ui.surfaceInset,
                          borderBottom: `1px solid ${ui.borderWeak}`,
                          overflow: "hidden",
                        }}
                      >
                        <Img
                          src={staticFile(`thumbnails/${asset.thumb}`)}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>

                      {/* Info */}
                      <div
                        style={{ display: "flex", flexDirection: "column", gap: 1, padding: "6px 8px", flexGrow: 1 }}
                      >
                        <span
                          style={{
                            fontFamily: fonts.inter,
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: "16px",
                            color: ui.textStrong,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {asset.name}
                        </span>
                        <span
                          style={{
                            fontFamily: fonts.inter,
                            fontSize: 10,
                            color: ui.textWeak,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {asset.type} | {asset.creator}
                        </span>
                        <span style={{ fontFamily: fonts.inter, fontSize: 10, color: ui.textSubtle }}>
                          {asset.vote}% liked
                        </span>
                      </div>

                      {/* Hover/selected overlay button */}
                      <div
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 26,
                          height: 26,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(255,255,255,0.8)",
                          backdropFilter: "blur(8px)",
                          borderRadius: 6,
                          color: hit ? ui.iconSuccess : ui.iconBase,
                          opacity: hovered ? 1 : 0,
                        }}
                      >
                        {hit ? <CheckIcon /> : <PlusIcon />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ActionCard>
          </div>

          {frame > 284 && (
            <div
              style={{
                width: "100%",
                opacity: sync,
                transform: `translateY(${(1 - sync) * 16}px)`,
              }}
            >
              <ActionCard
                title="Insert"
                subtitle="Workspace/Map/MedievalVillage"
                status={frame > 352 ? "success" : "pending"}
              >
                <div style={{ padding: "10px 14px" }}>
                  <StepsColumn style={{ marginLeft: 0, paddingLeft: 12, paddingRight: 0, gap: 8 }}>
                    {writes.map((step, i) => {
                      const delay = 300 + i * 16
                      const done = frame > delay + 20
                      return (
                        <BasicTool
                          key={i}
                          title={step.title}
                          subtitle={step.subtitle}
                          status={done ? "success" : "running"}
                          compact
                        />
                      )
                    })}
                  </StepsColumn>
                </div>
              </ActionCard>
            </div>
          )}
        </AppChrome>
      </div>
    </AbsoluteFill>
  )
}
