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

import React, { FunctionComponent, ComponentType, ReactElement } from 'react'

import { EuiErrorBoundary } from '@elastic/eui'

import { CuiSmallErrorBoundary } from '../SmallErrorBoundary'

type CallbackBoundaryProps = {
  children: () => ReactElement | null
}

export function withErrorBoundary<P>(WrappedComponent: ComponentType<P>): ComponentType<P> {
  const ErrorBoundComponent: FunctionComponent<P> = (props) => (
    <EuiErrorBoundary>
      <WrappedComponent {...props} />
    </EuiErrorBoundary>
  )

  return ErrorBoundComponent
}

export function withSmallErrorBoundary<P>(
  WrappedComponent: ComponentType<P>,
  { forInlineText = false }: { forInlineText?: boolean } = {},
): ComponentType<P> {
  const SmallErrorBoundComponent: FunctionComponent<P> = (props) => (
    <CuiSmallErrorBoundary forInlineText={forInlineText}>
      <WrappedComponent {...props} />
    </CuiSmallErrorBoundary>
  )

  return SmallErrorBoundComponent
}

export const CuiCallbackBoundary = withErrorBoundary<CallbackBoundaryProps>(({ children }) =>
  children(),
)
export const CuiSmallCallbackBoundary = withSmallErrorBoundary<CallbackBoundaryProps>(
  ({ children }) => children(),
)
