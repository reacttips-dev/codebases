import DiscoverContainer from '../../containers/DiscoverContainer'
import DiscoverAllContainer from '../../containers/DiscoverAllContainer'

const discoverAll = () => ({
  path: 'discover/all',
  getComponents(location, cb) {
    cb(null, DiscoverAllContainer)
  },
})

const discover = () => ({
  path: 'discover(/:stream)(/:kind)',
  getComponents(location, cb) {
    cb(null, DiscoverContainer)
  },
})

export {
  discoverAll,
  discover,
}

export default [
  discoverAll,
  discover,
]

