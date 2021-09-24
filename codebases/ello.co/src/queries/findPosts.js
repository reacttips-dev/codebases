import { postSummaryAllFragments } from './fragments'

export const findPostsQuery = `
  ${postSummaryAllFragments}
  query($tokens: [String]) {
    findPosts(tokens: $tokens) { ...postSummary repostedSource { ...postSummary } }
  }
`

export default findPostsQuery
