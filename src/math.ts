import { Vector } from './types'

export const deg = (rads: number): number => rads * (180 / Math.PI)

export const rad = (degs: number): number => degs * (Math.PI / 180)

export const dotProduct = ([ax, ay]: Vector, [bx, by]: Vector): number => ax * bx + ay * by

export const magnitude = ([x, y]: Vector): number => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

export const roundTo = (x: number, dp: number) => {
  const factor = Math.pow(10, dp)
  return Math.round((x + Number.EPSILON) * factor) / factor
}

export const addVec = ([ax, ay]: Vector, [bx, by]: Vector): Vector => [ax + bx, ay + by]

export const subVec = (a: Vector, [bx, by]: Vector): Vector => addVec(a, [-bx, -by])

// Starting from the vertical
export const quadrant = ([x, y]: Vector): (1 | 2 | 3 | 4) => {
  if (x <= 0 && y > 0) return 1
  if (x <= 0 && y <= 0) return 2
  if (x > 0 && y <= 0) return 3
  if (x > 0 && y > 0) return 4
}

export const residue = (x: number, mod: number): number => x % mod
