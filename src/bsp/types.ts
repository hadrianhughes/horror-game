import { Dict, Vector, Maybe } from '../types'

export type Sector = {
  walls: {
    vertex: number;
    color: Maybe<string>;
  }[];
  floor: number;
  ceiling: number;
};

export type BSPNode = {
  vertices: Vector[];
  floor: number;
  ceiling: number;
  walls: [number, number, Maybe<string>][];
  nodes?: [BSPNode, BSPNode];
}

export type BSPMapNode = {
  vertices: Vector[];
  floor: number;
  ceiling: number;
  walls: [number, number, Maybe<string>][];
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
