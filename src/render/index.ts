import { findPlayerNode, BSPMap, BSPMapNode } from '../bsp'
import { residue } from '../math'
import { rad, subVec, quadrant } from '../math/geometry'
import { eqSets } from '../math'
import { Vector } from '../types'

const FOV = rad(45)

const isVectorInFOV = (v: Vector): boolean => {
  const [x, y] = v
  const theta = Math.atan2(Math.abs(x), Math.abs(y))

  const q = quadrant(v)
  const ccAngle: number = (() => {
    switch (q) {
      case 1:
        return theta
      case 2:
        return Math.PI - theta
      case 3:
        return Math.PI + theta
      case 4:
        return 2 * Math.PI - theta
    }
  })()

  const adjAngle = ccAngle + FOV / 2

  return residue(adjAngle, 2 * Math.PI) < FOV
}

export const renderNode = (node: BSPMapNode, player: Vector) => {
  // Find walls between vertices that are visible in the camera
  for (const [v1, v2, color] of node.walls) {
    if (!color) continue

    const [ix, iy] = subVec(node.vertices[v1], player)
    const [jx, jy] = subVec(node.vertices[v2], player)

    const ip: Vector = [ix, -iy]
    const jp: Vector = [jx, -jy]

    const qip = quadrant(ip)
    const qjp = quadrant(jp)

    const wallAcrossFOV = eqSets(new Set([qip, qjp]), new Set([1, 2]))

    if (!(wallAcrossFOV || isVectorInFOV(ip) || isVectorInFOV(jp))) {
      continue
    }

    console.log('render', color)
  }
}

export const render = (map: BSPMap, player: Vector) => {
  const firstNode = map.map[findPlayerNode(player, map)]
  renderNode(firstNode, player)
}
