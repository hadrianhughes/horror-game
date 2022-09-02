export const roundTo = (x: number, dp: number) => {
  const factor = Math.pow(10, dp)
  return Math.round((x + Number.EPSILON) * factor) / factor
}

export const residue = (x: number, mod: number): number => x % mod

export const eqSets = <T>(a: Set<T>, b: Set<T>): boolean => a.size === b.size && Array.from(a).every(e => b.has(e))
