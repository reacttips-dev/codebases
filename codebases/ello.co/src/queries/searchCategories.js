import { tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${imageVersionProps}
  ${tshirtImageVersions}
  query($query: String, $administered: Boolean) {
    searchCategories(query: $query, administered: $administered) {
      categories {
        id
        name
        slug
        level
        order
        tileImage { ...tshirtImageVersions }
        currentUserState { role }
      }
    }
  }
`
