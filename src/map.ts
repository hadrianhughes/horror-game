import { BSPNode, GameMap } from './bsp'
import { Maybe, Vector } from './types'

export type SectorJSON = {
  walls: [number, Maybe<string>][];
  floor: number;
  ceiling: number;
}

export type MapJSON = {
  size: {
    width: number;
    height: number;
  };
  vertices: Vector[];
  sectors: SectorJSON[];
  nodes: [BSPNode, BSPNode];
}

export const loadMap = (data: MapJSON): GameMap => {
  if (data.size.width <= 0 || data.size.height <= 0) {
    throw new Error(`${data.size.width}x${data.size.height} is not a valid map size`)
  }

  return {
    size: data.size,
    vertices: data.vertices,
    sectors: data.sectors.map(s => ({
      floor: s.floor,
      ceiling: s.ceiling,
      walls: s.walls.map(w => ({
        vertex: w[0],
        color: w[1],
      })),
    })),
    nodes: data.nodes,
  }
}
