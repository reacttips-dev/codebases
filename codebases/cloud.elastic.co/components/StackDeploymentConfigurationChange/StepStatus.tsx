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

import { EuiIcon, EuiLoadingSpinner } from '@elastic/eui'

import { ClusterPlanStepInfo } from '../../lib/api/v1/types'

type Props = {
  step: ClusterPlanStepInfo
  isPending?: boolean
}

const StepStatus: FunctionComponent<Props> = ({ step, isPending }) => {
  const pendingStep = step.status === `pending` || (step.stage !== `completed` && !step.completed)

  if (pendingStep) {
    /* This is an API bug: the _individual step_ is allegedly unfinished,
     * but the configuration change as a whole has ended.
     * At the time of this writing, it can be observed when plans fail, in the cleanup step.
     * We don't want to show a spinner in a step of a plan that has ended.
     * We show a warning indicator to call out the mistake in the API, without harming the UX.
     * See: https://github.com/elastic/cloud/issues/27729
     */
    if (!isPending) {
      return <EuiIcon type='dot' color='warning' />
    }

    return <EuiLoadingSpinner size='s' />
  }

  const healthy = step.status === `success`

  return <EuiIcon type='dot' color={healthy ? `success` : `danger`} />
}

export default StepStatus
