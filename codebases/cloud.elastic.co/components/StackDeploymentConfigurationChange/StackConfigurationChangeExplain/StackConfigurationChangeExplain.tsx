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

import React, { Component, Fragment } from 'react'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import { withErrorBoundary } from '../../../cui'

import explainChanges from './explainChanges'

import { PlanAttribution } from '../../../types'

import {
  ApmPlan,
  AppSearchPlan,
  ElasticsearchClusterPlan,
  EnterpriseSearchPlan,
  InstanceConfiguration,
  KibanaClusterPlan,
} from '../../../lib/api/v1/types'
import { DisabledDataTierWarning } from './DisabledDataTierWarning'

type Props = {
  apmPlanAttribution?: PlanAttribution
  apmPlanPrevSource?: ApmPlan | null
  apmPlanSource?: ApmPlan | null
  appsearchPlanAttribution?: PlanAttribution
  appsearchPlanPrevSource?: AppSearchPlan | null
  appsearchPlanSource?: AppSearchPlan | null
  elasticsearchClusterId?: string
  elasticsearchPlanAttribution?: PlanAttribution
  elasticsearchPlanPrevSource?: ElasticsearchClusterPlan | null
  elasticsearchPlanSource?: ElasticsearchClusterPlan | null
  enterpriseSearchPlanAttribution?: PlanAttribution
  enterpriseSearchPlanPrevSource?: EnterpriseSearchPlan | null
  enterpriseSearchPlanSource?: EnterpriseSearchPlan | null
  fetchInstanceConfigurations: () => void
  instanceConfigurations: InstanceConfiguration[]
  isPastHistory: boolean
  kibanaPlanAttribution?: PlanAttribution
  kibanaPlanPrevSource?: KibanaClusterPlan | null
  kibanaPlanSource?: KibanaClusterPlan | null
  pruneOrphans?: boolean
  regionId?: string
  spacerAfter?: boolean
  spacerBefore?: boolean
}

class StackConfigurationChangeExplain extends Component<Props> {
  componentDidMount() {
    const { fetchInstanceConfigurations } = this.props
    fetchInstanceConfigurations()
  }

  render() {
    const {
      spacerBefore,
      spacerAfter,
      instanceConfigurations,
      isPastHistory,
      elasticsearchPlanSource,
      elasticsearchPlanPrevSource,
      pruneOrphans,
    } = this.props

    if (!instanceConfigurations) {
      return null
    }

    const explanations = explainChanges(this.props)

    if (explanations.length === 0) {
      return null
    }

    return (
      <Fragment>
        {spacerBefore && <EuiSpacer size='m' />}
        <DisabledDataTierWarning
          current={elasticsearchPlanPrevSource as ElasticsearchClusterPlan}
          next={elasticsearchPlanSource as ElasticsearchClusterPlan}
          isPastHistory={isPastHistory}
          pruneOrphans={pruneOrphans}
          instanceConfigurations={instanceConfigurations}
        />
        <div>
          {explanations.map((explanation) => (
            <EuiFlexGroup key={explanation.id} gutterSize='s'>
              <EuiFlexItem grow={false}>
                <div
                  data-test-id={explanation['data-test-id']}
                  data-test-explanation-id={explanation.id}
                  data-test-params={explanation.testParams}
                >
                  {explanation.message}
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          ))}
        </div>

        {spacerAfter && <EuiSpacer size='m' />}
      </Fragment>
    )
  }
}

export default withErrorBoundary(StackConfigurationChangeExplain)
