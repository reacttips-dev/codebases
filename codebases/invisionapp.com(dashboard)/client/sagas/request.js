import noop from 'lodash/noop'
import _get from 'lodash/get' // _get to not assign the get keyword
import { call, put, takeLatest } from 'redux-saga/effects'
import API from '../api'
import {
  FETCH_TEAM,
  UPDATE_TEAM,
  SETTINGS_FETCH as SETTINGS,
  SCIM_SETTINGS_FETCH,
  TEAM_2FA_SETTINGS_FETCH,
  SHARE_BRANDING_FETCH as SB,
  DELETE_TEAM,
  TRANSFER_OWNERSHIP,
  fetchTeam,
  fetchSettings,
  fetchSCIMSettings,
  fetchTeam2FASettings,
  fetchShareBranding,
  deleteTeam,
  updateTeam,
  transferOwnership
} from '../stores/team'
import { FETCH_ONE as INVITE, fetchInvitation } from '../stores/invitations'
import { DELETE_LOGO, deleteLogo } from '../stores/logo'
import {
  FETCH_USER,
  SEND_CODE,
  VALIDATE_CODE,
  FETCH_TEAMS,
  FETCH_PREFERENCES,
  FETCH_PROFILE,
  UPDATE_NOTIFICATIONS,
  fetchUser,
  fetchTeams,
  fetchPreferences,
  sendCode,
  validateCode,
  updatePassword,
  UPDATE_PASSWORD,
  updateNotifications,
  fetchProfile
} from '../stores/user'
import { FETCH as FETCH_PERMISSIONS, fetchPermissions } from '../stores/permissions'

/**
 * Generic API request handler
 * @param {object} actionHandler Object with action handlers for request(), success(), failure()
 * @param {string} entity The entity to include in the URL, e.g. `teams` or `invitations`
 * @param {function} apiHandler API function to be executed
 * @param {object} action The incoming action object, { type: 'foo', payload: { foo: 'bar' }}
 */
export function* requestSaga(actionHandler, entity, apiHandler, action) {
  const endpoint = _get(action, 'payload.endpoint', '')
  const notification = _get(action, 'payload.notification', null)
  const apiPayload = _get(action, 'payload.data', null)

  let resolve = noop
  let reject = noop

  if (action.meta) {
    resolve = action.meta.resolve || noop
    reject = action.meta.reject || noop
  }

  try {
    const uri = `${entity}/${endpoint}`
    const params = _get(action, 'payload.params')
    const data = yield call(apiHandler, uri, params, apiPayload)

    yield put(actionHandler.success(data, notification, apiPayload))
    yield call(resolve, data, notification)
  } catch (e) {
    // This allows us to return custom error messages from the BFF
    const message = _get(e, 'response.data.error') || e.message
    yield put(actionHandler.failure(message, notification, apiPayload))
    yield call(reject, e)
  }
}

function* watch() {
  yield takeLatest(FETCH_TEAM.REQUEST, requestSaga, fetchTeam, 'team', API.get)
  yield takeLatest(SETTINGS.REQUEST, requestSaga, fetchSettings, 'team/settings', API.get)
  yield takeLatest(
    SCIM_SETTINGS_FETCH.REQUEST,
    requestSaga,
    fetchSCIMSettings,
    'team/scim-settings',
    API.get
  )
  yield takeLatest(
    TEAM_2FA_SETTINGS_FETCH.REQUEST,
    requestSaga,
    fetchTeam2FASettings,
    'team/2fa-settings',
    API.get
  )
  yield takeLatest(SB.REQUEST, requestSaga, fetchShareBranding, 'share-branding', API.get)
  yield takeLatest(FETCH_USER.REQUEST, requestSaga, fetchUser, 'user', API.get)
  yield takeLatest(DELETE_LOGO.REQUEST, requestSaga, deleteLogo, 'team/logo', API.delete)
  yield takeLatest(SEND_CODE.REQUEST, requestSaga, sendCode, 'user/send-code', API.post)
  yield takeLatest(
    VALIDATE_CODE.REQUEST,
    requestSaga,
    validateCode,
    'user/validate-code',
    API.post
  )
  yield takeLatest(DELETE_TEAM.REQUEST, requestSaga, deleteTeam, 'team', API.delete)
  yield takeLatest(FETCH_TEAMS.REQUEST, requestSaga, fetchTeams, 'user', API.get)
  yield takeLatest(
    FETCH_PREFERENCES.REQUEST,
    requestSaga,
    fetchPreferences,
    'user/preferences',
    API.get
  )
  yield takeLatest(FETCH_PROFILE.REQUEST, requestSaga, fetchProfile, 'user/profile', API.get)
  yield takeLatest(
    FETCH_PERMISSIONS.REQUEST,
    requestSaga,
    fetchPermissions,
    'permissions',
    API.get
  )
  yield takeLatest(UPDATE_TEAM.REQUEST, requestSaga, updateTeam, 'team', API.update)
  yield takeLatest(INVITE.REQUEST, requestSaga, fetchInvitation, 'invitations', API.get)
  yield takeLatest(
    TRANSFER_OWNERSHIP.REQUEST,
    requestSaga,
    transferOwnership,
    'team/ownership',
    API.update
  )
  yield takeLatest(TRANSFER_OWNERSHIP.SUCCESS, requestSaga, fetchUser, 'user', API.get)
  yield takeLatest(
    UPDATE_PASSWORD.REQUEST,
    requestSaga,
    updatePassword,
    'user/password',
    API.post
  )
  yield takeLatest(
    UPDATE_NOTIFICATIONS.REQUEST,
    requestSaga,
    updateNotifications,
    'user/notifications',
    API.update
  )
}

export default watch
