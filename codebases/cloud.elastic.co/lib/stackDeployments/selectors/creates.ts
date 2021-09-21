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

import { find } from 'lodash'

import { rcompare } from '../../semver'

import {
  DeploymentCreateRequest,
  DeploymentCreateResponse,
  DeploymentResource,
  DeploymentUpdateRequest,
  ElasticsearchPayload,
} from '../../api/v1/types'

export const getCreatedResourceByRefId = ({
  deployment,
  refId,
}: {
  deployment: DeploymentCreateResponse
  refId: string
}): DeploymentResource | null => {
  const resource = find(deployment.resources, { ref_id: refId })

  return resource || null
}

export function getUpsertVersion({
  _joltVersion,
  _fromJolt = true,
  deployment,
}: {
  _joltVersion?: string | void
  _fromJolt?: boolean
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): string | null {
  if (_fromJolt !== false && _joltVersion) {
    return _joltVersion
  }

  if (!Array.isArray(deployment.resources!.elasticsearch)) {
    return null
  }

  const versions = deployment.resources!.elasticsearch.map(getEsVersion).filter(Boolean)

  const [topVersion] = sortVersions(versions)

  return topVersion

  function getEsVersion(cluster: ElasticsearchPayload): string | null {
    if (!cluster.plan) {
      return null
    }

    return cluster.plan.elasticsearch.version || null
  }
}

function sortVersions(versions) {
  return versions.slice().sort(rcompare)
}
