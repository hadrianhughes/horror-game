import { vec2 } from 'gl-matrix'
import { findCameraNode, BSPMap, BSPMapNode } from '../bsp'
import { rad, Quadrant, quadrant, x, y } from '../math/geometry'
import { eqSets } from '../math'
import { RenderContext } from './types'

export const FOV = rad(45)
export const RIGHT_FOV_BOUND = Math.PI / 2 - FOV / 2
export const LEFT_FOV_BOUND = Math.PI / 2 + FOV / 2

// Pixel height of a segment when the camera is 1 unit away and the wall is 1 unit tall
export const BASE_SEG_HEIGHT = 500

export const CANVAS_RATIO = 16 / 9

export const initContext = (canvas: HTMLCanvasElement): RenderContext => {
  canvas.width = window.innerWidth
  canvas.height = window.innerWidth / CANVAS_RATIO

  const ctx = canvas.getContext('2d')

  return { canvas, ctx }
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

export const renderWallInside = (ctx: RenderContext, v1: vec2, v2: vec2) => {
  console.log('render inside')
}

export const renderWallAcrossFOV = (ctx: RenderContext, v1: vec2, v2: vec2) => {
  console.log('render across')
}

export const renderWallAtSide = (ctx: RenderContext, vInside: vec2, vOutside: vec2) => {
  if (x(vOutside) < 0) {
    console.log('render left side')
  } else {
    console.log('render right side')
  }
}

export const renderNode = (ctx: RenderContext, node: BSPMapNode, camera: vec2) => {
  // Find walls between vertices that are visible in the camera
  for (const [v1, v2, color] of node.walls) {
    if (!color) continue

    const i = vec2.subtract(vec2.create(), node.vertices[v1], camera)
    const j = vec2.subtract(vec2.create(), node.vertices[v2], camera)

    const ic = vec2.fromValues(x(i), -y(i))
    const jc = vec2.fromValues(x(j), -y(j))

    const qic = quadrant(ic)
    const qjc = quadrant(jc)

    const iInFOV = isVectorInFOV(ic)
    const jInFOV = isVectorInFOV(jc)

    if (iInFOV && jInFOV) {
      renderWallInside(ctx, ic, jc)
    } else if (iInFOV) {
      renderWallAtSide(ctx, ic, jc)
    } else if (jInFOV) {
      renderWallAtSide(ctx, jc, ic)
    } else if (eqSets(new Set([qic, qjc]), new Set([Quadrant.Q1, Quadrant.Q2]))) {
      renderWallAcrossFOV(ctx, ic, jc)
    }
  }
}

export const render = (ctx: RenderContext, map: BSPMap, camera: vec2) => {
  const firstNode = map.map[findCameraNode(camera, map)]
  renderNode(ctx, firstNode, camera)
}
