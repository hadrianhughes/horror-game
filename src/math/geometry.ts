import { Vector } from '../types'

export const deg = (rads: number): number => rads * (180 / Math.PI)

export const rad = (degs: number): number => degs * (Math.PI / 180)

export const dot = ([ax, ay]: Vector, [bx, by]: Vector): number => ax * bx + ay * by

export const magnitude = ([x, y]: Vector): number => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

export const addVec = ([ax, ay]: Vector, [bx, by]: Vector): Vector => [ax + bx, ay + by]

export const subVec = (a: Vector, [bx, by]: Vector): Vector => addVec(a, [-bx, -by])

// Starting from the vertical
export enum Quadrant { Q1, Q2, Q3, Q4 }

export const quadrant = ([x, y]: Vector): Quadrant => {
  if (x <= 0 && y > 0) return Quadrant.Q1
  if (x <= 0 && y <= 0) return Quadrant.Q2
  if (x > 0 && y <= 0) return Quadrant.Q3
  if (x > 0 && y > 0) return Quadrant.Q4
}
