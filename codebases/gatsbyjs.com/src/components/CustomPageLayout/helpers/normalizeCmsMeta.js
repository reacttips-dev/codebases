import { normalizeContentfulType } from "./normalizeContentfulType"

export function normalizeCmsMeta(data) {
  return {
    spaceId: data.spaceId,
    entryId: data.contentful_id,
    entryName: data.name,
    entryType: normalizeContentfulType(data.__typename),
  }
}
