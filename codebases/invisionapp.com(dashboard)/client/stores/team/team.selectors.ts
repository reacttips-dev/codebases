import { createSelector } from 'reselect'
import { AppState } from '..'

export const selectTeamState = (state: AppState) => state.team

export const selectTeam = createSelector([selectTeamState], teamState => {
  return teamState.data
})

export const selectSubdomain = createSelector([selectTeam], team => {
  return team.subdomain
})

export const selectTransferOwnership = createSelector([selectTeamState], teamState => {
  return teamState.transferOwnership
})

export const selectTransferOwnershipTo = createSelector(
  [selectTransferOwnership],
  transferOwnership => {
    return transferOwnership ? transferOwnership.transferOwnershipTo : undefined
  }
)

export const selectSettings = createSelector([selectTeamState], teamState => {
  return teamState.settings
})

export const selectTeamId = createSelector([selectTeam], team => {
  return team.id
})

export const selectSettingsLoadingStatus = createSelector(
  [selectSettings],
  settings => settings.status
)
