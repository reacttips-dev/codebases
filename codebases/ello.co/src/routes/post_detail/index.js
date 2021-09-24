import PostDetailContainer from '../../containers/PostDetailContainer'

export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    cb(null, PostDetailContainer)
  },
}

