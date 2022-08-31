import { findPlayerNode, BSPMap, walkWalls } from '../bsp'
import { asAngle, rad, subVec, quadrant } from '../math'
import { Vector } from '../types'

const FOV = rad(45)

const isVectorInFOV = (v: Vector): boolean => {
  const [x, y] = v
  const theta = Math.atan2(Math.abs(x), Math.abs(y))

  const q = quadrant(v)
  const ccAngle: number = (() => {
    if (q === 1) return theta
    if (q === 2) return Math.PI - theta
    if (q === 3) return Math.PI + theta
    if (q === 4) return 2 * Math.PI - theta
  })()

  const adjAngle = ccAngle + FOV / 2

  return asAngle(adjAngle) < FOV
}

export const renderNode = (vertices: Vector[], player: Vector, color: string) => {
  // Find walls between vertices that are visible in the camera
  walkWalls(vertices, (v1, v2) => {
    const [ix, iy] = subVec(v1, player)
    const [jx, jy] = subVec(v2, player)

    const ip: Vector = [ix, -iy]
    const jp: Vector = [jx, -jy]

    console.log(isVectorInFOV(ip), isVectorInFOV(jp))
    if (!(isVectorInFOV(ip) || isVectorInFOV(jp))) return
  })
}

export const render = (map: BSPMap, player: Vector) => {
  const firstNodeID = findPlayerNode(player, map)
  const firstNode = map.map[firstNodeID]
  renderNode(firstNode.vertices, player, 'red')
}
