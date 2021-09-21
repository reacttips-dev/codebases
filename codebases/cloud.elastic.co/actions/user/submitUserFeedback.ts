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

import { SUBMIT_USER_FEEDBACK } from '../../constants/actions'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'
import { RegionId, StackDeployment } from '../../types'
import { FeedbackType } from '../../types/custom'

export function submitUserFeedbackForDeployment({
  deployment,
  type,
  reasons,
  feedback,
}: {
  deployment: StackDeployment
  type: string
  reasons: FeedbackType[]
  feedback?: string
}) {
  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const { region: regionId, id: clusterId } = esCluster
  return submitUserFeedbackImpl({ regionId, clusterId, type, reasons, feedback })
}

function submitUserFeedbackImpl({
  regionId,
  clusterId,
  type,
  reasons,
  feedback,
}: {
  regionId: RegionId
  clusterId: string
  type: string
  reasons: FeedbackType[]
  feedback?: string
}) {
  const url = `api/v1/users/feedback`

  const payload = {
    deployment: {
      id: clusterId,
      kind: `elasticsearch`,
    },
    type,
    reasons,
    comment: feedback,
  }

  return asyncRequest({
    type: SUBMIT_USER_FEEDBACK,
    method: `POST`,
    url,
    payload,
    meta: { regionId, id: clusterId },
    crumbs: [regionId, clusterId],
  })
}
