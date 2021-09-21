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

import { isEmpty } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { CuiTable, CuiTableColumn } from '../../cui'

import StepStatus from './StepStatus'
import StepTitle from './StepTitle'
import StepStarted from './StepStarted'
import StepEnded from './StepEnded'
import StepDuration from './StepDuration'
import StepMessages from './StepMessages'

import { isPendingAttempt } from '../../lib/stackDeployments'

import { isFeatureActivated } from '../../store'

import {
  AnyResourceInfo,
  AnyClusterPlanInfo,
  StackDeployment,
  SliderInstanceType,
} from '../../types'

import { ClusterPlanStepInfo } from '../../lib/api/v1/types'
import Feature from '../../lib/feature'

type Props = {
  deployment: StackDeployment
  resourceType: SliderInstanceType
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
}

const StackConfigurationChangeSteps: FunctionComponent<Props> = ({
  deployment,
  resourceType,
  resource,
  planAttempt,
}) => {
  const steps = [...planAttempt.plan_attempt_log].reverse()
  const blockExpand = isFeatureActivated(Feature.blockExpandingPlanMessages)
  const hideStepDetails = blockExpand || steps.every(isStepWithoutDetails)
  const hasDetailRow = hideStepDetails ? false : isStepWithDetails

  if (steps.length === 0) {
    return null // sanity check
  }

  const columns: Array<CuiTableColumn<ClusterPlanStepInfo>> = [
    {
      render: (step: ClusterPlanStepInfo) => (
        <StepStatus step={step} isPending={isPendingAttempt({ planAttempt })} />
      ),
      width: '32px',
    },

    {
      label: <FormattedMessage id='configuration-change-steps.step' defaultMessage='Step' />,
      render: (step: ClusterPlanStepInfo) => (
        <StepTitle
          deployment={deployment}
          resourceType={resourceType}
          resource={resource}
          planAttempt={planAttempt}
          step={step}
        />
      ),
    },

    {
      label: <FormattedMessage id='configuration-change-steps.started' defaultMessage='Started' />,
      render: (step: ClusterPlanStepInfo) => <StepStarted step={step} />,
      width: '210px',
    },

    {
      label: <FormattedMessage id='configuration-change-steps.ended' defaultMessage='Ended' />,
      render: (step: ClusterPlanStepInfo) => <StepEnded step={step} />,
      width: '210px',
    },

    {
      label: (
        <FormattedMessage id='configuration-change-steps.duration' defaultMessage='Duration' />
      ),
      render: (step: ClusterPlanStepInfo) => <StepDuration step={step} />,
      width: '160px',
    },

    // otherwise we'd render an empty column in UC
    ...(hideStepDetails
      ? []
      : [
          {
            label: (
              <FormattedMessage id='configuration-change-steps.actions' defaultMessage='Actions' />
            ),
            render: () => null,
            actions: true,
            width: '80px',
          },
        ]),
  ]

  return (
    <CuiTable<ClusterPlanStepInfo>
      data-test-id='planAttemptMeta-configurationChangeSteps'
      rows={steps}
      columns={columns}
      getRowId={(step) => `${step.step_id}:${step.started}`}
      hasDetailRow={hasDetailRow}
      renderDetailRow={(step) => <DetailRow step={step} />}
      detailButtonProps={{
        'data-test-id': `expand-plan-attempt-message`,
      }}
    />
  )
}

function DetailRow({ step }: { step: ClusterPlanStepInfo }) {
  return <StepMessages stepMessages={step.info_log} />
}

function isStepWithDetails(step: ClusterPlanStepInfo) {
  return !isEmpty(step.info_log)
}

function isStepWithoutDetails(step: ClusterPlanStepInfo) {
  return !isStepWithDetails(step)
}

export default StackConfigurationChangeSteps
