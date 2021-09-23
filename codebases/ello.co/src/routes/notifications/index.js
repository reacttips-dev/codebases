import NotificationsContainer from '../../containers/NotificationsContainer'

const TYPES = [
  'all',
  'comments',
  'loves',
  'mentions',
  'relationships',
  'reposts',
]

export default {
  path: 'notifications(/:type)',
  getComponents(location, cb) {
    cb(null, NotificationsContainer)
  },
  onEnter(nextState, replace) {
    const type = nextState.params.type
    // redirect back to /notifications if type is unrecognized
    if (type && !TYPES.includes(type)) {
      replace({ state: nextState, pathname: '/notifications' })
    }
  },
}

