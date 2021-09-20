import queryString from 'query-string'

export default function mergeQueryParams(url: string, queryParams: object): string {
  const parsedUrl = queryString.parseUrl(url)

  const hash = (url.match(/#.+$/) || [''])[0]

  let query = queryString.stringify({ ...parsedUrl.query, ...queryParams })
  if (query) {
    query = '?' + query
  }

  return parsedUrl.url + query + hash
}
