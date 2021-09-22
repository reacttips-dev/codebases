import { TRUNCATE_LIMIT } from '../constants'

const PLACEMENT_END = 'end'
const PLACEMENT_CENTER = 'center'
const TOTAL_EMAIL_LIMIT = 50
const TOTAL_EMAIL_NAME_LIMIT = 30
const ELLIPSIS = '...'

export const truncate = (str?: string, strPlacement = PLACEMENT_END, limit?: number) => {
  if (!str) {
    return str
  }

  const strLimit = limit || TRUNCATE_LIMIT

  if (!str) {
    return ''
  }

  if (str.length > strLimit) {
    if (strPlacement === PLACEMENT_END) {
      return str.slice(0, strLimit).concat(ELLIPSIS)
    }
    if (strPlacement === PLACEMENT_CENTER) {
      return `${str.slice(0, strLimit / 2)}${ELLIPSIS}${str.slice(-1 * (strLimit / 2))}`
    }
  }
  return str
}

export const truncateEmail = (
  email?: string,
  nameLimit = TOTAL_EMAIL_NAME_LIMIT,
  totalLimit = TOTAL_EMAIL_LIMIT
) => {
  if (!email) {
    return email
  }

  const [name, domain] = email.split('@')

  /*
  Make sure it never goes over totalLimit. If it's over the total length,
  the difference needs to be removed from the name limit (pre "@" string)
  */

  // Total length if no adjustments were made
  const outputLength = `@${domain}`.length + ELLIPSIS.length + nameLimit

  // The adjusted total limit for the total output
  const actualLimit =
    outputLength > totalLimit ? nameLimit - (outputLength - totalLimit) : nameLimit

  // When the output will exceed the total limit and the adjustment gives a weird value
  // this will catch that and truncate both the name and domain of the email
  if (outputLength > totalLimit && actualLimit < 0) {
    const limit = Math.floor(totalLimit / 2)

    return `${truncate(name, PLACEMENT_END, limit)}@${truncate(
      domain,
      PLACEMENT_CENTER,
      limit
    )}`
  }

  return `${truncate(name, PLACEMENT_END, actualLimit)}@${domain}`
}

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
