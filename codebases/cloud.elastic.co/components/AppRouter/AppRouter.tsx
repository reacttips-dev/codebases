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

import React, { Fragment, FunctionComponent } from 'react'
import { injectIntl, IntlShape } from 'react-intl'
import { renderRoutes, RouteConfig } from 'react-router-config'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'

import { AppRouterContext } from './AppRouterContext'
import AppRouterEvents from './AppRouterEvents'

import { renderRedirects } from '../../lib/router'

import history from '../../lib/history'

import { ReduxState, RedirectConfig } from '../../types'

type Props = {
  intl: IntlShape
  store: Store<ReduxState>
  getRedirects: (getRedirectsProps: { store: Store<ReduxState> }) => RedirectConfig[]
  getRoutes: (getRoutesProps: { store: Store<ReduxState>; intl: IntlShape }) => RouteConfig[]
}

const AppRouterImpl: FunctionComponent<Props> = ({ intl, store, getRedirects, getRoutes }) => {
  const redirects = getRedirects({ store })
  const routes = getRoutes({ store, intl })

  return (
    <ConnectedRouter history={history}>
      <Fragment>
        <AppRouterContext.Provider value={{ routes }}>
          {renderRedirects(redirects)}
          {renderRoutes(routes)}
          <AppRouterEvents routes={routes} />
        </AppRouterContext.Provider>
      </Fragment>
    </ConnectedRouter>
  )
}

export const AppRouter = injectIntl(AppRouterImpl)
