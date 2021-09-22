import { toArray } from './array'

export const parseSearch = (string: string) => {
  try {
    return string
      .substring(1)
      .split('&')
      .reduce((output: { [key: string]: string }, query: string) => {
        const [key, value] = query.split('=')
        output[key] = value // eslint-disable-line
        return output
      }, {})
  } catch (_) {
    return {}
  }
}

export const parseSearchMany = (string: string) => {
  const parsed = parseSearch(string)

  try {
    Object.keys(parsed).forEach(key => {
      const items = parsed[key].split(',')

      if (items.length > 1) {
        // @ts-ignore
        parsed[key] = items // eslint-disable-line
      }
    })
  } catch (_) {
    // eslint-disable-line
  }

  return parsed
}

export const getSearchByKey = (key: string) => {
  const rawSearch = parseSearchMany(window.location.search)[key]

  return toArray(rawSearch).reduce((output, feature) => ({ ...output, [feature]: true }), {})
}
