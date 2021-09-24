import SearchContainer from '../../containers/SearchContainer'

export default [
  {
    path: 'find',
    onEnter(nextState, replace) {
      replace({ state: nextState, pathname: '/search' })
    },
  },
  {
    path: 'search',
    getComponent(location, cb) {
      cb(null, SearchContainer)
    },
  },
]

