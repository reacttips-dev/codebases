import { assignEventData, trackEvent } from '../utils/analytics'
import events from '../utils/events'

export const trackingMiddleware = store => next => action => {
  if (events[action.type]) {
    const event = events[action.type]
    if (event.hasOwnProperty('criteria') && action.data && !event.criteria(action.data)) {
      return next(action)
    }

    trackEvent(event.name, assignEventData(event, store.getState(), action.data))
  }

  return next(action)
}
