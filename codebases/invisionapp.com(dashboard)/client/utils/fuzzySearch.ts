import Fuse from 'fuse.js'
import take from 'lodash/take'

export const MAX_QUERY_DISPLAY = 30

// options avaialable here: https://fusejs.io/api/options.html
export const emailNameSearch = (query: string, items: Array<any>) => {
  const fuse = new Fuse(items, {
    threshold: 0.2,
    distance: 50,
    keys: ['email', 'name', 'user.email', 'user.name']
  })

  // Fuse returns an array of items and refIndex. We need only 'item'.
  return take(
    fuse.search(query).map(item => item.item),
    MAX_QUERY_DISPLAY
  )
}

export const nameSearch = (query: string, items: Array<any>) => {
  const fuse = new Fuse(items, {
    threshold: 0.3,
    distance: 100,
    keys: ['name']
  })

  return take(
    fuse.search(query).map(item => item.item),
    MAX_QUERY_DISPLAY
  )
}

export const seatTypeSearch = (query: string, items: Array<any>) => {
  const fuse = new Fuse(items, {
    threshold: 0.3,
    distance: 100,
    keys: ['seatTypeName']
  })

  return take(
    fuse.search(query).map(item => item.item),
    MAX_QUERY_DISPLAY
  )
}
