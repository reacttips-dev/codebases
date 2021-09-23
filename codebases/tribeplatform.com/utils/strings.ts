export const capitalize = (string: string): string => {
  if (typeof string === 'string') {
    if (!string) {
      return ''
    }
    return string[0].toUpperCase() + string.slice(1)
  }
  return string
}

export const truncate = (input: string, length): string => {
  if (!input) {
    return ''
  }
  return input.length > length ? `${input.substring(0, length - 1)}...` : input
}
