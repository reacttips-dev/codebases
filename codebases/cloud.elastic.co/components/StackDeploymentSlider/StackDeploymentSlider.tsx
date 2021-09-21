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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui'

import OverviewEnabled from './OverviewEnabled'
import OverviewDisabled from './OverviewDisabled'

import { isSliderEnabledInStackDeployment } from '../../lib/sliders'
import { deploymentEditUrl } from '../../lib/urlBuilder'

import {
  getPlanInfo,
  hasCreatePlan,
  getSizedTopology,
  isSliderPlanActive,
} from '../../lib/stackDeployments/selectors'

import { RegionId, SliderInstanceType, StackDeployment, AnyResourceInfo } from '../../types'

import './stackDeploymentSlider.scss'

type Props = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  regionId: RegionId
  sliderInstanceType: SliderInstanceType
  hideDelete: boolean
}

const StackDeploymentSlider: FunctionComponent<Props> = (props) => {
  const { deployment, resource, sliderInstanceType } = props

  if (hasCreatePlan({ deployment })) {
    return (
      <EuiFlexGroup gutterSize='m' alignItems='center'>
        <EuiFlexItem grow={false}>
          <EuiLoadingSpinner />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <FormattedMessage
            id='deployment-slider.waiting-for-progress-updates'
            defaultMessage='Waiting for progress updates'
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  const isDisabled = !isSliderEnabledInStackDeployment(deployment, sliderInstanceType)

  if (isDisabled) {
    return (
      <OverviewDisabled
        resource={resource}
        sliderInstanceType={sliderInstanceType}
        editUrl={deploymentEditUrl(deployment.id)}
      />
    )
  }

  const pendingPlan = getPlanInfo({ resource, state: 'pending' })

  if (pendingPlan) {
    return null // handled by `<DeploymentHealthProblems />`
  }

  const plan = getPlanInfo({ resource })
  const active = isSliderPlanActive(plan, sliderInstanceType)
  const sizedTopology = getSizedTopology({ resource })

  if (!active && !sizedTopology.length) {
    return (
      <OverviewDisabled
        resource={resource}
        sliderInstanceType={sliderInstanceType}
        editUrl={deploymentEditUrl(deployment.id)}
      />
    )
  }

  return <OverviewEnabled {...props} />
}

export default StackDeploymentSlider
