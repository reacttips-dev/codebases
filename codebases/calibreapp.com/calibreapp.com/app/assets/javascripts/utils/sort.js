export const sortByString = (a = '', b = '', direction = 'asc') => {
  const primary = a?.toLowerCase()
  const secondary = b?.toLowerCase()

  if (direction === 'asc') {
    if (primary < secondary) return -1
    if (primary > secondary) return 1
  }

  if (direction === 'desc') {
    if (primary > secondary) return -1
    if (primary < secondary) return 1
  }

  return 0
}

export const sortByInteger = (primary, secondary, direction = 'asc') => {
  if (primary === secondary) return 0
  if (primary === null) return 1
  if (secondary === null) return -1

  if (direction === 'asc') return primary < secondary ? -1 : 1
  if (direction === 'desc') return primary < secondary ? 1 : -1

  return 0
}
