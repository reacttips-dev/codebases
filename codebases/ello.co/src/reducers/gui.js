/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'
import get from 'lodash/get'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  EDITOR,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  V3,
  PROFILE,
  SET_LAYOUT_MODE,
  ZEROS,
} from '../constants/action_types'

let location = {}
const oldDate = new Date()
oldDate.setFullYear(oldDate.getFullYear() - 2)

// this is used for testing in StreamContainer_test
export const setLocation = (loc) => {
  location = loc
}

export const findLayoutMode = modes =>
  modes.findIndex((mode) => {
    const regex = new RegExp(mode.get('regex'))
    return regex.test(location.pathname)
  })

const getIsGridMode = (state) => {
  const index = findLayoutMode(state.get('modes'))
  if (index < 0) { return null }
  return state.getIn(['modes', `${index}`, 'mode']) === 'grid'
}

const initialNonPersistedState = Immutable.Map({
  hasLaunchedSignupModal: false,
  isCategoryDrawerOpen: false,
  isCompleterActive: false,
  isNotificationsActive: false,
  isProfileMenuActive: false,
  isProfileRolesActive: false,
  isLightBoxActive: false,
  isTextToolsActive: false,
  notificationScrollPositions: Immutable.Map(),
  onboardToArtistInvite: null,
  isCompletingOnboardToArtistInvite: false,
  saidHelloTo: Immutable.List(),
  textToolsCoordinates: Immutable.Map({ top: -200, left: -666 }),
  textToolsStates: Immutable.Map(),
})

const initialPersistedState = Immutable.Map({
  activeNotificationsType: 'all',
  columnCount: 2,
  discoverKeyType: null,
  innerHeight: 0,
  innerWidth: 0,
  isGridMode: true,
  isNavbarHidden: false,
  isNotificationsUnread: false,
  lastAnnouncementSeen: '0',
  lastDiscoverBeaconVersion: '0',
  lastFollowingBeaconVersion: '0',
  lastNotificationCheck: oldDate.toUTCString(),
  // order matters for matching routes
  modes: Immutable.List([
    Immutable.Map({ label: 'root', mode: 'grid', regex: '^/$' }),
    Immutable.Map({ label: 'discover', mode: 'grid', regex: '/discover|/explore' }),
    Immutable.Map({ label: 'following', mode: 'grid', regex: '/following' }),
    Immutable.Map({ label: 'invitations', mode: 'list', regex: '/invitations' }),
    Immutable.Map({ label: 'onboarding', mode: 'grid', regex: '/onboarding' }),
    Immutable.Map({ label: 'notifications', mode: 'list', regex: '/notifications' }),
    Immutable.Map({ label: 'search', mode: 'grid', regex: '/search|/find' }),
    Immutable.Map({ label: 'settings', mode: 'list', regex: '/settings' }),
    Immutable.Map({ label: 'staff', mode: 'list', regex: '/staff' }),
    Immutable.Map({ label: 'posts', mode: 'list', regex: '/[\\w\\-]+/post/.+' }),
    Immutable.Map({ label: 'users/following', mode: 'grid', regex: '/[\\w\\-]+/following' }),
    Immutable.Map({ label: 'users/followers', mode: 'grid', regex: '/[\\w\\-]+/followers' }),
    Immutable.Map({ label: 'users/loves', mode: 'grid', regex: '/[\\w\\-]+/loves' }),
    Immutable.Map({ label: 'users', mode: 'grid', regex: '/[\\w\\-]+' }),
  ]),
})

export const initialState = initialNonPersistedState.merge(initialPersistedState)

export const convertStateToImmutable = objectState =>
  initialState.set('lastDiscoverBeaconVersion', objectState.lastDiscoverBeaconVersion || '0')
    .set('lastFollowingBeaconVersion', objectState.lastFollowingBeaconVersion || '0')
    .set('lastNotificationCheck', objectState.lastNotificationCheck || oldDate.toUTCString())
    .set('modes', objectState.modes ? Immutable.fromJS(objectState.modes) : initialState.get('modes'))

