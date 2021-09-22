import { AppState } from '../stores/index'

export const blockInviteUsers = (state: AppState) => {
  return state.team.showPaywall
}

export const selectPaywall = (state: AppState) => {
  return state.team.paywall
}
