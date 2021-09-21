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

import { getReduxState } from '../../store'

import { getDeploymentTemplate } from '../../reducers/deploymentTemplates'

import {
  DeploymentCreateRequest,
  DeploymentTemplateInfoV2,
  DeploymentUpdateRequest,
} from '../api/v1/types'

export function getDeploymentTemplateInfoForDeploymentUpsertRequest({
  deployment,
}: {
  deployment:
    | Pick<DeploymentCreateRequest, 'resources'>
    | Pick<DeploymentUpdateRequest, 'resources'>
}): DeploymentTemplateInfoV2 | undefined {
  const esPayload = deployment.resources?.elasticsearch?.[0]

  if (!esPayload) {
    return // sanity
  }

  const templateId = esPayload.plan.deployment_template?.id
  const regionId = esPayload.region
  const version = esPayload.plan.elasticsearch.version

  if (!templateId || !regionId || !version) {
    return // sanity
  }

  const state = getReduxState()

  if (!state.deploymentTemplates) {
    return // tests may not always have this redux tree populated
  }

  return getDeploymentTemplate(state.deploymentTemplates, regionId, templateId, version)
}
