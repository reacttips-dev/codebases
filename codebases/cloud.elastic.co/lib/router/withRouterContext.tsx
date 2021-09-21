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

import { AppRouterContext } from '../../components/AppRouter/AppRouterContext'

import { getDisplayName } from '../getDisplayName'

import { RouterContextProps } from './types'

type Props = RouterContextProps

export function withRouterContext(WrappedComponent: ComponentType<Props>) {
  const RouterContextForwarder: FunctionComponent = (props) => (
    <AppRouterContext.Consumer>
      {({ routes }) => <WrappedComponent {...props} routes={routes} />}
    </AppRouterContext.Consumer>
  )

  RouterContextForwarder.displayName = `withRouterContext(${getDisplayName(WrappedComponent)})`

  return RouterContextForwarder
}
