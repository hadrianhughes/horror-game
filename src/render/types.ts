import { Maybe } from '../types'

export class PixelGrid {
  grid: string[][]

  constructor(width: number, height: number) {
    const grid = (new Array(height)).map(_ => new Array(width))
    this.grid = grid
  }

  get = (x: number, y: number): Maybe<string> => this.grid[y][x]
}

export type RenderContext = {
  canvasContext: CanvasRenderingContext2D;
  fov: number;
  pixelGrid: PixelGrid;
}
