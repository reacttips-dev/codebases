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

import asyncRequest from '../asyncRequests'
import { FETCH_FEED } from '../../constants/actions'
import { getConfigForKey } from '../../store'

export function fetchFeed({ feed, version }: { feed: string; version: string }) {
  const url = `${getConfigForKey(`PORTAL_FEEDS_BASE_PATH`)}/${feed}/v${version}.json`

  const seed = `${feed}-${version}`
  return asyncRequest({
    type: FETCH_FEED,
    url,
    meta: { feed, version },
    crumbs: [seed],
  })
}
