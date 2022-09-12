import { vec2 } from 'gl-matrix'
import { findPlayerNode, BSPMap, BSPMapNode } from '../bsp'
import { residue } from '../math'
import { rad, Quadrant, quadrant, destructVec } from '../math/geometry'
import { eqSets } from '../math'

const FOV = rad(45)

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

export const renderNode = (node: BSPMapNode, player: vec2) => {
  // Find walls between vertices that are visible in the camera
  for (const [v1, v2, color] of node.walls) {
    if (!color) continue

    const i = vec2.subtract(vec2.create(), node.vertices[v1], player)
    const j = vec2.subtract(vec2.create(), node.vertices[v2], player)

    const [ix, iy] = destructVec(i)
    const [jx, jy] = destructVec(j)

    const ip = vec2.fromValues(ix, -iy)
    const jp = vec2.fromValues(jx, -jy)

    const qip = quadrant(ip)
    const qjp = quadrant(jp)

    const wallAcrossFOV = eqSets(new Set([qip, qjp]), new Set([Quadrant.Q1, Quadrant.Q2]))

    if (!(wallAcrossFOV || isVectorInFOV(ip) || isVectorInFOV(jp))) {
      continue
    }

    console.log('render', color)
  }
}

export const render = (map: BSPMap, player: vec2) => {
  const firstNode = map.map[findPlayerNode(player, map)]
  renderNode(firstNode, player)
}
