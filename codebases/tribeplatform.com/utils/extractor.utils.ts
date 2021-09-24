import { capitalize } from 'utils/strings'

export const guessNameFromEmail = (email: string) => {
  let [parsedName] = email.split('@')
  parsedName = parsedName
    .split(/[^a-zA-Z]+/g)
    .map(capitalize)
    .join(' ')
    .trim()
  return parsedName
}
