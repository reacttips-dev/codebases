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

import React, { Component, ComponentType } from 'react'
import hoistStatics from 'hoist-non-react-statics'

import { EuiLoadingContent } from '@elastic/eui'

import { CuiAlert } from '../../cui'

import { startPageActions } from '.'

import { getDisplayName } from '../getDisplayName'

import { AsyncRequestState } from '../../types'

type LoadingConfig = {
  transaction?: string
  fetch?: () => void
  request: AsyncRequestState
  result: unknown | null
  handleError?: boolean
  blockWhileLoading?: boolean
}

const baseAsyncRequest: AsyncRequestState = {
  inProgress: false,
  isDone: true,
  error: ``,
  meta: {},
}

function withLoading<Props = any>(
  WrappedComponent: ComponentType<Props>,
  getConfig: (props: Props) => LoadingConfig,
): ComponentType<Props> {
  class LoadingWrapper extends Component<Props> {
    static displayName: string

    static WrappedComponent = WrappedComponent // eslint-disable-line react/sort-comp

    startedTransaction = false

    componentDidMount() {
      const { fetch } = getConfig(this.props)

      if (fetch) {
        fetch()
      }
    }

    componentDidUpdate() {
      const { request = baseAsyncRequest, result, transaction } = getConfig(this.props)

      if (transaction) {
        if ((request != null && request.error) || result != null) {
          // The initial page load data dependency has resolved in some way.
          // Start a new transaction to capture any subsequent operations,
          // which has the effect of ending the route-change transaction.
          if (!this.startedTransaction) {
            startPageActions(transaction)
            this.startedTransaction = true
          }
        }
      }
    }

    render() {
      const {
        request = baseAsyncRequest,
        result,
        handleError = true,
        blockWhileLoading = true,
      } = getConfig(this.props)

      if (request != null && request.error && handleError) {
        return <CuiAlert type='error'>{request.error}</CuiAlert>
      }

      if (blockWhileLoading && (request.inProgress || result == null)) {
        return <EuiLoadingContent />
      }

      return <WrappedComponent {...this.props} />
    }
  }

  LoadingWrapper.displayName = `withLoading(${getDisplayName(WrappedComponent)})`

  return hoistStatics(LoadingWrapper, WrappedComponent)
}

export default withLoading
