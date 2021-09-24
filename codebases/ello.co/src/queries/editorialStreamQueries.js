import { postSummaryAllFragments } from './fragments'

const editorialSummary = `
  fragment editorialSummary on Editorial {
    id
    kind
    title
    subtitle
    url
    path
    stream { query tokens }
    oneByOneImage { ...responsiveImageVersions }
    oneByTwoImage { ...responsiveImageVersions }
    twoByOneImage { ...responsiveImageVersions }
    twoByTwoImage { ...responsiveImageVersions }
    post { ...postSummary repostedSource { ...postSummary } }
  }
`

export const editorialStreamQuery = `
  ${postSummaryAllFragments}
  ${editorialSummary}
  query($preview: Boolean, $before: String) {
    editorialStream(preview: $preview, before: $before) {
      next
      isLastPage
      editorials { ...editorialSummary }
    }
  }
`

export default editorialStreamQuery
