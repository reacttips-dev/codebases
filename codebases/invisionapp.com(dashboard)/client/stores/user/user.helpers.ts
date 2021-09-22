import { UserState } from '.'

export function getUserId(user: UserState) {
  if (user === undefined || user.user === undefined) {
    return undefined
  }

  // v1 user
  if ('id' in user.user) {
    return user.user.id
  }

  // v2 user
  if (user.user.user) {
    return user.user.userID
  }

  return undefined
}
