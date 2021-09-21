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

import React, { Component } from 'react'
import classnames from 'classnames'

import { EuiToolTip } from '@elastic/eui'

import './smallErrorBoundary.scss'

type Props = {
  forInlineText?: boolean
}

type State = {
  hasError: boolean
  error: Error | null
}

export class CuiSmallErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  }

  componentDidCatch(error) {
    this.setState({
      hasError: true,
      error,
    })
  }

  render() {
    const { children, forInlineText = false, ...rest } = this.props
    const { hasError, error } = this.state

    // could TS be any dumber?
    const typedError = error as Error | null
    const tooltipContent = (typedError instanceof Error && typedError.stack) || null

    if (hasError) {
      const classes = classnames('cuiSmallErrorBoundary-wrapper', {
        'cuiSmallErrorBoundary--forInlineText': forInlineText,
      })

      return (
        <div className={classes}>
          <EuiToolTip className='cuiSmallErrorBoundary-tooltip' content={tooltipContent}>
            <div className='euiErrorBoundary cuiSmallErrorBoundary-content' {...rest} />
          </EuiToolTip>
        </div>
      )
    }

    return children
  }
}
