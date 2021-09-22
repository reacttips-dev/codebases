import { bindActionCreators } from 'redux'

import * as serverActions from '../actions/serverActions'

const mapDispatchToServerAction = (dispatch) => {
  return Object.keys(serverActions).reduce((acc, key) => {
    acc[key] = bindActionCreators(serverActions[key], dispatch)
    return acc
  }, {})
}

export default mapDispatchToServerAction
