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

import { CLEAR_CLUSTER_CREDENTIALS } from '../../constants/actions'
import { Action, StackDeployment } from '../../types'

import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

export function clearClusterCredentials({
  deployment,
}: {
  deployment: StackDeployment
}): Action<typeof CLEAR_CLUSTER_CREDENTIALS> {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  const { id } = deployment
  const { ref_id } = esCluster!

  return {
    type: CLEAR_CLUSTER_CREDENTIALS,
    meta: { id, refId: ref_id },
  }
}
