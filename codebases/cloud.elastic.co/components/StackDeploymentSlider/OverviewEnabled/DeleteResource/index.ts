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

import DeleteResource from './DeleteResource'

import { deleteStackDeploymentResource } from '../../../../actions/stackDeployments'

import { deleteStackDeploymentResourceRequest, getDeploymentTemplate } from '../../../../reducers'

import { getDeploymentTemplateId, getRegionId, getVersion } from '../../../../lib/stackDeployments'

import {
  AnyResourceInfo,
  AsyncRequestState,
  SliderInstanceType,
  StackDeployment,
  ThunkDispatch,
} from '../../../../types'
import { DeploymentTemplateInfoV2 } from '../../../../lib/api/v1/types'

type StateProps = {
  deleteRequest: AsyncRequestState
  deploymentTemplate?: DeploymentTemplateInfoV2
}

type DispatchProps = {
  delete: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
}

const mapStateToProps = (
  state: any,
  { deployment, resource, sliderInstanceType }: ConsumerProps,
): StateProps => {
  const deploymentTemplateId = getDeploymentTemplateId({ deployment })!
  const regionId = getRegionId({ deployment })!

  return {
    deleteRequest: deleteStackDeploymentResourceRequest(
      state,
      deployment.id,
      sliderInstanceType,
      resource.ref_id,
    ),
    deploymentTemplate: getDeploymentTemplate(
      state,
      regionId,
      deploymentTemplateId,
      getVersion({ deployment }),
    ),
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment, resource, sliderInstanceType }: ConsumerProps,
): DispatchProps => ({
  delete: () =>
    dispatch(
      deleteStackDeploymentResource({
        deploymentId: deployment.id,
        resourceRefId: resource.ref_id,
        resourceType: sliderInstanceType,
      }),
    ),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteResource)
