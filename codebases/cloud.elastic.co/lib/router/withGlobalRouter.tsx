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

import React, { FunctionComponent, ComponentType } from 'react'
import { withRouter, match as Match, RouteComponentProps } from 'react-router'

import { withRouterContext } from './withRouterContext'

import { getDisplayName } from '../getDisplayName'

import { findRoute } from './matchRoute'

import { RouterContextProps } from './types'

type Props<TParams> = RouteComponentProps<TParams> & RouterContextProps

export function withGlobalRouter<TParams = unknown>(
  WrappedComponent: ComponentType<Props<TParams>>,
) {
  const GlobalRouteMatchForwarder: FunctionComponent<Props<TParams>> = (props) => {
    const { routes, location, match } = props
    const routeMatch = findRoute(routes, location.pathname)
    const matchWithParams = (routeMatch || match) as Match<TParams>
    return <WrappedComponent {...props} match={matchWithParams} />
  }

  GlobalRouteMatchForwarder.displayName = `withGlobalRouter(${getDisplayName(WrappedComponent)})`

  return withRouterContext(withRouter(GlobalRouteMatchForwarder))
}
