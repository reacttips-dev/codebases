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

import { isEmpty } from 'lodash'
import { parse, stringify } from 'query-string'

import history from '../../lib/history'

// document.location can be null, according to MDN, hence the postfix `!` operators below.
// https://developer.mozilla.org/en-US/docs/Web/API/Document/location

export function getQueryString({ key }: { key: string }): string {
  const { search } = document.location!
  const queryString = search.slice(1)
  const query = parse(queryString)
  const value = query[key] || ``

  if (Array.isArray(value)) {
    return value.join(`,`)
  }

  return value
}

export function setQueryString({ key, value }: { key: string; value?: string | null }) {
  const { pathname, search } = document.location!
  const queryString = search.slice(1)
  const query = parse(queryString)

  const nonEmptyValue = value !== undefined && value !== null && value !== ``

  if (nonEmptyValue) {
    query[key] = value!
  } else {
    delete query[key]
  }

  const nextQuery = stringify(query)

  const nextUrl = isEmpty(nextQuery) ? pathname : `${pathname}?${nextQuery}`

  const prevUrl = pathname + search

  if (nextUrl === prevUrl) {
    return
  }

  history.replace(nextUrl)
}