export default (state = initialState, action = { type: '' }) => {
  const { payload, type } = action
  switch (type) {
    case AUTHENTICATION.LOGOUT_SUCCESS:
    case AUTHENTICATION.LOGOUT_FAILURE:
    case AUTHENTICATION.REFRESH_FAILURE:
      return state.set('discoverKeyType', null)
    case EDITOR.SET_IS_COMPLETER_ACTIVE:
      return state.set('isCompleterActive', payload.isCompleterActive)
    case EDITOR.SET_IS_TEXT_TOOLS_ACTIVE:
      return state.set('isTextToolsActive', payload.isTextToolsActive)
        .set('textToolsStates', payload.textToolsStates)
    case EDITOR.SET_TEXT_TOOLS_COORDINATES:
      return state.set('textToolsCoordinates', Immutable.fromJS(payload.textToolsCoordinates))
    case GUI.BIND_DISCOVER_KEY:
      return state.set('discoverKeyType', payload.type)
    case GUI.NOTIFICATIONS_TAB:
      return state.set('activeNotificationsType', payload.activeTabType)
    case GUI.SET_IS_CATEGORY_DRAWER_OPEN:
      return state.set('isCategoryDrawerOpen', payload.isCategoryDrawerOpen)
    case GUI.SET_IS_NAVBAR_HIDDEN:
      return state.set('isNavbarHidden', get(payload, 'isNavbarHidden', state.isNavbarHidden))
    case GUI.SET_IS_PROFILE_MENU_ACTIVE:
      return state.set('isProfileMenuActive', payload.isProfileMenuActive)
    case GUI.SET_IS_PROFILE_ROLES_ACTIVE:
      return state.set('isProfileRolesActive', payload.isProfileRolesActive)
    case GUI.SET_IS_LIGHT_BOX_ACTIVE:
      return state.set('isLightBoxActive', payload.isLightBoxActive)
    case GUI.SET_LAST_ANNOUNCEMENT_SEEN:
      return state.set('lastAnnouncementSeen', payload.id)
    case GUI.SET_LAST_DISCOVER_BEACON_VERSION:
      return state.set('lastDiscoverBeaconVersion', payload.version)
    case GUI.SET_LAST_FOLLOWING_BEACON_VERSION:
      return state.set('lastFollowingBeaconVersion', payload.version)
    case GUI.SET_NOTIFICATION_SCROLL_Y:
      return state.setIn(['notificationScrollPositions', payload.category], payload.scrollY)
    case GUI.SET_SIGNUP_MODAL_LAUNCHED:
      return state.set('hasLaunchedSignupModal', payload.hasLaunchedSignupModal)
    case GUI.SET_VIEWPORT_SIZE_ATTRIBUTES:
      return state.merge(payload)
    case GUI.TOGGLE_NOTIFICATIONS:
      return state.set('isNotificationsActive', payload.isNotificationsActive)
    case GUI.START_ONBOARD_TO_ARTIST_INVITE:
      return state.set('onboardToArtistInvite', payload.artistInvite)
    case GUI.COMPLETE_ONBOARD_TO_ARTIST_INVITE:
      return state.set('onboardToArtistInvite', null)
        .set('isCompletingOnboardToArtistInvite', true)
    case GUI.RESET_ONBOARD_TO_ARTIST_INVITE:
      return state.set('onboardToArtistInvite', null)
        .set('isCompletingOnboardToArtistInvite', false)
    case GUI.ACCEPT_DATA_POLICY:
      return state.set('acceptedDataPolicy', payload.now)
    case GUI.CLOSED_PROMO_ALERT:
      return state.set('closedPromoAlert', payload.now)
    case GUI.RESET_PROMO_ALERT:
      return state.set('closedPromoAlert', null)
    case V3.NOTIFICATIONS.NEW_CONTENT_SUCCESS:
      return state.set(
        'isNotificationsUnread',
        payload.response.data.newNotificationStreamContent.newContent,
      )
    case HEAD_FAILURE:
      return state.set('isNotificationsUnread', false)
    case HEAD_SUCCESS:
      if (payload.serverStatus === 304) {
        return state.set('isNotificationsUnread', false)
      } else if (payload.serverStatus === 204) {
        return state.set('isNotificationsUnread', true)
      }
      return state
    case LOAD_STREAM_SUCCESS:
      if (action.meta && /\/notifications/.test(action.meta.resultKey)) {
        return state.set('isNotificationsUnread', false)
          .set('lastNotificationCheck', new Date().toUTCString())
      }
      return state
    case LOCATION_CHANGE: {
      location = payload
      return state.withMutations((s) => {
        s.set('isGridMode', getIsGridMode(state))
          .set('isNavbarHidden', false)
      })
    }
    case PROFILE.DELETE_SUCCESS: {
      return initialState.set('columnCount', state.get('columnCount'))
        .set('innerWidth', state.get('innerWidth'))
        .set('innerHeight', state.get('innerHeight'))
    }
    case REHYDRATE:
      return state.withMutations((s) => {
        s.merge(payload.gui || {})
          .merge(initialNonPersistedState)
          .set('isGridMode', getIsGridMode(s))
          .set('isNavbarHidden', false)
      })
    case SET_LAYOUT_MODE: {
      const index = findLayoutMode(state.get('modes'))
      if (index < 0) { return state }
      return state.set('isGridMode', payload.mode === 'grid')
        .setIn(['modes', `${index}`, 'mode'], payload.mode)
    }
    case ZEROS.SAY_HELLO:
      return state.set('saidHelloTo', state.get('saidHelloTo').push(payload.username))
    default:
      return state
  }
}
