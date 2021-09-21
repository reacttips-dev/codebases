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

import { EuiIcon, EuiLoadingSpinner, EuiToolTip } from '@elastic/eui'

import { parseConfigurationChangeError } from '../../lib/healthProblems/stackDeploymentHealth'
import { isPendingAttempt } from '../../lib/stackDeployments'

import { AnyResourceInfo, AnyClusterPlanInfo, SliderInstanceType } from '../../types'

import './stackConfigurationChangeStatus.scss'

type Props = {
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  concealPendingPlan?: boolean
}

const StackConfigurationChangeStatus: FunctionComponent<Props> = ({
  resource,
  resourceType,
  planAttempt,
  concealPendingPlan,
}) => {
  if (isPendingAttempt({ planAttempt }) && !concealPendingPlan) {
    return <EuiLoadingSpinner data-test-id='plan-attempt-spinner' size='m' />
  }

  const { healthy } = planAttempt

  const errorMessage = parseConfigurationChangeError({ resource, resourceType, planAttempt })
  const icon = <EuiIcon type='dot' size='l' color={healthy ? `success` : `danger`} />

  if (errorMessage === null) {
    return icon
  }

  const { title, description } = errorMessage
  const tooltipContent = description || title

  return (
    <EuiToolTip className='stackConfigurationChangeStatus-tooltip' content={tooltipContent}>
      <div>{icon}</div>
    </EuiToolTip>
  )
}

export default StackConfigurationChangeStatus
