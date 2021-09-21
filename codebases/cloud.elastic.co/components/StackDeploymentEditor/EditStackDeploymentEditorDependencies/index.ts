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

import { connect } from 'react-redux'
import { get } from 'lodash'
import { parse } from 'query-string'

import EditStackDeploymentEditorDependencies from './EditStackDeploymentEditorDependencies'

import { fetchDeployment } from '../../../actions/stackDeployments'

import {
  fetchDeploymentTemplatesRequest,
  getDeploymentTemplate,
  getStackDeployment,
} from '../../../reducers'

import {
  getVersion,
  getEsPlanFromGet,
  getDeploymentTemplateId,
} from '../../../lib/stackDeployments'

import { withStackDeploymentRouteParams, WithStackDeploymentRouteParamsProps } from '../routing'

import { EditFlowConsumerProps } from '../types'

import { AsyncRequestState } from '../../../types'

import { DeploymentGetResponse, DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

type StateProps = {
  stackDeployment: DeploymentGetResponse
  deploymentTemplate?: DeploymentTemplateInfoV2 | null
  showFailedAttempt: boolean
  fetchDeploymentTemplatesRequest: AsyncRequestState
}

type DispatchProps = {
  fetchDeployment: (params: { regionId: string; deploymentId: string }) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps & EditFlowConsumerProps

const mapStateToProps = (
  state,
  { regionId, location, stackDeploymentId }: ConsumerProps,
): StateProps => {
  const query = parse(location.search.slice(1))
  const stackDeployment = getStackDeployment(state, stackDeploymentId)!
  const version = getVersion({ deployment: stackDeployment })
  const deploymentTemplateId = getDeploymentTemplateId({ deployment: stackDeployment })
  const deploymentTemplate =
    (deploymentTemplateId &&
      version &&
      getDeploymentTemplate(state, regionId, deploymentTemplateId, version)!) ||
    null

  const currentEsPlan = getEsPlanFromGet({ deployment: stackDeployment })!
  const pendingEsPlan = getEsPlanFromGet({ deployment: stackDeployment, state: `pending` })!

  const versionPath = [`elasticsearch`, `version`]
  const noCurrentVersion = !get(currentEsPlan, versionPath)
  const noPendingVersion = !get(pendingEsPlan, versionPath)

  // if there is no pending or current plan (as evidenced by a lack of version)
  // then we can't show anything other than the last plan attempt
  const showFailedAttempt =
    String(query.fromAttempt) === `true` || (noCurrentVersion && noPendingVersion)

  return {
    stackDeployment,
    deploymentTemplate,
    showFailedAttempt,
    fetchDeploymentTemplatesRequest: fetchDeploymentTemplatesRequest(state, regionId, version),
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchDeployment,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(EditStackDeploymentEditorDependencies),
)
