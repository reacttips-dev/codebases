export function GenerateIDURL (id, title) {
  title = title || ''
  const editedTitle = title
    .replace(/ /g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')

  return `${editedTitle}-${id}`
}

export function ParseIDURL (urlString) {
  return urlString.split('-').slice(-1)[0]
}
