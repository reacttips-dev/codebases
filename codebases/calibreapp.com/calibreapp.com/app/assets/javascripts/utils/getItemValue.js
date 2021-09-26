// Source: https://github.com/kentcdodds/match-sorter/blob/master/src/index.js#L393
export default (item, key) => {
  if (typeof key === 'object') {
    key = key.key
  }
  let value
  if (typeof key === 'function') {
    value = key(item)
    // eslint-disable-next-line no-negated-condition
  } else if (key.indexOf('.') !== -1) {
    // handle nested keys
    value = key
      .split('.')
      .reduce(
        (itemObj, nestedKey) => (itemObj ? itemObj[nestedKey] : null),
        item
      )
  } else {
    value = item[key]
  }
  // concat because `value` can be a string or an array
  // eslint-disable-next-line
  return value != null ? [].concat(value) : null
}
