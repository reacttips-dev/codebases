export const uniqueByKey = <T>(array: T[], key: keyof T): T[] =>
  array.reduce(
    (x, y) => (x.findIndex(e => e[key] === y[key]) < 0 ? [...x, y] : x),
    [],
  )

export const subtract = <T>(a: T[], b: T[], key: keyof T): T[] => {
  const bSet = b.map(it => it[key])

  return a.filter(o1 => !bSet.includes(o1[key]))
}

export const range = n => Array.from({ length: n }, (value, key) => key)

export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K,
): Record<K, T[]> => {
  if (!list) {
    return {} as Record<K, T[]>
  }

  return list.reduce((previous, currentItem) => {
    const group = getKey(currentItem)
    if (!previous[group]) {
      previous[group] = []
    }
    previous[group].push(currentItem)
    return previous
  }, {} as Record<K, T[]>)
}

export function toRecord<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  selector: K,
): Record<T[K], T> {
  if (!array) {
    return {} as Record<T[K], T>
  }

  return array?.reduce(
    (acc, item) => ({ ...acc, [item[selector]]: item }),
    {} as Record<T[K], T>,
  )
}
