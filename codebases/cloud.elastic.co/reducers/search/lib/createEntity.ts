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

import createAllocatorFromSearch from './createAllocatorFromSearch'
import createApmFromSearch from './createApmFromSearch'
import createAppSearchFromSearch from './createAppsearchFromSearch'
import createClusterFromSearch from './createClusterFromSearch'
import createHighlightsFromSearch from './createHighlightsFromSearch'
import createKibanaFromSearch from './createKibanaFromSearch'
import createRunnerFromSearch from './createRunnerFromSearch'

interface Hit {
  _index: string
  _id: string
  _type: string
  _source: any
  highlight: any
}

export function createEntity(hit: Hit, oldHit = {}) {
  const id = hit._id
  const type = hit._type
  const source = hit._source
  const highlight = hit.highlight
  const regionId = getRegionId(hit)

  if (type === `deployment`) {
    return createDeploymentFromSearch({ regionId, id, source, highlight })
  }

  if (type === `cluster`) {
    return createClusterFromSearch({ regionId, id, source, highlight, oldHit })
  }

  if (type === `kibana-cluster`) {
    return createKibanaFromSearch({ regionId, id, source, highlight, oldHit })
  }

  if (type === `runner`) {
    return createRunnerFromSearch({ regionId, id, source, highlight, oldHit })
  }

  if (type === `allocator`) {
    return createAllocatorFromSearch({ regionId, id, source, highlight, oldHit })
  }

  if (type === `apm-cluster`) {
    return createApmFromSearch({ regionId, id, source, highlight, oldHit })
  }

  if (type === `appsearch-cluster`) {
    return createAppSearchFromSearch({ regionId, id, source, highlight, oldHit })
  }

  return createUnknownEntityFromSearch({
    type,
    regionId,
    id,
  })
}

function createDeploymentFromSearch({
  regionId,
  id,
  source,
  highlight,
}: {
  regionId: string
  id: string
  source: any
  highlight
}) {
  const highlights = createHighlightsFromSearch({ highlight, oldHit: null, nameField: `id` })

  return {
    type: `deployment`,
    regionId,
    id,
    document: source,
    highlights,
  }
}

function createUnknownEntityFromSearch({
  type,
  regionId,
  id,
}: {
  type: string
  regionId: string
  id: string
}) {
  return {
    type,
    regionId,
    id,
  }
}

export function createId(hit: Hit) {
  return `${hit._index}/${hit._id}`
}

// TODO Stupid hack because region does not exist in the search source
function getRegionId(hit: Hit) {
  const id = hit._index.slice(hit._type.length)
  return id.substr(id.indexOf(`-`) + 1)
}
