import { findPlayerNode, BSPMap } from '../bsp'
import { rad } from '../math'
import { Vector } from '../types'
import { RenderContext } from './types'

const FOV = rad(45)

export const renderNode = (
  ctx: RenderContext,
  vertices: Vector[],
  player: Vector[],
  color: string,
) => {
  // Find walls between vertices that are visible in the camera
}

export const render = (ctx: RenderContext, map: BSPMap, player: Vector) => {
  const firstNodeID = findPlayerNode(player, map)
  const firstNode = map.map[firstNodeID]
}
