import { BSPNode, Vector, GameMap } from './types'
import { dotProduct, magnitude, roundTo } from './math'

const _findPlayerNode = (player: Vector, node: BSPNode): BSPNode => {
  if (!node.nodes) {
    return node
  }

  const [a, b] = node.nodes

  if (isPlayerInNode(player, a)) {
    return _findPlayerNode(player, a)
  }

  if (isPlayerInNode(player, b)) {
    return _findPlayerNode(player, b)
  }

  throw new Error(`Player location (${player[0], player[1]}) is not inside the map`)
}

export const findPlayerNode = (player: Vector, { nodes }: GameMap): BSPNode => {
  const [a, b] = nodes

  if (isPlayerInNode(player, a)) {
    return _findPlayerNode(player, a)
  }

  if (isPlayerInNode(player, b)) {
    return _findPlayerNode(player, b)
  }

  throw new Error(`Player location (${player[0], player[1]}) is not inside the map.`)
}

// The sum of the angle from player to vertices will be 360deg (2π) if the player is inside
export const isPlayerInNode = ([px, py]: Vector, { vertices }: BSPNode): boolean => {
  let sum = 0

  for (const index in vertices) {
    const i = parseInt(index)
    const j = i + 1 === vertices.length ? 0 : i + 1

    const [ix, iy] = vertices[i]
    const [jx, jy] = vertices[j]

    const pi: Vector = [px - ix, py - iy]
    const pj: Vector = [px - jx, py - jy]

    const _dot = dotProduct(pi, pj)

    const innerAngle = Math.acos(_dot / (magnitude(pi) * magnitude(pj)))
    sum += innerAngle
  }

  return roundTo(sum, 2) === 6.28
}
