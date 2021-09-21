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

import { connect } from 'react-redux'

import OutOfCapacityCulprits from './OutOfCapacityCulprits'

import { explainTopologyChanges } from '../../../../components/StackDeploymentConfigurationChange/StackConfigurationChangeExplain'

import { ExplainedChange } from '../../../../components/StackDeploymentConfigurationChange/StackConfigurationChangeExplain/types'

import { hostsAllocatorsUrl } from '../../../urlBuilder'
import { getPlanInfo } from '../../../stackDeployments'

import { getInstanceConfigurations } from '../../../../reducers'

import { AnyResourceInfo, SliderInstanceType, AnyClusterPlanInfo } from '../../../../types'

type StateProps = {
  allocatorsHref: string | null
  topologyChanges: ExplainedChange[]
}

interface DispatchProps {}

type ConsumerProps = {
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
}

const mapStateToProps = (
  state,
  { resource, resourceType, planAttempt }: ConsumerProps,
): StateProps => {
  const { region } = resource
  const instanceConfigurations = getInstanceConfigurations(state, region)

  const newSource = planAttempt.plan
  const oldSource = getPlanInfo({ resource, state: `last_success` })?.plan
  const topologyChanges = explainTopologyChanges({
    type: resourceType,
    newSource,
    oldSource,
    instanceConfigurations,
  })

  return {
    allocatorsHref: hostsAllocatorsUrl(region),
    topologyChanges,
  }
}

const mapDispatchToProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(OutOfCapacityCulprits)
