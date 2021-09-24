import FollowingContainer from '../../containers/FollowingContainer'

export default [
  {
    path: 'following(/trending)',
    getComponents(location, cb) {
      cb(null, FollowingContainer)
    },
  },
]

