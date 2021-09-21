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

import { get } from 'lodash'

import createHighlightsFromSearch from './createHighlightsFromSearch'
import { enrichRolesLegacy } from '../../lib/enrichRoles'

const containerPath = [`containers`, `data`, `containers`]
const rolesPath = [`roles`, `data`, `roles`]

export default function createRunnerFromSearch({ regionId, id, source, highlight, oldHit }) {
  const containers = get(source, containerPath, [])

  const highlights = createHighlightsFromSearch({
    highlight,
    oldHit,
    nameField: `runner_id`,
  })

  return {
    type: `runner`,
    regionId,
    id,
    highlights,
    healthy: source.healthy,
    connected: source.connected,
    containers: containers.map(createContainer),
    roles: enrichRolesLegacy(get(source, rolesPath, {})),
    isDisplayable: source.connected || containers.length > 0,

    // some of the old SaaS runners don't have zone, but they do have it somewhere in the metadata
    zone:
      get(source, [`zone`]) ||
      get(source, [`metadata`, `availabilityZone`]) ||
      get(source, [`attributes`, `metadata`, `availabilityZone`]),
  }
}

function createContainer(container) {
  return {
    name: container.container_name,
    set: container.container_set_name,
    kind: container.kind,
  }
}
