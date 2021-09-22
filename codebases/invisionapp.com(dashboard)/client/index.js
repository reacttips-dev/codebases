import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'
import { Routes } from './Routes'
import { initializeBugsnagClient } from './ops/bugsnag'
import configureStore from './stores/configureStore'
import app from './stores/app'
import { navigateToSignIn } from './stores/location'
import { appShell, appContext } from './inGlobalContext'

// Tell the app shell that the app will tell it when it's ready to render
appContext.onCommandDeferred(appShell.events.COMMAND_TYPES.MOUNT, ({ mountElement }) => {
  // Set up store
  const store = configureStore()
  const history = syncHistoryWithStore(browserHistory, store)

  initializeBugsnagClient().then(({ ErrorBoundary }) => {
    // Mountable entry component
    const Root = ({ Routes }) => {
      return (
        <ErrorBoundary>
          <AppContainer>
            <Routes store={store} history={history} />
          </AppContainer>
        </ErrorBoundary>
      )
    }

    ReactDOM.render(<Root Routes={Routes} />, mountElement)

    if (module.hot) {
      module.hot.accept('./Routes', () => {
        const NextRoutes = require('./Routes').default
        ReactDOM.render(<Root Routes={NextRoutes} />, mountElement)
      })
    }
  })

  // Load all initial application data
  app
    .load(store.dispatch)
    .then(() => {
      // user is authenticated and we can tell app shell to mount/show the app
      appContext.resolveCommand(appShell.events.COMMAND_TYPES.MOUNT)

      // update the hint because we know the user is authed
      appShell.user.hasAuthedSessionHint(true)
    })
    .catch(error => {
      switch (error.response?.status?.toString()) {
        case '401': {
          // User is not authenticated if it gets to this point
          appContext.rejectCommand(appShell.events.COMMAND_TYPES.MOUNT)
          navigateToSignIn()
          break
        }
        default: {
          store.dispatch(app.appLoadError(error))
          appContext.resolveCommand(appShell.events.COMMAND_TYPES.MOUNT)
        }
      }
    })
})

// avoid unmounting process unless we are in the composition
// mode - the iframe removal will take care of cleanup otherwise
if (appContext.supportsComposition && appContext.supportsComposition()) {
  appContext.onCommand(appShell.events.COMMAND_TYPES.UNMOUNT, ({ mountElement }) => {
    ReactDOM.unmountComponentAtNode(mountElement)
  })
}
