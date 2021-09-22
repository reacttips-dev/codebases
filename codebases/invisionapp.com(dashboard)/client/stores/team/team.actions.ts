import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

import { createPromiseAction } from '../utils/promiseActions'
import { generateConsts } from '../utils/generators'
import { showFlash } from '../flash'
import { Paywall, ShareBranding, Team, TeamSettingsResponse } from './team.types'
import { Member, V2Member } from '../members'

export const FETCH_TEAM = generateConsts('teams/team/FETCH_TEAM')
export const UPDATE_TEAM = generateConsts('teams/team/UPDATE')
export const DELETE_TEAM = generateConsts('teams/team/DELETE')
export const SETTINGS_FETCH = generateConsts('teams/team/SETTINGS_FETCH')
export const SCIM_SETTINGS_FETCH = generateConsts('teams/team/SCIM_SETTINGS_FETCH')
export const TEAM_2FA_SETTINGS_FETCH = generateConsts('teams/team/TEAM_2FA_SETTINGS_FETCH')
export const SHARE_BRANDING_FETCH = generateConsts('teams/team/SHARE_BRANDING_FETCH')
export const TRANSFER_OWNERSHIP = generateConsts('teams/team/TRANSFER_OWNERSHIP')
export const CHECK_PAYWALL = generateConsts('teams/team/CHECK_PAYWALL')
export const SET_TRANSFER_USER = 'teams/team/SET_TRANSFER_USER'
export const TEAM_SETTINGS_UPDATE = 'teams/team/TEAM_SETTINGS_UPDATE'
export const TEAM_LOGO_UPDATE = 'teams/team/TEAM_LOGO_UPDATE'

export const fetchTeam = {
  request: createPromiseAction(FETCH_TEAM.REQUEST),
  success: createAction(FETCH_TEAM.SUCCESS, (response: Team) => response),
  failure: createAction(FETCH_TEAM.FAILURE)
}

export const checkPaywall = {
  request: createAction(CHECK_PAYWALL.REQUEST),
  success: createAction(
    CHECK_PAYWALL.SUCCESS,
    (response: { hasPaywall?: boolean }, paywall: Paywall) => ({
      hasPaywall: response.hasPaywall || false,
      paywall
    })
  )
}

export const updateTeam = {
  request: createPromiseAction(UPDATE_TEAM.REQUEST),
  success: (payload: { data: { name: string; subdomain: string } }) => (
    dispatch: Dispatch
  ) => {
    dispatch({ type: UPDATE_TEAM.SUCCESS, payload })

    dispatch(
      showFlash({
        message: 'Your team has been updated',
        status: 'success'
      })
    )
  },
  failure: (message: string) => (dispatch: Dispatch) => {
    dispatch({
      type: UPDATE_TEAM.FAILURE,
      payload: { message }
    })

    dispatch(
      showFlash({
        message: 'There was a problem updating your team. Please try again.',
        status: 'danger'
      })
    )
  }
}

export const deleteTeam = {
  request: createAction(DELETE_TEAM.REQUEST),
  success: createAction(DELETE_TEAM.SUCCESS, () => {}),
  failure: createAction(DELETE_TEAM.FAILURE, (message: string) => {
    return { message }
  })
}

export const fetchSettings = {
  request: createAction(SETTINGS_FETCH.REQUEST),
  success: createAction(SETTINGS_FETCH.SUCCESS, (response: TeamSettingsResponse) => response),
  failure: createAction(SETTINGS_FETCH.FAILURE, (message: string) => {
    return { message }
  })
}

export const fetchSCIMSettings = {
  request: createAction(SCIM_SETTINGS_FETCH.REQUEST),
  success: createAction(
    SCIM_SETTINGS_FETCH.SUCCESS,
    (response: { enabled: boolean }) => response
  ),
  failure: createAction(SCIM_SETTINGS_FETCH.FAILURE, () => {})
}

export const fetchTeam2FASettings = {
  request: createAction(TEAM_2FA_SETTINGS_FETCH.REQUEST),
  success: createAction(
    TEAM_2FA_SETTINGS_FETCH.SUCCESS,
    (response: { mfa_required: boolean }) => response
  ),
  failure: createAction(TEAM_2FA_SETTINGS_FETCH.FAILURE, () => {})
}

export const fetchShareBranding = {
  request: createAction(SHARE_BRANDING_FETCH.REQUEST),
  success: createAction(SHARE_BRANDING_FETCH.SUCCESS, (response: ShareBranding) => response)
}

export const transferOwnership = {
  request: createPromiseAction(TRANSFER_OWNERSHIP.REQUEST),
  success: createAction(TRANSFER_OWNERSHIP.SUCCESS, () => {}),
  failure: createAction(TRANSFER_OWNERSHIP.FAILURE, () => {})
}

export const setTransferUser = createAction(
  SET_TRANSFER_USER,
  ({ member }: { member: Member | V2Member }) => {
    return { member }
  }
)

export const teamSettingsUpdate = createAction(
  TEAM_SETTINGS_UPDATE,
  (settings: Partial<TeamSettingsResponse>) => settings
)

export const teamLogoUpdate = createAction(
  TEAM_LOGO_UPDATE,
  (logo: { previewPutUrl: string }) => {
    return { logo }
  }
)
