import { findPlayerNode, BSPMap, walkWalls } from '../bsp'
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

export const renderNode = (vertices: Vector[], player: Vector, color: string) => {
  // Find walls between vertices that are visible in the camera
  walkWalls(vertices, (v1, v2) => {
    const [ix, iy] = subVec(v1, player)
    const [jx, jy] = subVec(v2, player)

    const ip: Vector = [ix, -iy]
    const jp: Vector = [jx, -jy]

    const qip = quadrant(ip)
    const qjp = quadrant(jp)

    const wallAcrossFOV = eqSets(new Set([qip, qjp]), new Set([1, 2]))

    if (!(wallAcrossFOV || isVectorInFOV(ip) || isVectorInFOV(jp))) {
      return
    }

    console.log('render')
  })
}

export const render = (map: BSPMap, player: Vector) => {
  const firstNodeID = findPlayerNode(player, map)
  const firstNode = map.map[firstNodeID]
  renderNode(firstNode.vertices, player, 'red')
}
