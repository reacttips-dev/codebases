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

/* eslint-env browser */

import * as payloads from './payloads'

const region = `(?:[\\w-]+)`
const endpoints: Array<{ path: string; payload: any }> = [
  { path: `api/v0`, payload: payloads.root },
  { path: `api/v1/regions/${region}/node_types/elasticsearch`, payload: payloads.nodeTypes },
  {
    path: `api/v1/regions/${region}/platform/configuration/snapshots/repositories`,
    payload: payloads.snapshotRepos,
  },
]

const _fetch = window.fetch

window.fetch = function (url: string, ...rest) {
  const endpoint = endpoints.find((e) => url.match(e.path + `$`) != null)

  if (endpoint) {
    // eslint-disable-next-line no-console
    console.debug(`Stubbing response for`, url)

    const headers = new Headers()
    headers.append(`content-type`, `application/json`)

    const response = new Response(JSON.stringify(endpoint.payload), {
      status: 200,
      statusText: `OK`,
      headers,
    })

    return Promise.resolve(response)
  }

  return _fetch.apply(this, [url, ...rest])
}
