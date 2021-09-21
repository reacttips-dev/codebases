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

import React from 'react'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import 'unfetch/polyfill' // eslint-disable-line import/no-extraneous-dependencies

import AppRouter from '../../components/AppRouter'

import { getLanguage } from '../../lib/locale'

import { getRoutes, getRedirects } from './routes'

import { addLocales, enMessages } from '../../i18n/intl'

import './stubs'

import '../../styles/app.scss'

addLocales()

function App({ store }) {
  const lang = getLanguage(window.navigator)

  return (
    <IntlProvider key={lang} locale={lang} messages={enMessages}>
      <Provider store={store}>
        <AppRouter store={store} getRoutes={getRoutes} getRedirects={getRedirects} />
      </Provider>
    </IntlProvider>
  )
}

export default App
