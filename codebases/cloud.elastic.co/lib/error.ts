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

import { find, get, has, some } from 'lodash'

const statusPath = [`response`, `status`]
const messagePath = [`body`, `message`]
const reasonPath = [`body`, `reason`]
const errorsPath = [`body`, `errors`, `0`, `message`]
const errorPath = [`body`, `error`]
const errorReasonPath = [`body`, `error`, `reason`]
const stackPackError = [`body`, `errors`, `0`, `errors`, `errors`, `0`, `message`]
const v0ErrorPath = [`body`, `detail`]

const possibleErrorPaths = [
  messagePath,
  reasonPath,
  errorsPath,
  errorReasonPath,
  errorPath,
  stackPackError,
  v0ErrorPath,
]

export const getStatus = (error?: Error | string): number => get(error, statusPath)
export const hasMessages = (error: Error): boolean =>
  some(possibleErrorPaths.map((path) => has(error, path)))
export const getMessages = (error: Error) =>
  find(possibleErrorPaths.map((path) => get(error, path)))

// TODO remove and have the API return the email properly
export function extractEmailFromError(errorMessage: string): string {
  const matches = errorMessage.match(/'(.*)'/)

  if (!matches) {
    return `?`
  }

  const [email] = matches
  return email
}
