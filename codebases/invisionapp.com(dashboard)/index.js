import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { HeliosProvider } from '@invisionapp/helios'
import { ThemeProvider } from '@invisionapp/helios-one-web'
import objectFitImages from 'object-fit-images'

import { setInitialSidebarState } from './utils/verifySidebarState'
import configureStore from './store/store'

import Router from './Router.jsx'

import './utils/cookieSizeHelper'

// temporarily allow home assets to be accessed directly
require.context('./assets', true, /\.(png|jpg)$/)

if (window.inGlobalContext) {
  // For cloud-ui
  const { appShell } = window.inGlobalContext
  const appContext = appShell.getFeatureContext('home')
  const { MOUNT } = appShell.events.COMMAND_TYPES

  appContext.onCommandDeferred(MOUNT, async ({ renderReactComponent, envContext }) => {
    setInitialSidebarState()

    const bugsnag = await appContext.getRuntimeProvidedResource('bugsnag')
    const bugsnagClient = bugsnag && bugsnag.getClient()
    const ErrorBoundary = bugsnagClient && bugsnagClient.getPlugin('react').createErrorBoundary(React)

    const store = configureStore()

    let component = (
      <Provider store={store}>
        <HeliosProvider>
          <ThemeProvider theme='light'>
            <Router />
          </ThemeProvider>
        </HeliosProvider>
      </Provider>
    )

    if (ErrorBoundary && envContext.tier !== 'local') {
      component = (
        <ErrorBoundary>
          <Provider store={store}>
            <HeliosProvider>
              <ThemeProvider theme='light'>
                <Router />
              </ThemeProvider>
            </HeliosProvider>
          </Provider>
        </ErrorBoundary>
      )
    }

    // Tell app-shell to handle the mounting/unmounting of the React component.
    renderReactComponent({
      reactComponent: component,
      reactDom: ReactDOM,
      react: React
    })
  })
} else {
  // For testing standalone
  const mountElement = document.getElementById('root')

  // object-fit polyfill
  objectFitImages()
  const store = configureStore()

  let component = (
    <Provider store={store}>
      <HeliosProvider>
        <ThemeProvider theme='light'>
          <Router />
        </ThemeProvider>
      </HeliosProvider>
    </Provider>
  )

  ReactDOM.render(component, mountElement)
}
