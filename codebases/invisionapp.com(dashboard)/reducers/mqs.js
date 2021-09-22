import { BROWSER_MQS_CHANGED } from '../constants/ActionTypes'
import { getActiveMQs } from '../utils/mediaQueries'

export default function reducer (state = getActiveMQs(), action) {
  switch (action.type) {
    case BROWSER_MQS_CHANGED:
      return {
        ...action.payload
      }
    default:
      return state
  }
}
