import { Vector } from './types'

export const deg = (rads: number): number => rads * (180 / Math.PI)

export const rad = (degs: number): number => degs * (Math.PI / 180)

export const dotProduct = ([ax, ay]: Vector, [bx, by]: Vector): number => ax * bx + ay * by

export const magnitude = ([x, y]: Vector): number => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

export const roundTo = (x: number, dp: number) => {
  const factor = Math.pow(10, dp)
  return Math.round((x + Number.EPSILON) * factor) / factor
}
