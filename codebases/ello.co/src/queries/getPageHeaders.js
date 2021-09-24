import { pageHeaderImageVersions, tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${imageVersionProps}
  ${pageHeaderImageVersions}
  ${tshirtImageVersions}
  query($kind: PageHeaderKind!, $slug: String) {
    pageHeaders(kind: $kind, slug: $slug) {
      id
      kind
      slug
      header
      subheader
      postToken
      ctaLink { text url }
      image { ...pageHeaderImageVersions }
      category { id }
      user { id username avatar { ...tshirtImageVersions } }
    }
  }
`
