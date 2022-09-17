import { vec2 } from 'gl-matrix'
import { findCameraNode, BSPMap, BSPMapNode } from '../bsp'
import { residue } from '../math'
import { rad, Quadrant, quadrant, destructVec } from '../math/geometry'
import { eqSets } from '../math'
import { RenderContext } from './types'

export const FOV = rad(45)

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
  const [x, y] = destructVec(v)
  const theta = Math.atan2(Math.abs(x), Math.abs(y))

  const q = quadrant(v)
  const ccAngle: number = (() => {
    switch (q) {
      case Quadrant.Q1:
        return theta
      case Quadrant.Q2:
        return Math.PI - theta
      case Quadrant.Q3:
        return Math.PI + theta
      case Quadrant.Q4:
        return 2 * Math.PI - theta
    }
  })()

  const adjAngle = ccAngle + FOV / 2

  return residue(adjAngle, 2 * Math.PI) < FOV
}

export const renderNode = (ctx: RenderContext, node: BSPMapNode, camera: vec2) => {
  // Find walls between vertices that are visible in the camera
  for (const [v1, v2, color] of node.walls) {
    if (!color) continue

    const i = vec2.subtract(vec2.create(), node.vertices[v1], camera)
    const j = vec2.subtract(vec2.create(), node.vertices[v2], camera)

    const [ix, iy] = destructVec(i)
    const [jx, jy] = destructVec(j)

    const ic = vec2.fromValues(ix, -iy)
    const jc = vec2.fromValues(jx, -jy)

    const qic = quadrant(ic)
    const qjc = quadrant(jc)

    const wallAcrossFOV = eqSets(new Set([qic, qjc]), new Set([Quadrant.Q1, Quadrant.Q2]))

    if (!(wallAcrossFOV || isVectorInFOV(ic) || isVectorInFOV(jc))) {
      continue
    }

    console.log(ic, jc)
    //console.log('render', color)
  }
}

export const render = (ctx: RenderContext, map: BSPMap, camera: vec2) => {
  const firstNode = map.map[findCameraNode(camera, map)]
  renderNode(ctx, firstNode, camera)
}
