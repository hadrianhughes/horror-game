import { vec2 } from 'gl-matrix'

export const deg = (rads: number): number => rads * (180 / Math.PI)

export const rad = (degs: number): number => degs * (Math.PI / 180)

export const destructVec = (v: vec2): [number, number] => [v[0], v[1]]

// Starting from the vertical
export enum Quadrant { Q1, Q2, Q3, Q4 }

export const quadrant = (v: vec2): Quadrant => {
  const [x, y] = destructVec(v)

  if (x <= 0 && y > 0) return Quadrant.Q1
  if (x <= 0 && y <= 0) return Quadrant.Q2
  if (x > 0 && y <= 0) return Quadrant.Q3
  if (x > 0 && y > 0) return Quadrant.Q4
}
