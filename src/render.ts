import { findPlayerNode } from './bsp'
import { BSPMap, Vector } from './types'

export const render = (ctx: CanvasRenderingContext2D, map: BSPMap, player: Vector) => {
  const firstNode = findPlayerNode(player, map)
}
