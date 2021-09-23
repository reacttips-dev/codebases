/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import { camelizeKeys } from 'humps'
import jwtDecode from 'jwt-decode'
import get from 'lodash/get'
import { REHYDRATE } from 'redux-persist/constants'
import {
  AUTHENTICATION,
  INVITATIONS,
  PROFILE,
  UPDATE_STATE_FROM_NATIVE,
} from '../constants/action_types'
import { imageGuid } from '../helpers/file_helper'

function parseJWT(token) {
  const decoded = jwtDecode(token)
  if (decoded && decoded.data) {
    return { ...(camelizeKeys(decoded.data)) }
  }
  return {}
}

const initialState = Immutable.Map({
  splits: Immutable.Map(),
  uuid: imageGuid(),
})

function updateFollowedCategoryIds(state, { payload: { body } }) {
  const followedIds = body.followed_category_ids
  return state.set('followedCategoryIds', followedIds)
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PROFILE.AVAILABILITY_SUCCESS: {
      const isValid = get(action, 'payload.response.availability.email') === true
      return state.merge({
        email: isValid ? get(action, 'payload.body.email') : null,
        availability: {
          original: action.meta.original,
          ...action.payload.response.availability,
        },
      })
    }
    case PROFILE.AVAILABILITY_RESET:
      return state.set('availability', null)
    case AUTHENTICATION.LOGOUT_SUCCESS:
    case AUTHENTICATION.LOGOUT_FAILURE:
    case AUTHENTICATION.REFRESH_FAILURE:
    case PROFILE.DELETE_SUCCESS:
      // keep around the registration data so that android
      // can re-register a user if they logout and then login
      // as a different user without leaving the app
      return Immutable.Map({
        buildVersion: state.get('buildVersion'),
        bundleId: state.get('bundleId'),
        marketingVersion: state.get('marketingVersion'),
        registrationId: state.get('registrationId'),
      })
    case PROFILE.EXPORT_SUCCESS:
      if (action.payload.serverStatus === 200) {
        return state.set('dataExport', action.payload.response.exportUrl)
      }
      return state.set('dataExport', null)
    case AUTHENTICATION.RESET_PASSWORD_SUCCESS:
    case PROFILE.LOAD_SUCCESS:
      return state.merge({
        ...action.payload.response.users,
        id: `${action.payload.response.users.id}`,
      })
    case PROFILE.REQUEST_PUSH_SUBSCRIPTION:
      return state.merge(action.payload)
    case PROFILE.SAVE_REQUEST:
      return state.set('errors', null)
    case PROFILE.SAVE_SUCCESS: {
      const tmpAvatar = state && state.getIn(['avatar', 'tmp'])
      const tmpCoverImage = state && state.getIn(['coverImage', 'tmp'])
      state = state.merge({
        ...action.payload.response.users,
        availability: null,
        id: `${action.payload.response.users.id}`,
      })
      if (tmpAvatar) {
        state = state.setIn(['avatar', 'tmp'], tmpAvatar)
      }
      if (tmpCoverImage) {
        state = state.setIn(['coverImage', 'tmp'], tmpCoverImage)
      }
      return state
    }
    // should only happen if we get a 422 meaning
    // the current password entered was wrong
    case PROFILE.SAVE_FAILURE:
      return state.set('errors', get(action, 'payload.response.errors'))
    // Store a base64 reprensentation of the asset in `tmp` while uploading
    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED: {
      const { type } = action
      const assetType = type === PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
      const key = type === PROFILE.TMP_AVATAR_CREATED ? 'hasAvatarPresent' : 'hasCoverImagePresent'
      const obj = {}
      obj[assetType] = { ...state[assetType], ...action.payload }
      obj[key] = key
      return state.merge(obj)
    }
    case UPDATE_STATE_FROM_NATIVE: {
      if (!action.payload.profile.isEmpty()) {
        return action.payload.profile
      }
      return state
    }
    case REHYDRATE:
      if (!action.payload.profile) { return state }
      return state.merge(action.payload.profile)
        .set('availability', null)
        .set('dataExport', null)
        .deleteIn(['avatar', 'tmp'])
        .deleteIn(['coverImage', 'tmp'])
    case PROFILE.SAVE_AVATAR_SUCCESS:
    case PROFILE.SAVE_COVER_SUCCESS: {
      const avatarTmp = state.getIn(['avatar', 'tmp'])
      const avatar = avatarTmp ?
        Immutable.fromJS({ ...action.payload.response.users.avatar }).set('tmp', avatarTmp) :
        Immutable.fromJS(action.payload.response.users.avatar)
      const coverImageTmp = state.getIn(['coverImage', 'tmp'])
      const coverImage = coverImageTmp ?
        Immutable.fromJS({ ...action.payload.response.users.coverImage }).set('tmp', coverImageTmp) :
        Immutable.fromJS(action.payload.response.users.coverImage)
      return state.merge(action.payload.response.users)
        .set('avatar', avatar)
        .set('coverImage', coverImage)
    }
    case PROFILE.FOLLOW_CATEGORIES_SUCCESS:
    case PROFILE.UNFOLLOW_CATEGORIES_SUCCESS:
      return updateFollowedCategoryIds(state, action)
    case AUTHENTICATION.USER_SUCCESS:
    case AUTHENTICATION.REFRESH_SUCCESS:
    case PROFILE.SIGNUP_SUCCESS:
      return state.merge(parseJWT(action.payload.response.accessToken))
    case PROFILE.SPLIT_SUCCESS:
      return state.setIn(['splits', get(action, 'payload.name')], get(action, 'payload.response.alternative'))
    case INVITATIONS.GET_EMAIL_SUCCESS:
      return state.set('email', get(action, 'payload.response.invitations.email'))
    default:
      return state
  }
}

