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

import { CuiTimestamp } from '../../cui'

import { ClusterPlanStepInfo } from '../../lib/api/v1/types'

type Props = {
  step: ClusterPlanStepInfo
}

const StepEnded: FunctionComponent<Props> = ({ step }) => {
  if (step.stage !== `completed` || !step.completed) {
    return null
  }

  return <CuiTimestamp date={step.completed} />
}

export default StepEnded
