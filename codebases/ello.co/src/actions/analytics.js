import { TRACK } from '../constants/action_types'

export function trackEvent(label, options = {}) {
  return {
    type: TRACK.EVENT,
    meta: {},
    payload: {
      label,
      options,
    },
  }
}

export function trackInitialPage() {
  return {
    type: TRACK.INITIAL_PAGE,
    meta: {},
    payload: {},
  }
}

