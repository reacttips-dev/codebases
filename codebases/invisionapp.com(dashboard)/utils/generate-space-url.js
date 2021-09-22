export default function generateSpaceURL (id = '', title = '') {
  const editedTitle = title
    .replace(/ /g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')

  return `/spaces/${editedTitle}-${id}`
}
