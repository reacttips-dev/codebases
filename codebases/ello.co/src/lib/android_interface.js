import Immutable from 'immutable'
import { UPDATE_STATE_FROM_NATIVE } from '../constants/action_types'
import store from '../store'
import { isElloAndroid } from './jello'
import { trackEvent } from '../actions/analytics'
import { requestPushSubscription } from '../actions/profile'

const getJSState = () => {
  const state = store.getState()
  return JSON.stringify(state)
}
export const supportsNativeEditor = () => isElloAndroid() && typeof AndroidInterface.launchEditor === 'function'
export const supportsNativeImagePicker = () => isElloAndroid() && typeof AndroidInterface.launchImagePicker === 'function'
export const launchEditor = (post, isComment, comment, text) => {
  if (supportsNativeEditor()) {
    if (text) {
      AndroidInterface.launchEditor(getJSState(), post, isComment, comment, text)
    } else {
      AndroidInterface.launchEditor(getJSState(), post, isComment, comment)
    }
  }
}
export const launchImagePicker = (kind) => {
  if (supportsNativeImagePicker()) {
    AndroidInterface.launchImagePicker(getJSState(), kind)
  }
}
export const setIsStaff = (isStaff) => {
  if (isElloAndroid() && typeof AndroidInterface.setIsStaff === 'function') {
    AndroidInterface.setIsStaff(`${isStaff}`)
  }
}
export const webAppLoaded = () => {
  if (isElloAndroid() && typeof AndroidInterface.webAppLoaded === 'function') {
    AndroidInterface.webAppLoaded()
  }
}
export const exposeAndroidMethods = (dispatch) => {
  if (isElloAndroid()) {
    window.registerAndroidNotifications = (regId, bundleId, marketingVersion, buildVersion) => {
      dispatch(requestPushSubscription(regId, bundleId, marketingVersion, buildVersion))
    }
    window.updateStateFromNative = (state) => {
      const immutableState = {}
      Object.keys(state).forEach((key) => {
        immutableState[key] = Immutable.fromJS(state[key])
        return immutableState[key]
      })
      dispatch({ type: UPDATE_STATE_FROM_NATIVE, payload: immutableState })
    }
    window.trackAndroidEvent = (name, options) => {
      dispatch(trackEvent(name, options))
    }
  }
}
export const initialize = (dispatch, isStaff) => {
  setIsStaff(isStaff)
  webAppLoaded()
  exposeAndroidMethods(dispatch)
}
