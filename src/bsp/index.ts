import { nanoid } from 'nanoid'
import { Vector } from '../types'
import { PartialBSPMap, BSPNode, BSPMap, BSPMapNode, GameMap } from './types'
import { roundTo } from '../math'
import { dot, magnitude } from '../math/geometry'

const _findPlayerNode = (player: Vector, _map: BSPMap, id: string): string => {
  const { map } = _map

  const node = map[id]

  if (!node.nodes) {
    return id
  }

  const [aid, bid] = node.nodes
  const a = map[aid]
  const b = map[bid]

  if (isPlayerInNode(player, a)) {
    return _findPlayerNode(player, _map, aid)
  }

  if (isPlayerInNode(player, b)) {
    return _findPlayerNode(player, _map, bid)
  }

  throw new Error(`Player location (${player[0], player[1]}) is not inside the map`)
}

export const findPlayerNode = (player: Vector, _map: BSPMap): string => {
  const { roots, map } = _map

  const [aid, bid] = roots
  const a = map[aid]
  const b = map[bid]

  if (isPlayerInNode(player, a)) {
    return _findPlayerNode(player, _map, aid)
  }

  if (isPlayerInNode(player, b)) {
    return _findPlayerNode(player, _map, bid)
  }

  throw new Error(`Player location (${player[0], player[1]}) is not inside the map.`)
}

// The sum of the angle from player to vertices will be 360deg (2π) if the player is inside
export const isPlayerInNode = ([px, py]: Vector, node: BSPMapNode): boolean => {
  const angleSum: number = node.walls.reduce((acc, [v1, v2, _]) => {
    const [ix, iy] = node.vertices[v1]
    const [jx, jy] = node.vertices[v2]

    const pi: Vector = [px - ix, py - iy]
    const pj: Vector = [px - jx, py - jy]

    const innerAngle = Math.acos(dot(pi, pj) / (magnitude(pi) * magnitude(pj)))
    return acc + innerAngle
  }, 0)

  return roundTo(angleSum, 2) === 6.28
}

const bspTreeToMap = (tree: BSPNode, acc: PartialBSPMap): { id: string; map: PartialBSPMap } => {
  if (!tree.nodes) {
    const id = nanoid()

    return {
      id,
      map: {
        ...acc,
        [id]: {
          vertices: tree.vertices,
          floor: tree.floor,
          ceiling: tree.ceiling,
          walls: tree.walls,
        },
      },
    }
  }

  const [a, b] = tree.nodes
  const { id: aid, map: aMap } = bspTreeToMap(a, acc)
  const { id: bid, map: bMap } = bspTreeToMap(b, acc)

  const id = nanoid()

  return {
    id,
    map: {
      ...acc,
      ...aMap,
      ...bMap,
      [id]: {
        vertices: tree.vertices,
        floor: tree.floor,
        ceiling: tree.ceiling,
        walls: tree.walls,
        nodes: [aid, bid],
      },
    },
  }
}

export const mapTreeToMap = ({ nodes }: GameMap): BSPMap => {
  const { id: aid, map: aMap } = bspTreeToMap(nodes[0], {})
  const { id: bid, map: bMap } = bspTreeToMap(nodes[1], {})

  return {
    roots: [aid, bid],
    map: {
      ...aMap,
      ...bMap,
    },
  }
}

export { Sector, BSPNode, BSPMapNode, PartialBSPMap, BSPMap, GameMap } from './types'
