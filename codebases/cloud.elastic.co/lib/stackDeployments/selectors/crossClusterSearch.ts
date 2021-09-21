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

import { getEsPlanFromGet } from './fundamentals'

import { isCcsFeatureActivated } from '../../deployments/ccs'

import { StackDeployment } from '../../../types'

import { RemoteResourceRef } from '../../../lib/api/v1/types'

export function getRemoteDeployments({
  deployment,
}: {
  deployment: StackDeployment
}): RemoteResourceRef[] {
  if (!isCcsFeatureActivated()) {
    return []
  }

  const plan = getEsPlanFromGet({ deployment })

  if (!plan?.transient?.remote_clusters) {
    return []
  }

  return plan.transient.remote_clusters.resources
}
