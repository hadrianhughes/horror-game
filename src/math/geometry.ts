import { vec2 } from 'gl-matrix'

export const deg = (rads: number): number => rads * (180 / Math.PI)

export const rad = (degs: number): number => degs * (Math.PI / 180)

export const x = (v: vec2): number => v[0]
export const y = (v: vec2): number => v[1]

// Starting from the vertical
export enum Quadrant {
  Q1 = 'q1',
  Q2 = 'q2',
  Q3 = 'q3',
  Q4 = 'q4',
}

export const quadrant = (v: vec2): Quadrant => {
  const _x = x(v)
  const _y = y(v)

  if (_x >= 0 && _y >= 0) return Quadrant.Q1
  if (_x < 0 && _y >= 0) return Quadrant.Q2
  if (_x < 0 && _y < 0) return Quadrant.Q3
  if (_x >= 0 && _y < 0) return Quadrant.Q4
}
