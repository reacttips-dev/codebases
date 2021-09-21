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
import { RouteComponentProps } from 'react-router'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

import { getDisplayName } from '../getDisplayName'

type Props = RouteComponentProps & RouteConfigComponentProps

export function withChildRoutes(WrappedComponent: ComponentType) {
  const ChildRouteForwarder: FunctionComponent<Props> = (props) => {
    const { route, children } = props
    const childRoutes = route && route.routes
    const replacedChildren = childRoutes ? renderRoutes(childRoutes) : children

    return <WrappedComponent {...props} children={replacedChildren} />
  }

  ChildRouteForwarder.displayName = `withChildRoutes(${getDisplayName(WrappedComponent)})`

  return ChildRouteForwarder
}
