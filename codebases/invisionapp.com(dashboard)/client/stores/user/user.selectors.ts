import { createSelector } from 'reselect'
import { AppState } from '../index'

export const selectUser = (state: AppState) => state.user
export const selectUserRole = createSelector(selectUser, user => user.member?.roleID)
export const selectProfile = createSelector(selectUser, user => user.profile)
export const selectUserEmail = createSelector(selectProfile, profile => profile?.email)
export const selectUserTeams = createSelector(selectUser, user => user.teams || [])

export const selectLoadingTeamsStatus = createSelector(
  selectUser,
  user => user.loadingTeamsStatus || 'initial'
)

export const selectAreTeamsLoading = createSelector(
  selectLoadingTeamsStatus,
  status => status !== 'loaded'
)

// TO CONSIDER: should this be its own data object within the user state?
export const selectUserStatus = createSelector(selectUser, user => ({
  accountSettingsError: user.accountSettingsError,
  accountSettingsSuccess: user.accountSettingsSuccess,
  didAvatarUpdate: user.didAvatarUpdate,
  didPasswordUpdate: user.didPasswordUpdate,
  didUpdate: user.didUserUpdate,
  isLoading: user.isLoading,
  isUpdating: user.isUpdating
}))

export const selectEmailNotificationFrequency = createSelector(selectUser, user => {
  return user.preferences !== undefined ? user.preferences.emailNotificationFrequency : null
})

export const selectUserAccountSettingsUpdating = createSelector(
  selectUser,
  user => user.isUpdating
)

export const selectUserDidNotificationsUpdate = createSelector(
  selectUser,
  user => user.didNotificationsUpdate
)

export const selectUserName = createSelector(
  selectUser,
  user => user.profile?.name.split(' ')[0] ?? ''
)

export const selectCanTransferOwnership = createSelector(
  selectUser,
  user => user.canTransferOwnership
)
