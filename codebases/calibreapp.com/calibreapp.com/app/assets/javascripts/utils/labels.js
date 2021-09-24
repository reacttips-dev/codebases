export const collectionLabel = collection => {
  let label = collection.join(', ')

  if (collection.length > 2) {
    label = `${collection[0]}, ${collection[1]} and ${
      collection.length - 2
    } more`
  } else {
    label = `${collection.join(' and ')}`
  }

  return label
}
