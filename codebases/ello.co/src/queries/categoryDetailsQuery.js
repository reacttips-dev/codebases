import { authorSummary, tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${imageVersionProps}
  ${tshirtImageVersions}
  ${authorSummary}
  query($slug: String!, $roles: [CategoryUserRole]) {
    category(slug: $slug) {
      id
      name
      slug
      description
      brandAccount { ...authorSummary }

      categoryUsers(roles: $roles) {
        id
        role
        user { ...authorSummary }
      }
    }
  }
`
