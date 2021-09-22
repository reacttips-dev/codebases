import { createAction } from 'redux-actions'
import { AxiosResponse, AxiosError } from 'axios'

import { generateConsts } from '../utils/generators'
import { Invitation } from '../invitations'
import { Team } from '../team'
import { Preferences, Profile, UserServerResponse } from './user.types'
import { createPromiseAction } from '../utils/promiseActions'

export const CLEAR_VALIDATION = 'teams/user/CLEAR_VALIDATION'
export const FETCH_ACCOUNT_TEAMS = generateConsts('teams/user/FETCH_ACCOUNT_TEAMS')
export const FETCH_PREFERENCES = generateConsts('teams/user/FETCH_PREFERENCES')
export const FETCH_PROFILE = generateConsts('teams/user/FETCH_PROFILE')
export const FETCH_TEAMS = generateConsts('teams/user/FETCH_TEAMS')
export const FETCH_USER = generateConsts('teams/user/FETCH_USER')
export const SEND_CODE = generateConsts('teams/user/SEND_CODE')
export const UPDATE_NOTIFICATIONS = generateConsts('teams/user/UPDATE_NOTIFICATIONS')
export const UPDATE_PASSWORD = generateConsts('teams/user/UPDATE_PASSWORD')
export const UPDATE_PROFILE = generateConsts('teams/user/UPDATE_PROFILE')
export const VALIDATE_CODE = generateConsts('teams/user/VALIDATE_CODE')

export const clearValidation = createAction(CLEAR_VALIDATION)

export const fetchAccountTeams = {
  success: createAction(FETCH_ACCOUNT_TEAMS.SUCCESS, (response: { teams: Team[] }) => response)
}

export const fetchPreferences = {
  request: createAction(FETCH_PREFERENCES.REQUEST),
  success: createAction(
    FETCH_PREFERENCES.SUCCESS,
    (response: { preferences: Preferences }) => response
  ),
  failure: createAction(FETCH_PREFERENCES.FAILURE, (message: AxiosError) => {
    return { message }
  })
}

export const fetchProfile = {
  success: createAction(FETCH_PROFILE.SUCCESS, (response: { profile: Profile }) => response)
}

export const fetchTeams = {
  request: createAction(FETCH_TEAMS.REQUEST, () => {
    return {
      endpoint: 'teams'
    }
  }),
  success: createAction(
    FETCH_TEAMS.SUCCESS,
    (response: { teams: Team[]; invitations: Invitation[] }) => response
  ),
  failure: createAction(FETCH_TEAMS.FAILURE, (error: AxiosError) => {
    return { error }
  })
}

export const fetchUser = {
  request: createAction(FETCH_USER.REQUEST),
  success: createAction(FETCH_USER.SUCCESS, (response: UserServerResponse) => response),
  failure: createAction(FETCH_USER.FAILURE, (error: AxiosError) => {
    return { error }
  })
}

export const sendCode = {
  request: createAction(SEND_CODE.REQUEST, (action: string) => ({
    data: {
      action
    }
  })),
  success: createAction(SEND_CODE.SUCCESS, (response: AxiosResponse) => response),
  failure: createAction(SEND_CODE.FAILURE, (error: AxiosError) => {
    return { error }
  })
}

export const updateNotifications = {
  request: createAction(
    UPDATE_NOTIFICATIONS.REQUEST,
    (emailNotificationFrequency: number) => ({
      data: { emailNotificationFrequency }
    })
  ),
  success: createAction(UPDATE_NOTIFICATIONS.SUCCESS, (response: AxiosResponse) => response),
  failure: createAction(UPDATE_NOTIFICATIONS.FAILURE, (message: AxiosError) => {
    return { message }
  })
}

export const updatePassword = {
  request: createAction(
    UPDATE_PASSWORD.REQUEST,
    (currentPassword: string, newPassword: string) => ({
      data: { currentPassword, newPassword }
    })
  )
}

export const updateUserProfile = {
  request: createAction(UPDATE_PROFILE.REQUEST, (data: Profile) => ({
    data
  })),
  success: createAction(UPDATE_PROFILE.SUCCESS),
  failure: createAction(UPDATE_PROFILE.FAILURE, (message: string) => {
    return { message }
  })
}

export const validateCode = {
  request: createPromiseAction(VALIDATE_CODE.REQUEST)
}
