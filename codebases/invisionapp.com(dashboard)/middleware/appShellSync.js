
export const createAppShellSyncMiddleware = ({ feature, syncWith, actions }) => store => dispatch => {
  // Bypass in standalone dev-mode
  if (!window.inGlobalContext) {
    return action => dispatch(action)
  }

  // ACTION_FLAG_KEY marks if an action came from a feature, eg: { type: 'FOO', data: 'BAR', fromFeature: 'home' }
  const ACTION_FLAG_KEY = 'fromFeature'

  actions.forEach(type => {
    // Listen for actions sent from another feature
    window.inGlobalContext.appShell.getFeatureContext(feature).onCommand(type, data => {
      dispatch({ type, data, [ACTION_FLAG_KEY]: syncWith })
    })
  })

  return action => {
    const fromSyncMiddleware = action[ACTION_FLAG_KEY]
    if (actions.includes(action.type) && !fromSyncMiddleware /* To prevent looping */) {
      // Send actions to the other feature
      window.inGlobalContext.appShell.getFeatureContext(syncWith).sendCommand(action.type, action.data)
    }

    return dispatch(action)
  }
}
