export function updateQueryParams(params) {
  // store current query in an object
  const search = document.location.search.replace('?', '')
  const queryObj = {}
  if (search.length) {
    const searchArr = search.split('&')
    searchArr.forEach((str) => {
      const keyValueArr = str.split('=')
      queryObj[keyValueArr[0]] = keyValueArr[1]
    })
  }
  // set/delete params
  Object.keys(params).forEach((param) => {
    if (params[param] !== null) {
      queryObj[param] = encodeURIComponent(params[param])
    } else {
      delete queryObj[param]
    }
  })
  // create query array
  const queryArr = []
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key] !== null) {
      queryArr.push(`${key}=${queryObj[key]}`)
    }
  })
  // re-assemble the query string
  let query = ''
  if (queryArr.length) {
    query = `?${queryArr.join('&')}`
  }
  return query
}

export function getQueryParamValue(param, uri) {
  const search = uri.split('?')[1]
  if (search) {
    const searchArr = search.split('&')
    const found = searchArr.find((keyVal) => {
      const keyValArr = keyVal.split('=')
      return keyValArr[0] === param
    })
    if (found && found.length) { return found.split('=')[1] }
  }
  return null
}

const paramWhitelist = ['before', 'per_page']
export function getPagingQueryParams(uri = '?') {
  const search = uri.split('?')[1]
  const obj = {}
  if (search && search.length) {
    const searchArr = search.split('&')
    searchArr.forEach((keyVal) => {
      const keyValArr = keyVal.split('=')
      const key = keyValArr[0]
      if (paramWhitelist.indexOf(key) !== -1) {
        obj[key] = keyValArr[1]
      }
    })
  }
  return obj
}

