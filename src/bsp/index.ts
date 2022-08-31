import { nanoid } from 'nanoid'
import { Vector } from '../types'
import { PartialBSPMap, BSPNode, BSPMap, GameMap } from './types'
import { dotProduct, magnitude, roundTo } from '../math'

const _findPlayerNode = (player: Vector, _map: BSPMap, id: string): string => {
  const { map } = _map

  const node = map[id]

  if (!node.nodes) {
    return id
  }

  const [aid, bid] = node.nodes
  const a = map[aid]
  const b = map[bid]

  if (isPlayerInNode(player, a.vertices)) {
    return _findPlayerNode(player, _map, aid)
  }

  if (isPlayerInNode(player, b.vertices)) {
    return _findPlayerNode(player, _map, bid)
  }

  throw new Error(`Player location (${player[0], player[1]}) is not inside the map`)
}

export const findPlayerNode = (player: Vector, _map: BSPMap): string => {
  const { roots, map } = _map

  const [aid, bid] = roots
  const a = map[aid]
  const b = map[bid]

  if (isPlayerInNode(player, a.vertices)) {
    return _findPlayerNode(player, _map, aid)
  }

  if (isPlayerInNode(player, b.vertices)) {
    return _findPlayerNode(player, _map, bid)
  }

  throw new Error(`Player location (${player[0], player[1]}) is not inside the map.`)
}

export const walkWalls = (vertices: Vector[], f: (v1: Vector, v2: Vector) => void) => {
  for (const index in vertices) {
    const i = parseInt(index)
    const j = i + 1 === vertices.length ? 0 : i + 1

    f(vertices[i], vertices[j])
  }
}

// The sum of the angle from player to vertices will be 360deg (2π) if the player is inside
export const isPlayerInNode = ([px, py]: Vector, vertices: Vector[]): boolean => {
  let sum = 0

  walkWalls(vertices, ([ix, iy], [jx, jy]) => {
    const pi: Vector = [px - ix, py - iy]
    const pj: Vector = [px - jx, py - jy]

    const innerAngle = Math.acos(dotProduct(pi, pj) / (magnitude(pi) * magnitude(pj)))
    sum += innerAngle
  })

  return roundTo(sum, 2) === 6.28
}

const bspTreeToMap = (tree: BSPNode, acc: PartialBSPMap): { id: string; map: PartialBSPMap } => {
  if (!tree.nodes) {
    const id = nanoid()

    return {
      id,
      map: {
        ...acc,
        [id]: {
          sector: tree.sector,
          vertices: tree.vertices,
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
        sector: tree.sector,
        vertices: tree.vertices,
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
