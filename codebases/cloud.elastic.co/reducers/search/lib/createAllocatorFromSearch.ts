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

import { get, keys, pickBy } from 'lodash'

import createHighlightsFromSearch from './createHighlightsFromSearch'

const paths = {
  instances: [`instances`, `data`, `instances`],
  features: [`attributes`, `features`],
}

export default function createAllocatorFromSearch({ regionId, id, source, highlight, oldHit }) {
  const instances = get(source, paths.instances, [])

  const highlights = createHighlightsFromSearch({
    highlight,
    oldHit,
    nameField: `allocator_id`,
  })

  // This will get all features marked as `true` (aka enabled)
  const enabledFeatures = keys(pickBy(get(source, paths.features, {})))
  const { metadata } = source

  return {
    type: `allocator`,
    regionId,
    id: source.allocator_id || id,
    highlights,
    healthy: source.healthy,
    connected: source.connected,
    availabilityZone: source.allocator_zone,
    capacity: {
      total: source.capacity,
      used: source.instance_capacities,
    },
    instances: instances.map(createInstance),
    enabledFeatures,
    isInMaintenanceMode: get(source.metadata, [`maintenance`], false) === true,
    tags: Object.keys(metadata).map((key) => ({
      key,
      value: String(metadata[key]),
    })),
  }
}

function createInstance(instance) {
  return {
    clusterId: instance.cluster_name,
    id: `${instance.cluster_name}-${instance.instance_name}`,
    instanceName: instance.instance_name,
    capacity: instance.options.instance_capacity,
    kind: instance.kind,
  }
}
