import { fullUserAllFragments } from './fragments'

export const findUserQuery = `
  ${fullUserAllFragments}
  query($username: String!) {
    findUser(username: $username) { ...fullUser }
  }
`

export default findUserQuery
