import UserDetailContainer from '../../containers/UserDetailContainer'

const TYPES = [
  'following',
  'followers',
  'loves',
]

export default {
  path: ':username(/:type)',
  getComponents(location, cb) {
    cb(null, UserDetailContainer)
  },
  onEnter(nextState, replace) {
    const type = nextState.params.type
    // redirect back to /username if type is unrecognized
    if (type && TYPES.indexOf(type) === -1) {
      replace({ pathname: `/${nextState.params.username.toLowerCase()}`, state: nextState })
    } else if (/[A-Z]/.test(nextState.params.username)) {
      const userPath = type ? `${nextState.params.username}/${type}` : nextState.params.username
      replace({ pathname: `/${userPath.toLowerCase()}`, state: nextState })
    }
  },
}

