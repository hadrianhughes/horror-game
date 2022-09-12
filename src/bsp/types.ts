import { vec2 } from 'gl-matrix'
import { Dict, Maybe } from '../types'

export type Sector = {
  walls: {
    vertex: number;
    color: Maybe<string>;
  }[];
  floor: number;
  ceiling: number;
};

export type Wall = [number, number, Maybe<string>]

export type BSPNode = {
  vertices: vec2[];
  floor: number;
  ceiling: number;
  walls: Wall[];
  nodes?: [BSPNode, BSPNode];
}

export type BSPMapNode = {
  vertices: vec2[];
  floor: number;
  ceiling: number;
  walls: Wall[];
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
  vertices: vec2[];
  sectors: Sector[];
  nodes: [BSPNode, BSPNode];
}
