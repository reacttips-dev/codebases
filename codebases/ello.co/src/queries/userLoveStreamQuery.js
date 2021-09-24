import { postSummaryAllFragments } from './fragments'

export default `
    ${postSummaryAllFragments}
    query($username: String!, $perPage: String, $before: String) {
      userLoveStream(username: $username, perPage: $perPage, before: $before) {
        next
        isLastPage
        loves { post { ...postSummary repostedSource { ...postSummary } } }
      }
    }
`
