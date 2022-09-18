import { vec2 } from 'gl-matrix'

export type RenderContext = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  camera: vec2;
}
