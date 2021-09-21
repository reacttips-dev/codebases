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

import { uniqueId } from 'lodash'

import { SEARCH_FOR_ANYTHING } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { searchAllUrl } from '../../lib/api/v1/urls'

import { RefinedSearchResults, ThunkAction } from '../../types'

export function searchForAnything(
  searchId: string,
  queryString: string,
): ThunkAction<Promise<RefinedSearchResults>> {
  const requestNonce = uniqueId(`searchForAnything::${searchId}`)

  return asyncRequest({
    url: searchAllUrl({ q: queryString.trim() }),
    type: SEARCH_FOR_ANYTHING,
    method: `GET`,
    meta: { searchId, requestNonce },
    crumbs: [searchId],
  })
}
