import { createSelector } from 'reselect'
import { AppState } from '../index'
import { isGuest, isMember } from './roles.helpers'
import { Role } from './roles.types'

export const selectAllowedRoles = (state: AppState) => state.roles.allowedRoles.data
export const selectAllRoles = (state: AppState) => state.roles.allRoles.data

export const selectAllowedRolesForGuests = createSelector([selectAllowedRoles], roles => {
  return roles.filter((role: Role) => {
    return isMember(role.id) || isGuest(role.id)
  })
})
