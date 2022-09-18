import { vec2 } from 'gl-matrix'
import { findCameraNode, BSPMap, BSPMapNode } from '../bsp'
import { Quadrant, quadrant, x, y } from '../math/geometry'
import { eqSets } from '../math'
import { RenderContext } from './types'
import { CANVAS_RATIO, SEG_COUNT, RIGHT_FOV_BOUND, LEFT_FOV_BOUND, PROJ_PLANE_DIST } from './config'

export const initContext = (canvas: HTMLCanvasElement): RenderContext => {
  canvas.width = window.innerWidth
  canvas.height = window.innerWidth / CANVAS_RATIO

  const ctx = canvas.getContext('2d')
  const camera = vec2.fromValues(55, 50)

  return { canvas, ctx, camera }
}

const isVectorInFOV = (v: vec2): boolean => {
  const _x = x(v)
  const _y = y(v)
  const theta = Math.atan2(Math.abs(_y), Math.abs(_x))

  const q = quadrant(v)

  if (!(new Set([Quadrant.Q1, Quadrant.Q2]).has(q))) {
    return false
  }

  const fullAngle: number = (() => {
    switch (q) {
      case Quadrant.Q1:
        return theta
      case Quadrant.Q2:
        return Math.PI - theta
    }
  })()

  return fullAngle > RIGHT_FOV_BOUND && fullAngle < LEFT_FOV_BOUND
}

const segHeight = (camera: vec2, point: vec2, floor: number, ceiling: number): number => {
  const actual = ceiling - floor
  const dist = vec2.distance(camera, point)

  return actual / dist * PROJ_PLANE_DIST
}

const renderWallInside = (ctx: RenderContext, v1: vec2, v2: vec2, floor: number, ceiling: number, color: string) => {
  console.log('render inside')
}

const renderWallAcrossFOV = (ctx: RenderContext, v1: vec2, v2: vec2, floor: number, ceiling: number, color: string) => {
  console.log('render across')
}

const renderWallAtSide = (ctx: RenderContext, vInside: vec2, vOutside: vec2, floor: number, ceiling: number, color: string) => {
  const startHeight = segHeight(ctx.camera, vInside, floor, ceiling)
  const endHeight = segHeight(ctx.camera, vOutside, floor, ceiling)
  const gradient = startHeight / endHeight

  if (x(vOutside) < 0) {
    console.log('render left side')
  } else {
    console.log('render right side')
  }
}

export const renderNode = (ctx: RenderContext, node: BSPMapNode) => {
  // Find walls between vertices that are visible in the camera
  for (const [v1, v2, color] of node.walls) {
    if (!color) continue

    const i = vec2.subtract(vec2.create(), node.vertices[v1], ctx.camera)
    const j = vec2.subtract(vec2.create(), node.vertices[v2], ctx.camera)

    const ic = vec2.fromValues(x(i), -y(i))
    const jc = vec2.fromValues(x(j), -y(j))

    const qic = quadrant(ic)
    const qjc = quadrant(jc)

    const iInFOV = isVectorInFOV(ic)
    const jInFOV = isVectorInFOV(jc)

    if (iInFOV && jInFOV) {
      renderWallInside(ctx, ic, jc, node.floor, node.ceiling, color)
    } else if (iInFOV) {
      renderWallAtSide(ctx, ic, jc, node.floor, node.ceiling, color)
    } else if (jInFOV) {
      renderWallAtSide(ctx, jc, ic, node.floor, node.ceiling, color)
    } else if (eqSets(new Set([qic, qjc]), new Set([Quadrant.Q1, Quadrant.Q2]))) {
      renderWallAcrossFOV(ctx, ic, jc, node.floor, node.ceiling, color)
    }
  }
}

export const render = (ctx: RenderContext, map: BSPMap, camera: vec2) => {
  const firstNode = map.map[findCameraNode(camera, map)]
  renderNode(ctx, firstNode)
}
