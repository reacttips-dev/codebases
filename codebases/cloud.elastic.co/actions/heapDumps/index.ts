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

import { FETCH_HEAP_DUMPS, CAPTURE_HEAP_DUMP } from '../../constants/actions'

import {
  getDeploymentHeapDumpsUrl,
  captureDeploymentInstanceHeapDumpUrl,
} from '../../lib/api/v1/urls'

import { SliderInstanceType } from '../../types'

export function fetchHeapDumps({ deploymentId }: { deploymentId: string }) {
  const url = getDeploymentHeapDumpsUrl({
    deploymentId,
  })

  return asyncRequest({
    type: FETCH_HEAP_DUMPS,
    url,
    meta: {
      deploymentId,
    },
    crumbs: [deploymentId],
  })
}

export function startHeapDumpCapture({
  deploymentId,
  resourceKind,
  refId,
  instanceId,
}: {
  deploymentId: string
  resourceKind: SliderInstanceType
  refId: string
  instanceId: string
}) {
  const url = captureDeploymentInstanceHeapDumpUrl({
    deploymentId,
    resourceKind,
    refId,
    instanceId,
  })

  return asyncRequest({
    type: CAPTURE_HEAP_DUMP,
    method: 'post',
    url,
    meta: {
      deploymentId,
      resourceKind,
      refId,
      instanceId,
    },
    crumbs: [deploymentId, refId, instanceId],
  })
}
