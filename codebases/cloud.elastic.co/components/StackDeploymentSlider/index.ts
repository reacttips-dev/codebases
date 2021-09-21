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
import { last } from 'lodash'

import StackDeploymentSlider from './StackDeploymentSlider'

import { getStackDeployment } from '../../reducers'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../StackDeploymentEditor'

import { getFirstSliderClusterFromGet } from '../../lib/stackDeployments/selectors'
import Feature from '../../lib/feature'
import { isFeatureActivated } from '../../selectors'

import {
  AnyResourceInfo,
  ReduxState,
  RegionId,
  SliderInstanceType,
  StackDeployment,
} from '../../types'

type StateProps = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  regionId: RegionId
  sliderInstanceType: SliderInstanceType
  hideDelete: boolean
}

interface DispatchProps {}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (
  state: ReduxState,
  { stackDeploymentId, regionId, location: { pathname = `` } }: ConsumerProps,
): StateProps => {
  const deployment = getStackDeployment(state, stackDeploymentId)!
  const sliderInstanceType = last(pathname.split(`/`)) as SliderInstanceType
  const resource = getFirstSliderClusterFromGet({ deployment, sliderInstanceType })!
  const hideDelete =
    sliderInstanceType === `kibana` && isFeatureActivated(state, Feature.hideKibanaDelete)

  return {
    deployment,
    resource,
    regionId,
    sliderInstanceType,
    hideDelete,
  }
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(StackDeploymentSlider),
)
