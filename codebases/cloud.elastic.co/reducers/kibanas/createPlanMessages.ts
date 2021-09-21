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

import { ClusterPlanStepInfo } from '../../lib/api/v1/types'

export default function createPlanMessages(
  messages: ClusterPlanStepInfo[],
  pendingPlanId?: string | null,
  statusPlanId?: string | null,
): ClusterPlanStepInfo[] {
  if (!pendingPlanId || pendingPlanId === statusPlanId) {
    return messages
  }

  return [
    {
      started: ``,
      info_log: [],
      stage: `starting`,
      status: `pending`,
      step_id: `Waiting for status`,
    },
  ]
}
