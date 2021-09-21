export function normalizeContentfulType(type) {
  if (!type) {
    return null
  }

  return type.replace(`Contentful`, "")
}
