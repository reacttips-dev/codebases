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

import { ReactElement, ReactNode } from 'react'
import { connect } from 'react-redux'

import { ButtonSize, ButtonColor } from '@elastic/eui'

import QuickDeploymentUpdateButton from './QuickDeploymentUpdateButton'

import { updateDeployment, resetUpdateDeployment } from '../../../actions/stackDeployments'

import { updateStackDeploymentRequest } from '../../../reducers'

import { isFeatureActivated } from '../../../selectors'

import { getRegionId } from '../../../lib/stackDeployments'

import Feature from '../../../lib/feature'

import {
  AsyncRequestState,
  AnyClusterPlanInfo,
  ReduxState,
  SliderInstanceType,
} from '../../../types'

import {
  DeploymentSearchResponse,
  DeploymentGetResponse,
  DeploymentUpdateRequest,
  DeploymentTemplateInfoV2,
} from '../../../lib/api/v1/types'

type StackDeployment = DeploymentSearchResponse | DeploymentGetResponse

type StateProps = {
  regionId: string
  hideExtraFailoverOptions: boolean
  hidePlanDetails: boolean
  showAdvancedEditor: boolean
  updateStackDeploymentRequest: AsyncRequestState
  deploymentTemplate?: DeploymentTemplateInfoV2
}

type DispatchProps = {
  updateDeployment: (params: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
  resetUpdateDeployment: (regionId: string, deploymentId: string) => void
}

type ConsumerProps = {
  children?: ReactNode
  fill?: boolean
  size?: ButtonSize
  color?: ButtonColor
  isEmpty?: boolean
  disabled?: boolean
  deployment: StackDeployment
  sliderInstanceType?: SliderInstanceType
  planAttemptUnderRetry?: AnyClusterPlanInfo | null
  transformBeforeUpdate?: (deploymentCopy: StackDeployment) => StackDeployment
  confirmTitle?: ReactElement
  ['data-test-id']?: string
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const regionId = getRegionId({ deployment })!

  return {
    regionId,
    hideExtraFailoverOptions: isFeatureActivated(state, Feature.hideExtraFailoverOptions),
    hidePlanDetails: isFeatureActivated(state, Feature.hidePlanDetails),
    showAdvancedEditor: isFeatureActivated(state, Feature.showAdvancedEditor),
    updateStackDeploymentRequest: updateStackDeploymentRequest(state, deployment.id),
  }
}

const mapDispatchToProps: DispatchProps = {
  updateDeployment,
  resetUpdateDeployment,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(QuickDeploymentUpdateButton)

export type { QuickDeploymentUpdateCustomModalProps } from './QuickDeploymentUpdateButton'
