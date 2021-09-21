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

import { ENABLE_ILM } from '../../constants/actions'

import { enableDeploymentResourceIlmUrl } from '../../lib/api/v1/urls'

import { StackDeployment } from '../../types'
import { ElasticsearchResourceInfo } from '../../lib/api/v1/types'

export type IndexPatternConversion = {
  index_pattern: string
  policy_name: string
  node_attributes: {
    [key: string]: string
  }
}

export function migrateToIlm({
  deployment,
  resource,
  indexPatterns,
}: {
  deployment: StackDeployment
  resource: ElasticsearchResourceInfo
  indexPatterns: IndexPatternConversion[]
}) {
  const url = enableDeploymentResourceIlmUrl({
    deploymentId: deployment.id,
    refId: resource.ref_id,
  })

  return asyncRequest({
    type: ENABLE_ILM,
    method: `POST`,
    url,
    payload: {
      index_patterns: indexPatterns,
    },
  })
}
