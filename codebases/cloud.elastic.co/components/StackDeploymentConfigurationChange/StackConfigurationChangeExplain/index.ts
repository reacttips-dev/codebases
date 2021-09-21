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

import StackConfigurationChangeExplain from './StackConfigurationChangeExplain'

import { fetchInstanceConfigurationsIfNeeded } from '../../../actions/topology/instanceConfigurations'

import { getInstanceConfigurations } from '../../../reducers'

import { PlanAttribution } from '../../../types'

import {
  ApmPlan,
  AppSearchPlan,
  ElasticsearchClusterPlan,
  InstanceConfiguration,
  KibanaClusterPlan,
  EnterpriseSearchPlan,
} from '../../../lib/api/v1/types'

type StateProps = {
  instanceConfigurations: InstanceConfiguration[]
}

type DispatchProps = {
  fetchInstanceConfigurations: () => void
}

type ConsumerProps = {
  regionId?: string
  elasticsearchClusterId?: string
  elasticsearchPlanAttribution?: PlanAttribution
  elasticsearchPlanSource?: ElasticsearchClusterPlan | null
  elasticsearchPlanPrevSource?: ElasticsearchClusterPlan | null
  kibanaPlanAttribution?: PlanAttribution
  kibanaPlanSource?: KibanaClusterPlan | null
  kibanaPlanPrevSource?: KibanaClusterPlan | null
  apmPlanAttribution?: PlanAttribution
  apmPlanSource?: ApmPlan | null
  apmPlanPrevSource?: ApmPlan | null
  appsearchPlanAttribution?: PlanAttribution
  appsearchPlanSource?: AppSearchPlan | null
  appsearchPlanPrevSource?: AppSearchPlan | null
  enterprise_searchPlanAttribution?: PlanAttribution
  enterprise_searchPlanSource?: EnterpriseSearchPlan | null
  enterprise_searchPlanPrevSource?: EnterpriseSearchPlan | null
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const mapStateToProps = (state, { regionId }) => ({
  instanceConfigurations: getInstanceConfigurations(state, regionId),
})

const mapDispatchToProps = (dispatch, { regionId }) => ({
  fetchInstanceConfigurations: () => dispatch(fetchInstanceConfigurationsIfNeeded(regionId)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackConfigurationChangeExplain)

export { getPropsToExplainChangeFromAttempt } from './explainChangeFromAttempt'
export { default as explainChanges, explainTopologyChanges } from './explainChanges'
