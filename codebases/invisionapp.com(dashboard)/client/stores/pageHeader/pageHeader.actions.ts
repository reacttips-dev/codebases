import { Dispatch } from 'redux'
// @ts-ignore
import { blockInviteUsers, selectPaywall } from '../../auth/blockerSelectors'
import { selectLocation } from '../location'
import { AppState } from '..'
import { openInviteModal } from './pageHeader.helpers'

export const clickedInvite = () => (dispatch: Dispatch, getState: () => AppState) => {
  const state = getState()
  const showPaywall = !!blockInviteUsers(state)
  const paywall = selectPaywall(state) || {}
  const location = selectLocation(state)

  openInviteModal(location.pathname, showPaywall, paywall)
}
