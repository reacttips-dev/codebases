export const toArray = (input?: any) => {
  if (Array.isArray(input)) {
    return input
  }

  if (!input) {
    return []
  }

  return [input]
}
