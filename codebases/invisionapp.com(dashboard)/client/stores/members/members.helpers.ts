import { UserState, getUserId } from '../user'
import { Member, V2Member } from './members.types'
import { canManageRole, isOwner, Role } from '../roles'

export function canManageRow(member: Member, roles: Role[], user: UserState) {
  if (user === undefined) {
    return false
  }

  const canManage = canManageRole(member.roleID, roles) && !isMyself(user, member)

  return canManage
}

export function getBulkEditableItems(user: UserState, members: Member[]) {
  return members.filter(member => isMemberBulkEditable(user, member))
}

export function isMemberBulkEditable(user: UserState, member: Member) {
  return isOwner(member.roleID) === false && isMyself(user, member) === false
}

export function isMyself(user: UserState | undefined, member: Member | undefined) {
  if (user === undefined || user.user === undefined || member === undefined) {
    return false
  }

  const id = getUserId(user) === member.userID

  return id
}

export function getSeatType(member?: Member) {
  return member?.seatTypeID
}

export function getMemberName(member: Member | V2Member) {
  if (member === undefined) {
    return undefined
  }

  // v1 member
  if ('name' in member) {
    return member.name
  }

  // v2 user
  if ('user' in member) {
    return member.user.name
  }

  return undefined
}
