export function formatDate(date: string) {
  if (date === undefined || date.length < 10) {
    return ''
  }

  return date.substring(0, 10)
}
