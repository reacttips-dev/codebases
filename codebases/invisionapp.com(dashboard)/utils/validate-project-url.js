import verifyValidId from './verify-valid-id'

const REGEX = /^\/projects\/(?:([a-z0-9-]+)\/?)(?:\/overview)?$/i

export const isValidProjectPath = pathname => {
  return !!pathname.match(REGEX)
}

export const getProjectIdFromPath = pathname => {
  const match = REGEX.exec(pathname)

  if (match && match[1]) {
    const idSplit = match[1].split('-')
    const id = idSplit[idSplit.length - 1]

    if (verifyValidId(id)) {
      return id
    } else {
      return ''
    }
  } else {
    return ''
  }
}
