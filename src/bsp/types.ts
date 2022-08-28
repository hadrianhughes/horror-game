import { Dict, Vector } from '../types'

export type Sector = {
  vertices: Vector[];
  floor: number;
  ceiling: number;
};

export type BSPNode = {
  sector: number;
  vertices: Vector[];
  nodes?: [BSPNode, BSPNode];
}

export type BSPMapNode = {
  sector: number;
  vertices: Vector[];
  nodes?: [string, string];
}

export type PartialBSPMap = Dict<BSPMapNode>

export type BSPMap = {
  roots: [string, string];
  map: PartialBSPMap;
}

export type GameMap = {
  size: {
    width: number;
    height: number;
  };
  vertices: Vector[];
  sectors: Sector[];
  nodes: [BSPNode, BSPNode];
}
