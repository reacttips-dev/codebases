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

import { withTransaction } from '@elastic/apm-rum-react'

import StackDeploymentActivity from './StackDeploymentActivity'

import { getDeploymentTemplate, getStackDeployment } from '../../reducers'

import { isFeatureActivated } from '../../selectors'

import { getVersion, getDeploymentTemplateId } from '../../lib/stackDeployments'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../StackDeploymentEditor'

import { StackDeployment } from '../../types'

import { DeploymentTemplateInfoV2 } from '../../lib/api/v1/types'
import Feature from '../../lib/feature'

type StateProps = {
  stackDeployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2 | null
  regionId: string
  selectedTabUrl: string
  downloadActivityFeature: boolean
}

interface DispatchProps {}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (
  state,
  { location, regionId, stackDeploymentId }: ConsumerProps,
): StateProps => {
  const deployment = getStackDeployment(state, stackDeploymentId)!
  const version = getVersion({ deployment })!

  const deploymentTemplateId = getDeploymentTemplateId({ deployment })!
  const deploymentTemplate = getDeploymentTemplate(state, regionId, deploymentTemplateId, version)

  return {
    stackDeployment: deployment,
    deploymentTemplate,
    regionId,
    selectedTabUrl: location.pathname,
    downloadActivityFeature: isFeatureActivated(state, Feature.downloadActivityJson),
  }
}

const mapDispatchToProps: DispatchProps = {}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(withTransaction(`Deployment activity`, `component`)(StackDeploymentActivity)),
)
