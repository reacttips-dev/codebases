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

import history from '../lib/history'
import { post } from '../lib/ajax'
import { getLink } from '../lib/links'
import { SEARCH } from '../constants/actions'

export const searchRequest = (id, query) => ({
  type: SEARCH,
  meta: { id, query },
})

export const searchResponse = (id, query, json) => ({
  type: SEARCH,
  payload: json,
  meta: { id, query },
})

export const searchError = (id, query, error) => ({
  type: SEARCH,
  error: true,
  payload: error,
  meta: { id, query },
})

function performSearch(esRootUrl, query = {}) {
  let url = esRootUrl

  if (query.index !== undefined) {
    url += `/${query.index}`

    if (query.type !== undefined) {
      url += `/${query.type}`
    }
  }

  url += `/_search`

  return post(url, query.body || {})
}

export function search(id, query) {
  return (dispatch, getState) => {
    const url = getLink(getState().root, `elasticsearch`)

    dispatch(searchRequest(id, query))
    return performSearch(url, query).then(
      (response) => dispatch(searchResponse(id, query, response.body)),
      (error) => dispatch(searchError(id, query, error)),
    )
  }
}

export const goToUrl = (url) => () => {
  history.push(url)
}
