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

import { isEmpty, omit } from 'lodash'

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiCallOut, EuiErrorBoundary, EuiSpacer, IconType } from '@elastic/eui'

import { getHttpErrorDetails, parseError } from './errorParsing'

import { BasicFailedReply } from '../../lib/api/v1/types'

import './alert.scss'

// 'error' and 'danger' are synonyms
export type AlertType = 'error' | 'danger' | 'warning' | 'info' | 'success'

type Color = 'primary' | 'success' | 'warning' | 'danger'

export type { ApiError } from './errorParsing'

export { parseError } from './errorParsing'

type Props = {
  children?: ReactNode | Error
  className?: string
  type: AlertType
  iconType?: IconType
  details?: ReactNode | Error
  size?: 's' | 'm'
}

type State = {
  showDetails: boolean
}

const alertTypeToCallOutColor: { [alertType: string]: Color } = {
  error: `danger`,
  info: `primary`,
}

export class CuiAlert extends Component<Props, State> {
  state: State = {
    showDetails: false,
  }

  render() {
    const { iconType, type, className, children, size, ...rest } = this.props

    const color = alertTypeToCallOutColor[type] || type
    const message = this.getMessage()

    if (this.isModernUseCase()) {
      const { errors } = (children as any).body as BasicFailedReply

      return (
        <EuiErrorBoundary>
          <EuiCallOut
            iconType={iconType}
            title={
              errors.length === 1 ? (
                errors[0].message
              ) : (
                <FormattedMessage
                  id='cui-alert.something-went-wrong'
                  defaultMessage='Something went wrong'
                />
              )
            }
            color={color}
            className={className}
            size={size}
            {...omit(rest, 'details')}
          >
            {errors.length > 1 && (
              <ul>
                {errors.map((error, index) => (
                  <li key={index} data-error-code={error.code}>
                    {error.message}
                  </li>
                ))}
              </ul>
            )}
          </EuiCallOut>
        </EuiErrorBoundary>
      )
    }

    const legacyDetails = this.renderDetails()

    return (
      <EuiErrorBoundary>
        <EuiCallOut
          iconType={iconType}
          title={message}
          color={color}
          className={className}
          size={size}
          {...omit(rest, 'details')}
        >
          {legacyDetails}
        </EuiCallOut>
      </EuiErrorBoundary>
    )
  }

  renderDetails() {
    const { showDetails } = this.state
    const details = this.getDetails()

    if (!details) {
      return null
    }

    if (showDetails) {
      return (
        <div>
          <EuiButton onClick={() => this.setState({ showDetails: false })}>
            <FormattedMessage id='alert.hide-details' defaultMessage='Hide Details' />
          </EuiButton>

          <EuiSpacer size='m' />

          {details}
        </div>
      )
    }

    return (
      <div>
        <EuiButton onClick={() => this.setState({ showDetails: true })}>
          <FormattedMessage id='alert.show-details' defaultMessage='Show Details' />
        </EuiButton>
      </div>
    )
  }

  getMessage() {
    const { details, children } = this.props

    if (children instanceof Error) {
      return parseError(children)
    }

    if (children) {
      return children
    }

    if (details instanceof Error) {
      return parseError(details)
    }

    return details
  }

  getDetails() {
    const { details } = this.props
    return details instanceof Error ? getHttpErrorDetails(details) : details
  }

  isModernUseCase(): boolean {
    const { details, children } = this.props

    /* <CuiAlert> still deals with a mountain of corner cases, but for the vast majority of
     * modern API errors, we can do better than the legacy handling we've historically had to offer here.
     *
     * The modern case consumes `CuiAlert` as such:
     * `<CuiAlert type='error'>{someApiError}</CuiAlert>`
     */

    // modern use cases don't use the `details` prop
    if (details) {
      return false
    }

    // modern use cases pass in an `Error` in the `children`
    if (!(children instanceof Error)) {
      return false
    }

    const basicFailedReply = (children as any).body as BasicFailedReply

    // modern use cases pass in an `Error` from `AsyncRequestState`
    if (!basicFailedReply) {
      return false
    }

    if (!Array.isArray(basicFailedReply.errors)) {
      return false
    }

    if (isEmpty(basicFailedReply.errors)) {
      return false
    }

    const everyErrorIsBasicFailedReplyElement = basicFailedReply.errors.every(
      (error) => typeof error.message === `string`,
    )

    return everyErrorIsBasicFailedReplyElement
  }
}
