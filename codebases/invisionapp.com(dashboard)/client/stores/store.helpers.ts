import { RowItem } from './tables/tables.types'

export function getName(item: RowItem) {
  if (item === undefined) {
    return undefined
  }

  // v2 member
  if ('user' in item) {
    if (item.user === undefined) {
      return undefined
    }

    return item.user.name
  }

  // invitations -- don't have names
  if ('createdBy' in item) {
    return undefined
  }

  // v1 member & removedUser
  return item.name
}

export function getEmail(item: RowItem) {
  if (item === undefined) {
    return undefined
  }

  // v2 member
  if ('user' in item) {
    if (item.user === undefined) {
      return undefined
    }

    return item.user.email
  }

  // v1 member, invitation, and removed user
  return item.email
}

export function getAvatarUrl(item: RowItem) {
  if (item === undefined) {
    return undefined
  }

  // v2 member
  if ('user' in item) {
    if (item.user === undefined) {
      return undefined
    }

    return item.user.avatarURL
  }

  // v1 member, invitation, and removed user
  return item.avatarURL
}

export function getRoleId(item: RowItem) {
  if (item === undefined) {
    return undefined
  }

  // invitation
  if ('createdBy' in item) {
    return undefined
  }

  // v1 and v2 member and removed user
  return item.roleID
}
