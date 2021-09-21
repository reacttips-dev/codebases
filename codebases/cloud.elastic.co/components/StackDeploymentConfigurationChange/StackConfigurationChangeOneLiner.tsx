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

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import StackConfigurationChangeAttribution from './StackConfigurationChangeAttribution'
import StackConfigurationChangeIcon from './StackConfigurationChangeIcon'
import StackConfigurationChangeId from './StackConfigurationChangeId'
import StackConfigurationChangeStatus from './StackConfigurationChangeStatus'

import { getPlanAttemptId, getPlanVersion } from '../../lib/stackDeployments'

import { AnyClusterPlanInfo, AnyResourceInfo, SliderInstanceType } from '../../types'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  hideAttribution?: boolean
}

const StackConfigurationChangeOneLiner: FunctionComponent<Props> = ({
  resource,
  sliderInstanceType,
  planAttempt,
  hideAttribution,
}) => (
  <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween' responsive={false}>
    <EuiFlexItem grow={false}>
      <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
        <EuiFlexItem grow={false}>
          <StackConfigurationChangeStatus
            resource={resource}
            resourceType={sliderInstanceType}
            planAttempt={planAttempt}
          />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <StackConfigurationChangeIcon
            kind={sliderInstanceType}
            version={getPlanVersion({ plan: planAttempt.plan })}
          />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <StackConfigurationChangeId
            kind={sliderInstanceType}
            id={getPlanAttemptId({ resource, planAttempt })}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>

    {hideAttribution || (
      <EuiFlexItem grow={false}>
        <StackConfigurationChangeAttribution kind={sliderInstanceType} planAttempt={planAttempt} />
      </EuiFlexItem>
    )}
  </EuiFlexGroup>
)

export default StackConfigurationChangeOneLiner
