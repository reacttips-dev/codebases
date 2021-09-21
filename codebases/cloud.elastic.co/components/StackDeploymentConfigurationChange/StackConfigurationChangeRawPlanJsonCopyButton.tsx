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

import CopyButton from '../CopyButton'

import { isFeatureActivated } from '../../store'

import stringify from '../../lib/stringify'

import { AnyClusterPlanInfo } from '../../types'
import Feature from '../../lib/feature'

type Props = {
  planAttempt: AnyClusterPlanInfo
}

const StackConfigurationChangeRawPlanJsonCopyButton: FunctionComponent<Props> = ({
  planAttempt,
}) => {
  if (!canCopyRawJson({ planAttempt })) {
    return null
  }

  return <CopyButton color='primary' value={stringify(planAttempt.plan)} />
}

export default StackConfigurationChangeRawPlanJsonCopyButton

export function canCopyRawJson({ planAttempt }: { planAttempt: AnyClusterPlanInfo }): boolean {
  const showRawSource = !isFeatureActivated(Feature.hidePlanDetails)
  const canCopy = showRawSource && planAttempt.plan
  return Boolean(canCopy)
}

export function getRawJson({ planAttempt }: { planAttempt: AnyClusterPlanInfo }): string {
  return stringify(planAttempt.plan)
}
