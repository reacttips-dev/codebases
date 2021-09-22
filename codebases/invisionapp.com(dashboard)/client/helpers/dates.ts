// Date difference.
// milliseconds to:
// - secs: / 1000
// - mins: / 60 * 1000
// - hours: / 60 * 60 * 1000
// - days: / 24 * 60 * 60 * 1000

export const ONE_DAY_MS = 86400000

export const getMinsFromNow = (date?: Date | string): number => {
  if (!date) {
    return 0
  }

  const duration = new Date().getTime() - new Date(date).getTime()
  return Math.floor(duration / 60000)
}

export const getDaysFromNow = (date?: Date | string): number => {
  if (!date) {
    return 0
  }

  const duration = new Date().getTime() - new Date(date).getTime()
  return Math.floor(duration / 86400000)
}
