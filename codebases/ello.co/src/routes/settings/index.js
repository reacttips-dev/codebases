import SettingsContainer from '../../containers/SettingsContainer'

export default [
  {
    path: 'settings',
    getComponents(location, cb) {
      cb(null, SettingsContainer)
    },
  },
]

