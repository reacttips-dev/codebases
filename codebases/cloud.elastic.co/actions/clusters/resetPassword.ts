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
import { resetElasticsearchUserPasswordUrl } from '../../lib/api/v1/urls'
import { DeploymentGetResponse } from '../../lib/api/v1/types'
import { getFirstEsClusterFromGet } from '../../lib/stackDeployments'

import { RESET_CLUSTER_PASSWORD } from '../../constants/actions'

export function resetPassword(deployment: DeploymentGetResponse) {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (!esCluster) {
    // sanity, shouldn't ever happen
    return
  }

  const { id } = deployment
  const { ref_id } = esCluster
  const url = resetElasticsearchUserPasswordUrl({ deploymentId: id, refId: ref_id })

  return asyncRequest({
    type: RESET_CLUSTER_PASSWORD,
    method: `POST`,
    url,
    meta: { id, refId: ref_id },
    crumbs: [id, ref_id],
  })
}
