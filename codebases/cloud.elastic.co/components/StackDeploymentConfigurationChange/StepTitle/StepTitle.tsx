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
import moment from 'moment'

import { EuiText } from '@elastic/eui'

import { CuiTimeAgo } from '../../../cui'

import { isPendingAttempt } from '../../../lib/stackDeployments'

import { describePlanAttemptStep } from '../../../lib/plan'

import { AsyncRequestState, AnyResourceInfo, AnyClusterPlanInfo } from '../../../types'
import { ClusterPlanStepInfo } from '../../../lib/api/v1/types'

type Props = {
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
  step: ClusterPlanStepInfo
  cancelPlanRequest: AsyncRequestState
}

const StepTitle: FunctionComponent<Props> = ({ planAttempt, step, cancelPlanRequest }) => {
  /* only pretend like the last step of pending plans are "cancelling",
   * otherwise every step of every plan shows as "cancelling" while a plan is being cancelled,
   * which would result in very awkward UX.
   */
  const pending = isPendingAttempt({ planAttempt })
  const { plan_attempt_log } = planAttempt
  const isLastMessage = plan_attempt_log.indexOf(step) === plan_attempt_log.length - 1

  const isCancelled =
    pending && isLastMessage && cancelPlanRequest.isDone && !cancelPlanRequest.error

  const { value } = describePlanAttemptStep(step, {
    isCancelled,
  })

  return (
    <div>
      <span data-test-id='plan-attempt-message'>{value}</span>
      {isLastMessage && pending && (
        <EuiText size='s' color='subdued'>
          <FormattedMessage
            id='pending-configuration-step.started-when'
            defaultMessage='Started { when }'
            values={{
              when: <CuiTimeAgo date={moment.utc(step.started)} shouldCapitalize={false} />,
            }}
          />
        </EuiText>
      )}
    </div>
  )
}

export default StepTitle
