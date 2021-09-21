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

import {
  getRegionId,
  createUpdateRequestFromGetResponse,
  sanitizeUpdateRequestBeforeSend,
} from '../../../lib/stackDeployments'

import { AnyClusterPlanInfo, SliderInstanceType, StackDeployment } from '../../../types'

import { DeploymentUpdateRequest } from '../../../lib/api/v1/types'

type EditorStateBag = {
  regionId: string
  deploymentId: string
  deployment: DeploymentUpdateRequest | null
}

let initialAdvancedEditorStateBag: EditorStateBag | null = null

/* we can use this functionality to define what the initial state for the advanced
 * deployment editor should be
 */
export function setAdvancedEditInitialState({
  regionId,
  deploymentId,
  deployment,
}: {
  regionId: string
  deploymentId: string
  deployment: DeploymentUpdateRequest | null
}) {
  initialAdvancedEditorStateBag = {
    regionId,
    deploymentId,
    deployment: deployment === null ? null : sanitizeUpdateRequestBeforeSend({ deployment }),
  }
}

export function setAdvancedEditInitialStateFromAttempt({
  deployment,
  planAttempt,
  planAttemptSliderInstanceType,
}: {
  deployment: StackDeployment
  planAttempt: AnyClusterPlanInfo
  planAttemptSliderInstanceType: SliderInstanceType
}) {
  const regionId = getRegionId({ deployment })!
  const { id } = deployment

  const deploymentUpdate = createUpdateRequestFromGetResponse({
    deployment,
    planAttemptUnderRetry: planAttempt.plan,
    planAttemptSliderInstanceType,
  })

  setAdvancedEditInitialState({
    regionId,
    deploymentId: id,
    deployment: deploymentUpdate,
  })
}

export function resetAdvancedEditInitialState() {
  initialAdvancedEditorStateBag = null
}

export function getAdvancedEditInitialState(
  expectedRegionId: string,
  expectedDeploymentId: string,
): DeploymentUpdateRequest | null {
  if (initialAdvancedEditorStateBag === null) {
    return null
  }

  const { regionId, deploymentId, deployment } = initialAdvancedEditorStateBag

  resetAdvancedEditInitialState()

  if (expectedRegionId !== regionId || expectedDeploymentId !== deploymentId) {
    return null // shouldn't ever happen but it's a sensible guard to have — nevertheless
  }

  return deployment
}
