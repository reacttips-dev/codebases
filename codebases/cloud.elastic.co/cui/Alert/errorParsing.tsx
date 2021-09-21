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
import { FormattedMessage } from 'react-intl'

import { getMessages, getStatus, hasMessages } from '../../lib/error'

const STATUS_CODE_ERROR_MESSAGES = {
  400: `Something failed`,
  404: `Not found`,
  500: `An internal server error occurred`,
}

export interface ApiError {
  body?: {
    error?: string
    errors?: string[]
  }
}

export function getHttpErrorDetails(details: Error & ApiError) {
  const status = getStatus(details)

  if (details.body && (details.body.error || details.body.errors)) {
    return details.message
  }

  if (hasMessages(details)) {
    return (
      <span>
        {parseMessage(getMessages(details))} ({status})
      </span>
    )
  }

  if (STATUS_CODE_ERROR_MESSAGES[status]) {
    return `${status}: ${STATUS_CODE_ERROR_MESSAGES[status]}`
  }

  return null
}

export function parseError(error: string | Error) {
  if (typeof error === `string`) {
    return parseMessage(error)
  }

  const message = hasMessages(error) ? getMessages(error) : null

  if (message != null && typeof message === `string`) {
    return parseMessage(message)
  }

  return (
    <FormattedMessage
      id='alert.sorry-an-error-occurred'
      defaultMessage='Sorry, looks like an error occurred'
    />
  )
}

function parseMessage(message) {
  if (message && message.includes(`requires sudo privileges`)) {
    return (
      <FormattedMessage
        id='alert.sorry-this-error-requires-more-privilages'
        defaultMessage='This operation requires the following privileges: root.'
      />
    )
  }

  if (message === `all shards failed`) {
    return (
      <FormattedMessage
        id='alert.all-elasticsearch-shards-failed'
        defaultMessage="The server couldn't handle the query"
      />
    )
  }

  return message
}
