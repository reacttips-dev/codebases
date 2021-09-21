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

import React, { Fragment, FunctionComponent } from 'react'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import StepStatus from './StepStatus'
import StepTitle from './StepTitle'

import { isPendingAttempt } from '../../lib/stackDeployments'

import {
  AnyResourceInfo,
  AnyClusterPlanInfo,
  SliderInstanceType,
  StackDeployment,
} from '../../types'

type Props = {
  deployment: StackDeployment
  resourceType: SliderInstanceType
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const StackConfigurationChangePendingSteps: FunctionComponent<Props> = ({
  deployment,
  resourceType,
  resource,
  planAttempt,
  spacerBefore,
  spacerAfter,
}) => {
  if (!isPendingAttempt({ planAttempt })) {
    // sanity check to guard against API bugs
    return null
  }

  const pendingSteps = planAttempt.plan_attempt_log
    .filter((step) => step.stage !== `completed`)
    .reverse()

  if (pendingSteps.length === 0) {
    return null
  }

  return (
    <Fragment>
      {spacerBefore && <EuiSpacer size='m' />}

      {pendingSteps.map((step) => (
        <EuiFlexGroup
          key={`${step.step_id}:${step.started}`}
          gutterSize='s'
          alignItems='center'
          responsive={false}
        >
          <EuiFlexItem grow={false}>
            <StepStatus step={step} isPending={true} />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <div data-test-id='pendingPlan-progress'>
              <StepTitle
                deployment={deployment}
                resourceType={resourceType}
                resource={resource}
                planAttempt={planAttempt}
                step={step}
              />
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>
      ))}

      {spacerAfter && <EuiSpacer size='m' />}
    </Fragment>
  )
}

export default StackConfigurationChangePendingSteps
