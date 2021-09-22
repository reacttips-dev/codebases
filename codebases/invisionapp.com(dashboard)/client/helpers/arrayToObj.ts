const arrayToObject = (arr?: any[] | null, key = 'id') => {
  return (arr ?? []).reduce((acc, obj) => {
    return {
      ...acc,
      [obj[key]]: { ...obj, id: obj[key] }
    }
  }, {})
}

export default arrayToObject
