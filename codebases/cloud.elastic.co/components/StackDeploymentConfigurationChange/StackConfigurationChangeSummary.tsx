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

import StackConfigurationChangeExplain, {
  getPropsToExplainChangeFromAttempt,
} from './StackConfigurationChangeExplain'

import { getPlanBeforeAttempt, isPendingAttempt } from '../../lib/stackDeployments'

import { AnyResourceInfo, AnyClusterPlanInfo, SliderInstanceType } from '../../types'

type Props = {
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const StackConfigurationChangeSummary: FunctionComponent<Props> = ({
  resource,
  resourceType,
  planAttempt,
  spacerBefore,
  spacerAfter,
}) => {
  const { region, id } = resource

  const isPastHistory = !isPendingAttempt({ planAttempt })
  const prevPlan = getPlanBeforeAttempt({ resource, planAttempt })
  const explainAttemptProps = getPropsToExplainChangeFromAttempt({
    sliderInstanceType: resourceType,
    planAttempt,
    prevPlan,
  })

  return (
    <StackConfigurationChangeExplain
      regionId={region}
      elasticsearchClusterId={id}
      spacerBefore={spacerBefore}
      spacerAfter={spacerAfter}
      isPastHistory={isPastHistory}
      {...explainAttemptProps}
    />
  )
}

export default StackConfigurationChangeSummary
