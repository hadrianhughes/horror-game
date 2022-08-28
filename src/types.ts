export type Vector = [number, number]

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

export type GameMap = {
  size: {
    width: number;
    height: number;
  };
  vertices: Vector[];
  sectors: Sector[];
  nodes: [BSPNode, BSPNode];
}
