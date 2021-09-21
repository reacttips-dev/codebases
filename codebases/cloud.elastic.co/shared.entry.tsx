/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { noop } from 'lodash'

import React from 'react'
import ReactDOM from 'react-dom'

import { UnhandledApplicationLoadError } from './components/ApplicationLoadError'

import { setInitialTheme, trackColorSchemePreference } from './lib/theme'

import { pullConfigFromHtml } from './lib/configStore'
import { setupGoogleTracking } from './apps/userconsole/lib/googleTracking'
import { configureStore } from './store/_setup'

export function sharedEntryPoint(
  App,
  {
    initHook = noop,
  }: {
    initHook?: () => void
  } = {},
) {
  const appRoot = document.getElementById(`app-root`)

  try {
    setInitialTheme()

    const config = pullConfigFromHtml()
    const store = configureStore({ config })

    if (config.GOOGLE_ANALYTICS_TRACKING_ID) {
      setupGoogleTracking(config.GOOGLE_ANALYTICS_TRACKING_ID)
    }

    trackColorSchemePreference(store)
    initHook()

    render({ App, appRoot, store })
  } catch (err) {
    renderError({ appRoot, err })
  }
}

function render({ App, appRoot, store }) {
  ReactDOM.render(<App store={store} />, appRoot)
}

function renderError({ appRoot, err }) {
  const unhandledError = <UnhandledApplicationLoadError error={err} />

  ReactDOM.render(unhandledError, appRoot)
}
