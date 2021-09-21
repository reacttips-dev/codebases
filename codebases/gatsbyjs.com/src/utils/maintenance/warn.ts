export function warn(message: string, level: `warning` | `error` = `warning`) {
  if (process.env.NODE_ENV === `development`) {
    if (level === `error`) {
      console.error(message)
    } else {
      console.warn(message)
    }
  }
}
