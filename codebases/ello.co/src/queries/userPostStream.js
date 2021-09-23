import { postStreamAllFragments } from './fragments'

export default `
  ${postStreamAllFragments}
  query($username: String!, $before: String) {
    userPostStream(username: $username, before: $before) { ...postStream }
  }
`
