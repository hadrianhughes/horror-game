import { vec2 } from 'gl-matrix'
import { nanoid } from 'nanoid'
import { PartialBSPMap, BSPNode, BSPMap, BSPMapNode, GameMap } from './types'
import { roundTo } from '../math'

const _findCameraNode = (camera: vec2, _map: BSPMap, id: string): string => {
  const { map } = _map

  const node = map[id]

  if (!node.nodes) {
    return id
  }

  const [aid, bid] = node.nodes
  const a = map[aid]
  const b = map[bid]

  if (isCameraInNode(camera, a)) {
    return _findCameraNode(camera, _map, aid)
  }

  if (isCameraInNode(camera, b)) {
    return _findCameraNode(camera, _map, bid)
  }

  throw new Error(`Camera location (${camera[0], camera[1]}) is not inside the map`)
}

export const findCameraNode = (camera: vec2, _map: BSPMap): string => {
  const { roots, map } = _map

  const [aid, bid] = roots
  const a = map[aid]
  const b = map[bid]

  if (isCameraInNode(camera, a)) {
    return _findCameraNode(camera, _map, aid)
  }

  if (isCameraInNode(camera, b)) {
    return _findCameraNode(camera, _map, bid)
  }

  throw new Error(`Camera location (${camera[0], camera[1]}) is not inside the map.`)
}

// The sum of the angle from camera to vertices will be 360deg (2π) if the camera is inside
export const isCameraInNode = (camera: vec2, node: BSPMapNode): boolean => {
  const angleSum: number = node.walls.reduce((acc, [v1, v2, _]) => {
    const i = node.vertices[v1]
    const j = node.vertices[v2]

    const pi = vec2.subtract(vec2.create(), camera, i)
    const pj = vec2.subtract(vec2.create(), camera, j)

    return acc + vec2.angle(pi, pj)
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
