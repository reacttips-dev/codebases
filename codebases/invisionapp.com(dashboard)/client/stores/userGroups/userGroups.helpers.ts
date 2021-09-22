import { UserGroup } from './userGroups.types'

export function getUserGroupById(id: string, userGroups: UserGroup[]) {
  if (userGroups === undefined) {
    return undefined
  }

  return userGroups.find(group => group.userGroupID === id)
}

export function getUserGroupByName(name: string, userGroups: UserGroup[]) {
  if (userGroups === undefined) {
    return undefined
  }

  return userGroups.find(group => group.name.toLowerCase() === name.toLowerCase())
}

export function getUserGroupName(id: string, userGroups: UserGroup[]) {
  return (getUserGroupById(id, userGroups) || {}).name
}

export function getUserGroupNameById(id: string, userGroups: UserGroup[]) {
  const group = getUserGroupById(id, userGroups)

  return group ? group.name : undefined
}

export function getUserGroupUserIds(id: string, userGroups: UserGroup[]) {
  return (getUserGroupById(id, userGroups) || {}).userIDs || []
}
