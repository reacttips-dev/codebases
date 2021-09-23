import * as ENV from '../../../env'

export default {
  path: 'wtf(/**/**)',
  onEnter(nextState, replace, callback) {
    if (callback) {
      document.location.href = ENV.AUTH_DOMAIN + nextState.location.pathname
    }
  },
}

