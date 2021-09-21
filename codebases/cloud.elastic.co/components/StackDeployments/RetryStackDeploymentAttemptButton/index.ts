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

import { ReactNode } from 'react'
import { connect } from 'react-redux'

import { ButtonSize, ButtonColor } from '@elastic/eui'

import RetryStackDeploymentAttemptButton from './RetryStackDeploymentAttemptButton'

import { isFeatureActivated } from '../../../selectors'

import Feature from '../../../lib/feature'

import { DeploymentSearchResponse, DeploymentGetResponse } from '../../../lib/api/v1/types'

import { SliderInstanceType, ReduxState } from '../../../types'

type StackDeployment = DeploymentSearchResponse | DeploymentGetResponse

type StateProps = {
  hideAdminReapplyButton?: boolean
}

interface DispatchProps {}

type ConsumerProps = {
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
  disabled?: boolean
  children?: ReactNode
  size?: ButtonSize
  color?: ButtonColor
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  hideAdminReapplyButton: isFeatureActivated(state, Feature.hideAdminReapplyButton),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RetryStackDeploymentAttemptButton)
